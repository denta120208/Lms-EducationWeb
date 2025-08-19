package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/mux"
)

// CourseMaterial represents a course material
type CourseMaterial struct {
	ID          int       `json:"id"`
	CourseID    int       `json:"course_id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Type        string    `json:"type"` // "image", "pdf", "video", "youtube"
	FilePath    string    `json:"file_path"`
	YouTubeURL  string    `json:"youtube_url"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// CreateMaterialRequest represents the request body for material creation
type CreateMaterialRequest struct {
	CourseID    int    `json:"course_id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Type        string `json:"type"`
	FilePath    string `json:"file_path"`
	YouTubeURL  string `json:"youtube_url"`
}

// createCourseMaterialsTable creates the course_materials table if it doesn't exist
func createCourseMaterialsTable() error {
	query := `
		CREATE TABLE IF NOT EXISTS course_materials (
			id INT AUTO_INCREMENT PRIMARY KEY,
			course_id INT NOT NULL,
			title VARCHAR(255) NOT NULL,
			description TEXT,
			type ENUM('image', 'pdf', 'video', 'youtube') NOT NULL,
			file_path VARCHAR(500),
			youtube_url VARCHAR(500),
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
		)
	`

	_, err := DB.Exec(query)
	if err != nil {
		return fmt.Errorf("failed to create course_materials table: %v", err)
	}

	log.Println("✅ Course materials table created/verified successfully!")
	return nil
}

// createCourseMaterialHandler handles the creation of a new course material
func createCourseMaterialHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
	w.Header().Set("Content-Type", "application/json")

	// Get teacher ID from context
	teacherID, ok := r.Context().Value("user_id").(int)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Get course ID from URL
	vars := mux.Vars(r)
	courseIDStr := vars["courseId"]
	courseID, err := strconv.Atoi(courseIDStr)
	if err != nil {
		http.Error(w, "Invalid course ID", http.StatusBadRequest)
		return
	}

	// Verify that the course belongs to this teacher
	var courseBelongsToTeacher bool
	err = DB.QueryRow("SELECT EXISTS(SELECT 1 FROM courses WHERE id = ? AND teacher_id = ?)", courseID, teacherID).Scan(&courseBelongsToTeacher)
	if err != nil || !courseBelongsToTeacher {
		http.Error(w, "Course not found or access denied", http.StatusForbidden)
		return
	}

	// Parse the request body
	var req CreateMaterialRequest
	err = json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		log.Printf("Error decoding request body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Set course ID from URL
	req.CourseID = courseID

	// Validate required fields
	if req.Title == "" || req.Type == "" {
		http.Error(w, "Title and type are required", http.StatusBadRequest)
		return
	}

	// Validate type
	validTypes := map[string]bool{
		"image":   true,
		"pdf":     true,
		"video":   true,
		"youtube": true,
	}
	if !validTypes[req.Type] {
		http.Error(w, "Invalid material type", http.StatusBadRequest)
		return
	}

	// Validate based on type
	if req.Type == "youtube" && req.YouTubeURL == "" {
		http.Error(w, "YouTube URL is required for YouTube materials", http.StatusBadRequest)
		return
	}
	if (req.Type == "image" || req.Type == "pdf" || req.Type == "video") && req.FilePath == "" {
		http.Error(w, "File path is required for file-based materials", http.StatusBadRequest)
		return
	}

	// Insert the material into the database
	query := `
		INSERT INTO course_materials (course_id, title, description, type, file_path, youtube_url)
		VALUES (?, ?, ?, ?, ?, ?)
	`

	result, err := DB.Exec(query, req.CourseID, req.Title, req.Description, req.Type, req.FilePath, req.YouTubeURL)
	if err != nil {
		log.Printf("Error creating course material: %v", err)
		http.Error(w, "Failed to create course material", http.StatusInternalServerError)
		return
	}

	// Get the ID of the newly created material
	materialID, err := result.LastInsertId()
	if err != nil {
		log.Printf("Error getting last insert ID: %v", err)
		http.Error(w, "Failed to get material ID", http.StatusInternalServerError)
		return
	}

	// Create response
	material := CourseMaterial{
		ID:          int(materialID),
		CourseID:    req.CourseID,
		Title:       req.Title,
		Description: req.Description,
		Type:        req.Type,
		FilePath:    req.FilePath,
		YouTubeURL:  req.YouTubeURL,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	// Return the created material
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":  true,
		"message":  "Course material created successfully",
		"material": material,
	})
}

// getCourseMaterialsHandler retrieves all materials for a specific course
func getCourseMaterialsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Get course ID from URL
	vars := mux.Vars(r)
	courseIDStr := vars["courseId"]
	courseID, err := strconv.Atoi(courseIDStr)
	if err != nil {
		http.Error(w, "Invalid course ID", http.StatusBadRequest)
		return
	}

	// Get materials for the course
	materials, err := GetMaterialsByCourse(courseID)
	if err != nil {
		log.Printf("Error getting course materials: %v", err)
		http.Error(w, "Failed to get course materials", http.StatusInternalServerError)
		return
	}

	// Return the materials
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":   true,
		"materials": materials,
	})
}

// GetMaterialsByCourse retrieves all materials for a specific course
func GetMaterialsByCourse(courseID int) ([]CourseMaterial, error) {
	query := `
		SELECT id, course_id, title, description, type, 
		       IFNULL(file_path, '') as file_path, 
		       IFNULL(youtube_url, '') as youtube_url, 
		       created_at, updated_at
		FROM course_materials 
		WHERE course_id = ? 
		ORDER BY created_at DESC
	`

	rows, err := DB.Query(query, courseID)
	if err != nil {
		return nil, fmt.Errorf("error querying course materials: %v", err)
	}
	defer rows.Close()

	var materials []CourseMaterial
	for rows.Next() {
		var material CourseMaterial
		err := rows.Scan(
			&material.ID,
			&material.CourseID,
			&material.Title,
			&material.Description,
			&material.Type,
			&material.FilePath,
			&material.YouTubeURL,
			&material.CreatedAt,
			&material.UpdatedAt,
		)
		if err != nil {
			log.Printf("Error scanning material row: %v", err)
			continue
		}
		materials = append(materials, material)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error after scanning rows: %v", err)
	}

	return materials, nil
}

// deleteMaterialHandler handles the deletion of a course material
func deleteMaterialHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
	w.Header().Set("Content-Type", "application/json")

	// Get teacher ID from context
	teacherID, ok := r.Context().Value("user_id").(int)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Get material ID from URL
	vars := mux.Vars(r)
	materialIDStr := vars["materialId"]
	materialID, err := strconv.Atoi(materialIDStr)
	if err != nil {
		http.Error(w, "Invalid material ID", http.StatusBadRequest)
		return
	}

	// Verify that the material belongs to a course owned by this teacher
	var materialExists bool
	err = DB.QueryRow(`
		SELECT EXISTS(
			SELECT 1 FROM course_materials cm 
			JOIN courses c ON cm.course_id = c.id 
			WHERE cm.id = ? AND c.teacher_id = ?
		)
	`, materialID, teacherID).Scan(&materialExists)

	if err != nil || !materialExists {
		http.Error(w, "Material not found or access denied", http.StatusForbidden)
		return
	}

	// Delete the material
	_, err = DB.Exec("DELETE FROM course_materials WHERE id = ?", materialID)
	if err != nil {
		log.Printf("Error deleting material: %v", err)
		http.Error(w, "Failed to delete material", http.StatusInternalServerError)
		return
	}

	// Return success response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Material deleted successfully",
	})
}

// uploadMaterialFileHandler handles file uploads for course materials
func uploadMaterialFileHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
	w.Header().Set("Content-Type", "application/json")

	// Check if user is authenticated
	_, ok := r.Context().Value("user_id").(int)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Parse the multipart form
	err := r.ParseMultipartForm(100 << 20) // 100 MB max for materials
	if err != nil {
		log.Printf("Error parsing multipart form: %v", err)
		http.Error(w, "Error parsing form", http.StatusBadRequest)
		return
	}

	// Get the file from the form
	file, handler, err := r.FormFile("file")
	if err != nil {
		log.Printf("Error getting file: %v", err)
		http.Error(w, "Error retrieving file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Validate file size
	if handler.Size > 100<<20 { // 100 MB in bytes
		log.Printf("File too large: %d bytes", handler.Size)
		http.Error(w, "File too large. Maximum size is 100MB", http.StatusBadRequest)
		return
	}

	// Validate file type
	fileName := handler.Filename
	fileExt := strings.ToLower(filepath.Ext(fileName))

	// Check if the file extension is allowed
	allowedExts := map[string]bool{
		// Images
		".jpg":  true,
		".jpeg": true,
		".png":  true,
		".gif":  true,
		".webp": true,
		".bmp":  true,
		".svg":  true,
		// Documents
		".pdf":  true,
		".doc":  true,
		".docx": true,
		".xls":  true,
		".xlsx": true,
		".ppt":  true,
		".pptx": true,
		".txt":  true,
		".rtf":  true,
		".odt":  true,
		".ods":  true,
		".odp":  true,
		// Videos
		".mp4":  true,
		".avi":  true,
		".mov":  true,
		".wmv":  true,
		".flv":  true,
		".webm": true,
		".mkv":  true,
		".m4v":  true,
		".3gp":  true,
		".mpg":  true,
		".mpeg": true,
		// Audio
		".mp3":  true,
		".wav":  true,
		".flac": true,
		".aac":  true,
		".ogg":  true,
		".wma":  true,
		".m4a":  true,
		// Archives
		".zip": true,
		".rar": true,
		".7z":  true,
		".tar": true,
		".gz":  true,
		// Other
		".csv":  true,
		".json": true,
		".xml":  true,
	}

	if !allowedExts[fileExt] {
		log.Printf("Invalid file type: %s", fileExt)
		http.Error(w, "Invalid file type. Please upload a valid document, image, video, audio, or archive file.", http.StatusBadRequest)
		return
	}

	log.Printf("Material file upload: name=%s, size=%d bytes, type=%s", fileName, handler.Size, fileExt)

	// Create uploads directory if it doesn't exist
	uploadsDir := "./uploads/materials"
	if err := os.MkdirAll(uploadsDir, 0755); err != nil {
		log.Printf("Error creating uploads directory: %v", err)
		http.Error(w, "Error creating upload directory", http.StatusInternalServerError)
		return
	}

	// Generate unique filename
	timestamp := time.Now().Unix()
	uniqueFileName := fmt.Sprintf("%d_%s", timestamp, fileName)
	filePath := filepath.Join(uploadsDir, uniqueFileName)

	// Create the file
	dst, err := os.Create(filePath)
	if err != nil {
		log.Printf("Error creating file: %v", err)
		http.Error(w, "Error creating file", http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	// Copy the uploaded file to the destination
	_, err = io.Copy(dst, file)
	if err != nil {
		log.Printf("Error copying file: %v", err)
		http.Error(w, "Error saving file", http.StatusInternalServerError)
		return
	}

	// Create the URL path for the file
	urlPath := "/uploads/materials/" + uniqueFileName
	log.Printf("Material uploaded successfully. Path: %s", urlPath)

	response := map[string]interface{}{
		"success":   true,
		"file_path": urlPath,
		"message":   "File uploaded successfully",
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}
