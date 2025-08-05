package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
)

// Content types
type ContentType string

const (
	Material ContentType = "material"
	Quiz     ContentType = "quiz"
	Task     ContentType = "task"
	Exam     ContentType = "exam"
)

// Content represents a course content item
type Content struct {
	ID          int         `json:"id"`
	CourseID    int         `json:"course_id"`
	Type        ContentType `json:"type"`
	Title       string      `json:"title"`
	Description string      `json:"description,omitempty"`
	Section     string      `json:"section"`
	Status      string      `json:"status"`
	Deadline    *time.Time  `json:"deadline,omitempty"`
	Questions   []Question  `json:"questions,omitempty"`
	CreatedAt   time.Time   `json:"created_at"`
	UpdatedAt   time.Time   `json:"updated_at"`
}

// Question represents a quiz/exam question
type Question struct {
	ID      int      `json:"id"`
	Text    string   `json:"question"`
	Options []Option `json:"options"`
}

// Option represents a question option
type Option struct {
	ID        int    `json:"id"`
	Text      string `json:"text"`
	IsCorrect bool   `json:"is_correct"`
}

// CreateContentRequest represents the request body for creating content
type CreateContentRequest struct {
	Type        ContentType `json:"type"`
	Title       string      `json:"title"`
	Description string      `json:"description"`
	Section     string      `json:"section"`
	Deadline    *time.Time  `json:"deadline,omitempty"`
	Questions   []Question  `json:"questions,omitempty"`
}

// getContentsHandler returns all contents for a course
func getContentsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Get course ID from URL
	vars := mux.Vars(r)
	courseID, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid course ID", http.StatusBadRequest)
		return
	}

	// Get teacher ID from context
	teacherID, ok := r.Context().Value("user_id").(int)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
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
		http.Error(w, "You don't have permission to access this course", http.StatusForbidden)
		return
	}

	// Get all contents for this course
	query := `
		SELECT 
			c.id,
			c.course_id,
			c.type,
			c.title,
			c.description,
			c.section,
			c.status,
			c.deadline,
			c.created_at,
			c.updated_at
		FROM contents c
		WHERE c.course_id = ?
		ORDER BY c.section, c.created_at
	`

	rows, err := DB.Query(query, courseID)
	if err != nil {
		log.Printf("Error querying contents: %v", err)
		http.Error(w, "Failed to get contents", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var contents []Content
	for rows.Next() {
		var content Content
		var deadline sql.NullTime
		err := rows.Scan(
			&content.ID,
			&content.CourseID,
			&content.Type,
			&content.Title,
			&content.Description,
			&content.Section,
			&content.Status,
			&deadline,
			&content.CreatedAt,
			&content.UpdatedAt,
		)
		if err != nil {
			log.Printf("Error scanning content row: %v", err)
			continue
		}

		if deadline.Valid {
			content.Deadline = &deadline.Time
		}

		// If content is quiz or exam, get questions
		if content.Type == Quiz || content.Type == Exam {
			questions, err := getQuestionsForContent(content.ID)
			if err != nil {
				log.Printf("Error getting questions for content %d: %v", content.ID, err)
			} else {
				content.Questions = questions
			}
		}

		contents = append(contents, content)
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"contents": contents,
	})
}

