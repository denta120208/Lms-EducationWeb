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

// Course represents a course in the system
type Course struct {
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
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

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

	result, err := db.Exec(query, req.Title, req.Description, req.ImagePath, teacherID, req.Subject, req.Grade)
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
	err = db.QueryRow("SELECT name FROM users WHERE id = ?", teacherID).Scan(&teacherName)
	if err != nil {
		log.Printf("Error getting teacher name: %v", err)
		teacherName = "Unknown Teacher"
	}

	// Create response
	course := Course{
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
	w.Header().Set("Content-Type", "application/json")

	// Check if user is authenticated
	_, ok := r.Context().Value("user_id").(int)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

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

// GetCoursesByTeacher retrieves all courses for a specific teacher
func GetCoursesByTeacher(teacherID int) ([]Course, error) {
	query := `
		SELECT c.id, c.title, c.description, c.image_path, c.teacher_id, 
		       u.name as teacher_name, c.subject, c.grade, c.created_at
		FROM courses c
		JOIN users u ON c.teacher_id = u.id
		WHERE c.teacher_id = ?
		ORDER BY c.created_at DESC
	`

	rows, err := db.Query(query, teacherID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var courses []Course
	for rows.Next() {
		var course Course
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
			return nil, err
		}
		courses = append(courses, course)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return courses, nil
}

// Update the teacherCoursesHandler to use the new GetCoursesByTeacher function
func teacherCoursesHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Get teacher ID from context
	teacherID, ok := r.Context().Value("user_id").(int)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Get teacher information
	var teacher struct {
		ID      int    `json:"id"`
		Name    string `json:"name"`
		Email   string `json:"email"`
		Subject string `json:"subject"`
	}

	err := db.QueryRow("SELECT id, name, email, subject FROM users WHERE id = ? AND role = 'teacher'", teacherID).
		Scan(&teacher.ID, &teacher.Name, &teacher.Email, &teacher.Subject)
	
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Teacher not found", http.StatusNotFound)
		} else {
			log.Printf("Database error: %v", err)
			http.Error(w, "Server error", http.StatusInternalServerError)
		}
		return
	}

	// Get courses taught by this teacher
	courses, err := GetCoursesByTeacher(teacherID)
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