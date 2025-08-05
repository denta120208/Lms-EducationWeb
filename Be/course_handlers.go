package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

// DeleteCourseRequest represents the request body for course deletion
type DeleteCourseRequest struct {
	CourseID int `json:"course_id"`
}

// UpdateCourseRequest represents the request body for course update
type UpdateCourseRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	ImagePath   string `json:"image_path"`
	Subject     string `json:"subject"`
}

// deleteImageFile removes an image file from the uploads directory
func deleteImageFile(imagePath string) error {
	if imagePath == "" {
		return nil
	}

	// Remove the leading "/uploads/" from the path
	imagePath = strings.TrimPrefix(imagePath, "/uploads/")
	fullPath := filepath.Join("./uploads", imagePath)

	// Check if file exists
	if _, err := os.Stat(fullPath); os.IsNotExist(err) {
		log.Printf("Image file not found: %s", fullPath)
		return nil
	}

	// Delete the file
	err := os.Remove(fullPath)
	if err != nil {
		log.Printf("Error deleting image file: %v", err)
		return err
	}

	log.Printf("Successfully deleted image file: %s", fullPath)
	return nil
}

// deleteCourseHandler handles the DELETE request for a course
func deleteCourseHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Get teacher ID from context
	teacherID, ok := r.Context().Value("user_id").(int)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Parse course ID from request
	var req DeleteCourseRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Get the current image path before deleting the course
	var imagePath string
	err := DB.QueryRow("SELECT image_path FROM courses WHERE id = ? AND teacher_id = ?", req.CourseID, teacherID).Scan(&imagePath)
	if err != nil {
		log.Printf("Error getting course image path: %v", err)
		http.Error(w, "Course not found", http.StatusNotFound)
		return
	}

	// Delete the course from database
	result, err := DB.Exec("DELETE FROM courses WHERE id = ? AND teacher_id = ?", req.CourseID, teacherID)
	if err != nil {
		log.Printf("Error deleting course: %v", err)
		http.Error(w, "Failed to delete course", http.StatusInternalServerError)
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil || rowsAffected == 0 {
		http.Error(w, "Course not found or unauthorized", http.StatusNotFound)
		return
	}

	// Delete the image file if it exists
	if imagePath != "" {
		if err := deleteImageFile(imagePath); err != nil {
			log.Printf("Warning: Failed to delete image file: %v", err)
			// Continue anyway as the course was deleted
		}
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Course deleted successfully",
	})
}

// updateCourseHandler handles the PUT request for updating a course
func updateCourseHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Get teacher ID from context
	teacherID, ok := r.Context().Value("user_id").(int)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Parse course ID from URL path
	courseID := getCourseIDFromPath(r.URL.Path)
	if courseID == 0 {
		http.Error(w, "Invalid course ID", http.StatusBadRequest)
		return
	}

	// Parse request body
	var req UpdateCourseRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Get the current course data
	var currentImagePath string
	err := DB.QueryRow("SELECT image_path FROM courses WHERE id = ? AND teacher_id = ?", courseID, teacherID).Scan(&currentImagePath)
	if err != nil {
		log.Printf("Error getting current course data: %v", err)
		http.Error(w, "Course not found", http.StatusNotFound)
		return
	}

	// If a new image is provided and it's different from the current one
	if req.ImagePath != "" && req.ImagePath != currentImagePath {
		// Delete the old image
		if currentImagePath != "" {
			if err := deleteImageFile(currentImagePath); err != nil {
				log.Printf("Warning: Failed to delete old image file: %v", err)
				// Continue anyway as we're updating with a new image
			}
		}
	}

	// Update the course in database
	result, err := DB.Exec(`
		UPDATE courses 
		SET title = ?, description = ?, subject = ?, image_path = ?
		WHERE id = ? AND teacher_id = ?`,
		req.Title, req.Description, req.Subject, req.ImagePath, courseID, teacherID)
	
	if err != nil {
		log.Printf("Error updating course: %v", err)
		http.Error(w, "Failed to update course", http.StatusInternalServerError)
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil || rowsAffected == 0 {
		http.Error(w, "Course not found or unauthorized", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Course updated successfully",
	})
}

// Helper function to extract course ID from URL path
func getCourseIDFromPath(path string) int {
	parts := strings.Split(path, "/")
	if len(parts) < 4 {
		return 0
	}
	var courseID int
	_, err := fmt.Sscanf(parts[len(parts)-1], "%d", &courseID)
	if err != nil {
		return 0
	}
	return courseID
}