// createContentHandler creates a new content item
func createContentHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Get course ID from URL
	vars := mux.Vars(r)
	courseID, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid course ID", http.StatusBadRequest)
		return
	}

	// Get teacher ID from context
	teacherID, ok := r.Context().Value("user_id").(int)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
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
		http.Error(w, "You don't have permission to modify this course", http.StatusForbidden)
		return
	}

	// Parse request body
	var req CreateContentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate required fields
	if req.Title == "" {
		http.Error(w, "Title is required", http.StatusBadRequest)
		return
	}
	if req.Section == "" {
		http.Error(w, "Section is required", http.StatusBadRequest)
		return
	}
	if req.Type == Task && req.Deadline == nil {
		http.Error(w, "Deadline is required for tasks", http.StatusBadRequest)
		return
	}
	if (req.Type == Quiz || req.Type == Exam) && (len(req.Questions) == 0 || req.Questions[0].Text == "") {
		http.Error(w, "At least one question is required", http.StatusBadRequest)
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

	// Insert content
	result, err := tx.Exec(`
		INSERT INTO contents (
			course_id, type, title, description, section, status, deadline, created_at, updated_at
		) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
	`,
		courseID,
		req.Type,
		req.Title,
		req.Description,
		req.Section,
		"draft", // Default status
		req.Deadline,
	)
	if err != nil {
		log.Printf("Error inserting content: %v", err)
		http.Error(w, "Failed to create content", http.StatusInternalServerError)
		return
	}

	contentID, err := result.LastInsertId()
	if err != nil {
		log.Printf("Error getting last insert ID: %v", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	// If content is quiz or exam, insert questions
	if (req.Type == Quiz || req.Type == Exam) && len(req.Questions) > 0 {
		for _, question := range req.Questions {
			// Insert question
			result, err := tx.Exec(`
				INSERT INTO questions (content_id, question_text)
				VALUES (?, ?)
			`,
				contentID,
				question.Text,
			)
			if err != nil {
				log.Printf("Error inserting question: %v", err)
				http.Error(w, "Failed to create questions", http.StatusInternalServerError)
				return
			}

			questionID, err := result.LastInsertId()
			if err != nil {
				log.Printf("Error getting question ID: %v", err)
				http.Error(w, "Database error", http.StatusInternalServerError)
				return
			}

			// Insert options
			for _, option := range question.Options {
				_, err = tx.Exec(`
					INSERT INTO options (question_id, option_text, is_correct)
					VALUES (?, ?, ?)
				`,
					questionID,
					option.Text,
					option.IsCorrect,
				)
				if err != nil {
					log.Printf("Error inserting option: %v", err)
					http.Error(w, "Failed to create options", http.StatusInternalServerError)
					return
				}
			}
		}
	}

	// Commit transaction
	if err := tx.Commit(); err != nil {
		log.Printf("Error committing transaction: %v", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Content created successfully",
		"content_id": contentID,
	})
}

// getQuestionsForContent gets all questions and options for a content item
func getQuestionsForContent(contentID int) ([]Question, error) {
	query := `
		SELECT 
			q.id,
			q.question_text,
			o.id,
			o.option_text,
			o.is_correct
		FROM questions q
		LEFT JOIN options o ON o.question_id = q.id
		WHERE q.content_id = ?
		ORDER BY q.id, o.id
	`

	rows, err := DB.Query(query, contentID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	questions := make(map[int]*Question)
	var result []Question

	for rows.Next() {
		var questionID int
		var questionText string
		var optionID int
		var optionText string
		var isCorrect bool

		err := rows.Scan(&questionID, &questionText, &optionID, &optionText, &isCorrect)
		if err != nil {
			return nil, err
		}

		if _, exists := questions[questionID]; !exists {
			questions[questionID] = &Question{
				ID:      questionID,
				Text:    questionText,
				Options: []Option{},
			}
			result = append(result, *questions[questionID])
		}

		questions[questionID].Options = append(questions[questionID].Options, Option{
			ID:        optionID,
			Text:      optionText,
			IsCorrect: isCorrect,
		})
	}

	return result, nil
}

// updateContentHandler updates an existing content item
func updateContentHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Get content ID from URL
	vars := mux.Vars(r)
	contentID, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid content ID", http.StatusBadRequest)
		return
	}

	// Get teacher ID from context
	teacherID, ok := r.Context().Value("user_id").(int)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Verify content belongs to this teacher's course
	var ownerID int
	err = DB.QueryRow(`
		SELECT c.teacher_id 
		FROM contents ct
		JOIN courses c ON c.id = ct.course_id
		WHERE ct.id = ?
	`, contentID).Scan(&ownerID)
	if err != nil {
		log.Printf("Error verifying content ownership: %v", err)
		http.Error(w, "Content not found", http.StatusNotFound)
		return
	}

	if ownerID != teacherID {
		http.Error(w, "You don't have permission to modify this content", http.StatusForbidden)
		return
	}

	// Parse request body
	var req CreateContentRequest
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

	// Update content
	_, err = tx.Exec(`
		UPDATE contents 
		SET title = ?, description = ?, section = ?, deadline = ?, updated_at = NOW()
		WHERE id = ?
	`,
		req.Title,
		req.Description,
		req.Section,
		req.Deadline,
		contentID,
	)
	if err != nil {
		log.Printf("Error updating content: %v", err)
		http.Error(w, "Failed to update content", http.StatusInternalServerError)
		return
	}

	// If content is quiz or exam, update questions
	if (req.Type == Quiz || req.Type == Exam) && len(req.Questions) > 0 {
		// Delete existing questions and options
		_, err = tx.Exec(`
			DELETE o FROM options o
			JOIN questions q ON q.id = o.question_id
			WHERE q.content_id = ?
		`, contentID)
		if err != nil {
			log.Printf("Error deleting options: %v", err)
			http.Error(w, "Failed to update content", http.StatusInternalServerError)
			return
		}

		_, err = tx.Exec("DELETE FROM questions WHERE content_id = ?", contentID)
		if err != nil {
			log.Printf("Error deleting questions: %v", err)
			http.Error(w, "Failed to update content", http.StatusInternalServerError)
			return
		}

		// Insert new questions and options
		for _, question := range req.Questions {
			result, err := tx.Exec(`
				INSERT INTO questions (content_id, question_text)
				VALUES (?, ?)
			`,
				contentID,
				question.Text,
			)
			if err != nil {
				log.Printf("Error inserting question: %v", err)
				http.Error(w, "Failed to update content", http.StatusInternalServerError)
				return
			}

			questionID, err := result.LastInsertId()
			if err != nil {
				log.Printf("Error getting question ID: %v", err)
				http.Error(w, "Database error", http.StatusInternalServerError)
				return
			}

			for _, option := range question.Options {
				_, err = tx.Exec(`
					INSERT INTO options (question_id, option_text, is_correct)
					VALUES (?, ?, ?)
				`,
					questionID,
					option.Text,
					option.IsCorrect,
				)
				if err != nil {
					log.Printf("Error inserting option: %v", err)
					http.Error(w, "Failed to update content", http.StatusInternalServerError)
					return
				}
			}
		}
	}

	// Commit transaction
	if err := tx.Commit(); err != nil {
		log.Printf("Error committing transaction: %v", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Content updated successfully",
	})
}

// deleteContentHandler deletes a content item and all related data
func deleteContentHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Get content ID from URL
	vars := mux.Vars(r)
	contentID, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid content ID", http.StatusBadRequest)
		return
	}

	// Get teacher ID from context
	teacherID, ok := r.Context().Value("user_id").(int)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Verify content belongs to this teacher's course
	var ownerID int
	err = DB.QueryRow(`
		SELECT c.teacher_id 
		FROM contents ct
		JOIN courses c ON c.id = ct.course_id
		WHERE ct.id = ?
	`, contentID).Scan(&ownerID)
	if err != nil {
		log.Printf("Error verifying content ownership: %v", err)
		http.Error(w, "Content not found", http.StatusNotFound)
		return
	}

	if ownerID != teacherID {
		http.Error(w, "You don't have permission to delete this content", http.StatusForbidden)
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

	// Delete options and questions first (if any)
	_, err = tx.Exec(`
		DELETE o FROM options o
		JOIN questions q ON q.id = o.question_id
		WHERE q.content_id = ?
	`, contentID)
	if err != nil {
		log.Printf("Error deleting options: %v", err)
		http.Error(w, "Failed to delete content", http.StatusInternalServerError)
		return
	}

	_, err = tx.Exec("DELETE FROM questions WHERE content_id = ?", contentID)
	if err != nil {
		log.Printf("Error deleting questions: %v", err)
		http.Error(w, "Failed to delete content", http.StatusInternalServerError)
		return
	}

	// Delete content
	_, err = tx.Exec("DELETE FROM contents WHERE id = ?", contentID)
	if err != nil {
		log.Printf("Error deleting content: %v", err)
		http.Error(w, "Failed to delete content", http.StatusInternalServerError)
		return
	}

	// Commit transaction
	if err := tx.Commit(); err != nil {
		log.Printf("Error committing transaction: %v", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Content deleted successfully",
	})
}