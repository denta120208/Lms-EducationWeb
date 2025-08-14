package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

// UpdateCourseRequest represents the request body for course update
type UpdateCourseRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	ImagePath   string `json:"image_path"`
	Subject     string `json:"subject"`

}

// updateCourseHandler handles updating an existing course
func updateCourseHandler(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers explicitly
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
	w.Header().Set("Content-Type", "application/json")

	// Handle OPTIONS request
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Get teacher ID from context
	teacherID, ok := r.Context().Value("user_id").(int)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Get course ID from URL
	vars := mux.Vars(r)
	courseID, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid course ID", http.StatusBadRequest)
		return
	}

	// Verify course belongs to this teacher
	var ownerID int
	err = DB.QueryRow("SELECT teacher_id FROM courses WHERE id = ?", courseID).Scan(&ownerID)
	if err != nil {
		log.Printf("Error verifying course ownership: %v", err)
		http.Error(w, "Course not found", http.StatusNotFound)
		return
	}

	if ownerID != teacherID {
		http.Error(w, "You don't have permission to edit this course", http.StatusForbidden)
		return
	}

	// Parse the request body
	var req UpdateCourseRequest
	err = json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		log.Printf("Error decoding request body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate required fields
	if req.Title == "" || req.Subject == "" {
		http.Error(w, "Title and subject are required", http.StatusBadRequest)
		return
	}

	// Get current image path before update
	var currentImagePath string
	err = DB.QueryRow("SELECT image_path FROM courses WHERE id = ?", courseID).Scan(&currentImagePath)
	if err != nil {
		log.Printf("Error getting current image path: %v", err)
	}

	// Update the course in the database
	query := `
		UPDATE courses
		SET title = ?, description = ?, image_path = ?, subject = ?
		WHERE id = ?
	`

	// Log the values being updated
	log.Printf("Updating course %d: Title=%s, Description=%s, ImagePath=%s, Subject=%s",
		courseID, req.Title, req.Description, req.ImagePath, req.Subject)

	_, err = DB.Exec(query, req.Title, req.Description, req.ImagePath, req.Subject, courseID)
	if err != nil {
		log.Printf("Error updating course: %v", err)
		http.Error(w, "Failed to update course", http.StatusInternalServerError)
		return
	}

	// Delete old image if there's a new image or if image is being removed
	if currentImagePath != "" && currentImagePath != req.ImagePath {
		log.Printf("Deleting old image: %s", currentImagePath)
		if err := deleteFile(currentImagePath); err != nil {
			log.Printf("Warning: Failed to delete old image %s: %v", currentImagePath, err)
		}
	}

	// Get updated course
	var course CourseWithImage
	query = `
		SELECT 
			c.id, 
			c.title, 
			c.description, 
			IFNULL(c.image_path, '') as image_path,
			c.teacher_id, 
			IFNULL(t.name, 'Unknown Teacher') as teacher_name,
			c.subject,
			c.created_at
		FROM courses c
		LEFT JOIN teachers t ON c.teacher_id = t.id
		WHERE c.id = ?
	`
	err = DB.QueryRow(query, courseID).Scan(
		&course.ID,
		&course.Title,
		&course.Description,
		&course.ImagePath,
		&course.TeacherID,
		&course.TeacherName,
		&course.Subject,

		&course.CreatedAt,
	)
	if err != nil {
		log.Printf("Error getting updated course: %v", err)
		http.Error(w, "Course updated but failed to retrieve updated data", http.StatusInternalServerError)
		return
	}

	// Return success response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Course updated successfully",
		"course":  course,
	})
}

// deleteCourseHandler handles deleting a course
func deleteCourseHandler(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers explicitly
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
	w.Header().Set("Content-Type", "application/json")

	// Handle OPTIONS request
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Get teacher ID from context
	teacherID, ok := r.Context().Value("user_id").(int)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Get course ID from URL
	vars := mux.Vars(r)
	courseID, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid course ID", http.StatusBadRequest)
		return
	}

	// Verify course belongs to this teacher
	var ownerID int
	err = DB.QueryRow("SELECT teacher_id FROM courses WHERE id = ?", courseID).Scan(&ownerID)
	if err != nil {
		log.Printf("Error verifying course ownership: %v", err)
		http.Error(w, "Course not found", http.StatusNotFound)
		return
	}

	if ownerID != teacherID {
		http.Error(w, "You don't have permission to delete this course", http.StatusForbidden)
		return
	}

	// Get image path before deleting course
	var imagePath string
	err = DB.QueryRow("SELECT image_path FROM courses WHERE id = ?", courseID).Scan(&imagePath)
	if err != nil {
		log.Printf("Error getting image path: %v", err)
	}

	// Delete the course
	_, err = DB.Exec("DELETE FROM courses WHERE id = ?", courseID)
	if err != nil {
		log.Printf("Error deleting course: %v", err)
		http.Error(w, "Failed to delete course", http.StatusInternalServerError)
		return
	}

	// Delete the image file if it exists
	if imagePath != "" {
		if err := deleteFile(imagePath); err != nil {
			log.Printf("Warning: Failed to delete image %s: %v", imagePath, err)
		}
	}

	// Return success response
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Course deleted successfully",
	})
}