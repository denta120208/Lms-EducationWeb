package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

// CourseWithImage extends the base Course struct with additional fields for image and created_at
type CourseWithImage struct {
	ID          int       `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	ImagePath   string    `json:"image_path"`
	TeacherID   int       `json:"teacher_id"`
	TeacherName string    `json:"teacher_name"`
	Subject     string    `json:"subject"`
	Grade       string    `json:"grade"`
	CreatedAt   time.Time `json:"created_at"`
}

// CreateCourseRequest represents the request body for course creation
type CreateCourseRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	ImagePath   string `json:"image_path"`
	Subject     string `json:"subject"`
	Grade       string `json:"grade"`
}

// UploadResponse represents the response for file uploads
type UploadResponse struct {
	Success  bool   `json:"success"`
	FilePath string `json:"file_path"`
	Message  string `json:"message"`
}

// createCourseHandler handles the creation of a new course
func createCourseHandler(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers explicitly
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

	// Parse the request body
	var req CreateCourseRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		log.Printf("Error decoding request body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Log the received data
	log.Printf("Received course creation request: Title=%s, Subject=%s, ImagePath=%s", 
		req.Title, req.Subject, req.ImagePath)

	// Validate required fields
	if req.Title == "" || req.Subject == "" {
		http.Error(w, "Title and subject are required", http.StatusBadRequest)
		return
	}

	// Insert the course into the database
	query := `
		INSERT INTO courses (title, description, image_path, teacher_id, subject, grade)
		VALUES (?, ?, ?, ?, ?, ?)
	`

	// Log the values being inserted
	log.Printf("Inserting course into database: Title=%s, Description=%s, ImagePath=%s, TeacherID=%d, Subject=%s, Grade=%s",
		req.Title, req.Description, req.ImagePath, teacherID, req.Subject, req.Grade)

	result, err := DB.Exec(query, req.Title, req.Description, req.ImagePath, teacherID, req.Subject, req.Grade)
	if err != nil {
		log.Printf("Error creating course: %v", err)
		http.Error(w, "Failed to create course", http.StatusInternalServerError)
		return
	}

	// Get the ID of the newly created course
	courseID, err := result.LastInsertId()
	if err != nil {
		log.Printf("Error getting last insert ID: %v", err)
		http.Error(w, "Failed to get course ID", http.StatusInternalServerError)
		return
	}

	// Get teacher name
	var teacherName string
	err = DB.QueryRow("SELECT name FROM teachers WHERE id = ?", teacherID).Scan(&teacherName)
	if err != nil {
		log.Printf("Error getting teacher name: %v", err)
		teacherName = "Unknown Teacher"
	}

	// Create response
	course := CourseWithImage{
		ID:          int(courseID),
		Title:       req.Title,
		Description: req.Description,
		ImagePath:   req.ImagePath,
		TeacherID:   teacherID,
		TeacherName: teacherName,
		Subject:     req.Subject,
		Grade:       req.Grade,
		CreatedAt:   time.Now(),
	}

	// Return the created course
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Course created successfully",
		"course":  course,
	})
}

// uploadFileHandler handles file uploads
func uploadFileHandler(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers explicitly
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
	w.Header().Set("Content-Type", "application/json")

	// Check if user is authenticated and get teacher ID
	teacherID, ok := r.Context().Value("user_id").(int)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	
	// Log the teacher ID for debugging
	log.Printf("Upload file request from teacher ID: %d", teacherID)

	// Parse the multipart form
	err := r.ParseMultipartForm(10 << 20) // 10 MB max
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

	// Create uploads directory if it doesn't exist
	uploadsDir := "./uploads"
	if _, err := os.Stat(uploadsDir); os.IsNotExist(err) {
		err = os.MkdirAll(uploadsDir, 0755)
		if err != nil {
			log.Printf("Error creating uploads directory: %v", err)
			http.Error(w, "Server error", http.StatusInternalServerError)
			return
		}
	}

	// Generate a unique filename
	filename := fmt.Sprintf("%d_%s", time.Now().UnixNano(), handler.Filename)
	filename = strings.ReplaceAll(filename, " ", "_")

	// Create the file
	filePath := filepath.Join(uploadsDir, filename)
	dst, err := os.Create(filePath)
	if err != nil {
		log.Printf("Error creating file: %v", err)
		http.Error(w, "Error saving file", http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	// Copy the file content
	_, err = io.Copy(dst, file)
	if err != nil {
		log.Printf("Error copying file: %v", err)
		http.Error(w, "Error saving file", http.StatusInternalServerError)
		return
	}

	// Return the file path
	response := UploadResponse{
		Success:  true,
		FilePath: "/uploads/" + filename,
		Message:  "File uploaded successfully",
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

// GetCoursesWithImagesByTeacher retrieves all courses with images for a specific teacher
func GetCoursesWithImagesByTeacher(teacherID int) ([]CourseWithImage, error) {
	// First check if the courses table exists
	var tableExists bool
	err := DB.QueryRow("SELECT 1 FROM information_schema.tables WHERE table_name = 'courses' LIMIT 1").Scan(&tableExists)
	if err != nil || !tableExists {
		log.Printf("Courses table does not exist or error checking: %v", err)
		// Return empty array instead of error
		return []CourseWithImage{}, nil
	}

	// Try to get courses with LEFT JOIN to handle missing teachers table
	query := `
		SELECT c.id, c.title, c.description, IFNULL(c.image_path, '') as image_path, c.teacher_id, 
		       IFNULL(t.name, 'Unknown Teacher') as teacher_name, c.subject, IFNULL(c.grade, '') as grade, 
		       IFNULL(c.created_at, NOW()) as created_at
		FROM courses c
		LEFT JOIN teachers t ON c.teacher_id = t.id
		WHERE c.teacher_id = ?
		ORDER BY c.created_at DESC
	`

	rows, err := DB.Query(query, teacherID)
	if err != nil {
		log.Printf("Error querying courses: %v", err)
		// Return empty array instead of error
		return []CourseWithImage{}, nil
	}
	defer rows.Close()

	var courses []CourseWithImage
	for rows.Next() {
		var course CourseWithImage
		err := rows.Scan(
			&course.ID,
			&course.Title,
			&course.Description,
			&course.ImagePath,
			&course.TeacherID,
			&course.TeacherName,
			&course.Subject,
			&course.Grade,
			&course.CreatedAt,
		)
		if err != nil {
			log.Printf("Error scanning course row: %v", err)
			continue // Skip this row and continue
		}
		courses = append(courses, course)
	}

	if err = rows.Err(); err != nil {
		log.Printf("Error after scanning rows: %v", err)
		// Return what we have so far
		return courses, nil
	}

	// If no courses found, return empty array
	if len(courses) == 0 {
		log.Printf("No courses found for teacher ID %d", teacherID)
	}

	return courses, nil
}

// GetTeacherById retrieves a teacher by ID
func GetTeacherById(teacherID int) (*struct {
	ID      int    `json:"id"`
	Name    string `json:"name"`
	Email   string `json:"email"`
	Subject string `json:"subject"`
}, error) {
	teacher := &struct {
		ID      int    `json:"id"`
		Name    string `json:"name"`
		Email   string `json:"email"`
		Subject string `json:"subject"`
	}{}

	// First try the teachers table
	err := DB.QueryRow("SELECT id, name, email, subject FROM teachers WHERE id = ?", teacherID).
		Scan(&teacher.ID, &teacher.Name, &teacher.Email, &teacher.Subject)
	
	if err == nil {
		return teacher, nil
	}
	
	// If not found in teachers table, try the users table with role='guru'
	if err == sql.ErrNoRows {
		log.Printf("Teacher not found in teachers table, trying users table...")
		err = DB.QueryRow("SELECT id, name, email, '' FROM users WHERE id = ? AND role = 'guru'", teacherID).
			Scan(&teacher.ID, &teacher.Name, &teacher.Email, &teacher.Subject)
		
		if err != nil {
			log.Printf("Error querying users table: %v", err)
			return nil, err
		}
		return teacher, nil
	}
	
	log.Printf("Database error when querying teachers: %v", err)
	return nil, err
}

// teacherCoursesHandler handles the GET request for teacher's courses
func teacherCoursesHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Get teacher ID from context
	teacherID, ok := r.Context().Value("user_id").(int)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Get teacher information using GetTeacherById function
	teacher, err := GetTeacherById(teacherID)
	if err != nil {
		log.Printf("Error getting teacher with ID %d: %v", teacherID, err)
		http.Error(w, "Teacher not found or database error", http.StatusInternalServerError)
		return
	}

	// Get courses taught by this teacher
	courses, err := GetCoursesWithImagesByTeacher(teacherID)
	if err != nil {
		log.Printf("Error getting courses: %v", err)
		http.Error(w, "Failed to get courses", http.StatusInternalServerError)
		return
	}

	// Return the teacher's courses
	response := map[string]interface{}{
		"teacher": teacher,
		"courses": courses,
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}