package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

// EnrollmentRequest represents the request body for enrolling students
type EnrollmentRequest struct {
	StudentIDs []int `json:"student_ids"`
}

// getAvailableStudentsHandler returns all students that can be enrolled
func getAvailableStudentsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

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
		http.Error(w, "You don't have permission to manage this course", http.StatusForbidden)
		return
	}

	// Get all students
	query := `
		SELECT id, name, email 
		FROM students 
		ORDER BY name
	`
	rows, err := DB.Query(query)
	if err != nil {
		log.Printf("Error querying students: %v", err)
		http.Error(w, "Failed to get students", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var students []Student
	for rows.Next() {
		var student Student
		err := rows.Scan(&student.ID, &student.Name, &student.Email)
		if err != nil {
			log.Printf("Error scanning student row: %v", err)
			continue
		}
		students = append(students, student)
	}

	// Get currently enrolled students
	query = `
		SELECT student_id 
		FROM course_enrollments 
		WHERE course_id = ?
	`
	rows, err = DB.Query(query, courseID)
	if err != nil {
		log.Printf("Error querying enrollments: %v", err)
		http.Error(w, "Failed to get enrollments", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	enrolledStudents := make(map[int]bool)
	for rows.Next() {
		var studentID int
		err := rows.Scan(&studentID)
		if err != nil {
			log.Printf("Error scanning enrollment row: %v", err)
			continue
		}
		enrolledStudents[studentID] = true
	}

	// Add enrolled status to response
	type StudentWithEnrollment struct {
		Student
		IsEnrolled bool `json:"is_enrolled"`
	}

	var response []StudentWithEnrollment
	for _, student := range students {
		response = append(response, StudentWithEnrollment{
			Student:    student,
			IsEnrolled: enrolledStudents[student.ID],
		})
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"students": response,
	})
}

// updateEnrollmentsHandler handles enrolling/unenrolling students
func updateEnrollmentsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

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
		http.Error(w, "You don't have permission to manage this course", http.StatusForbidden)
		return
	}

	// Parse request body
	var req EnrollmentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Start transaction
	tx, err := DB.Begin()
	if err != nil {
		log.Printf("Error starting transaction: %v", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer tx.Rollback()

	// Delete all existing enrollments for this course
	_, err = tx.Exec("DELETE FROM course_enrollments WHERE course_id = ?", courseID)
	if err != nil {
		log.Printf("Error deleting existing enrollments: %v", err)
		http.Error(w, "Failed to update enrollments", http.StatusInternalServerError)
		return
	}

	// Insert new enrollments
	for _, studentID := range req.StudentIDs {
		_, err = tx.Exec(
			"INSERT INTO course_enrollments (course_id, student_id) VALUES (?, ?)",
			courseID, studentID,
		)
		if err != nil {
			log.Printf("Error enrolling student %d: %v", studentID, err)
			http.Error(w, "Failed to update enrollments", http.StatusInternalServerError)
			return
		}
	}

	// Commit transaction
	if err := tx.Commit(); err != nil {
		log.Printf("Error committing transaction: %v", err)
		http.Error(w, "Failed to update enrollments", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Enrollments updated successfully",
	})
}

// getEnrolledCoursesHandler returns courses that a student is enrolled in
func getEnrolledCoursesHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Get student ID from context
	studentID, ok := r.Context().Value("user_id").(int)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Get enrolled courses
	query := `
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
		INNER JOIN course_enrollments e ON c.id = e.course_id
		LEFT JOIN teachers t ON c.teacher_id = t.id
		WHERE e.student_id = ?
		ORDER BY c.created_at DESC
	`

	rows, err := DB.Query(query, studentID)
	if err != nil {
		log.Printf("Error querying enrolled courses: %v", err)
		http.Error(w, "Failed to get courses", http.StatusInternalServerError)
		return
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
			&course.CreatedAt,
		)
		if err != nil {
			log.Printf("Error scanning course row: %v", err)
			continue
		}
		courses = append(courses, course)
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"courses": courses,
	})
}