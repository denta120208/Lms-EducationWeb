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
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/mux"
)

// ...existing code...

// Quiz structures
type Quiz struct {
	ID          int        `json:"id"`
	Title       string     `json:"title"`
	Description string     `json:"description"`
	CourseID    int        `json:"course_id"`
	QuizType    string     `json:"quiz_type"`
	PDFFilePath string     `json:"pdf_file_path,omitempty"`
	TimeLimit   *int       `json:"time_limit,omitempty"`
	TotalPoints int        `json:"total_points"`
	IsActive    bool       `json:"is_active"`
	DueDate     *time.Time `json:"due_date,omitempty"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
	Questions   []Question `json:"questions,omitempty"`
}

type Question struct {
	ID             int       `json:"id"`
	QuizID         int       `json:"quiz_id"`
	QuestionType   string    `json:"question_type"`
	Points         int       `json:"points"`
	QuestionText   string    `json:"question"`
	OptionA        string    `json:"option_a,omitempty"`
	OptionB        string    `json:"option_b,omitempty"`
	OptionC        string    `json:"option_c,omitempty"`
	OptionD        string    `json:"option_d,omitempty"`
	CorrectAnswer  string    `json:"correct_answer,omitempty"`
	EssayAnswerKey string    `json:"essay_answer_key,omitempty"`
	CreatedAt      time.Time `json:"created_at"`
}

type QuizSubmission struct {
	ID               int        `json:"id"`
	QuizID           int        `json:"quiz_id"`
	StudentID        int        `json:"student_id"`
	SubmissionType   string     `json:"submission_type"`
	Answers          string     `json:"answers,omitempty"`
	UploadedFilePath string     `json:"uploaded_file_path,omitempty"`
	Score            *float64   `json:"score,omitempty"`
	TotalPoints      int        `json:"total_points"`
	SubmittedAt      time.Time  `json:"submitted_at"`
	GradedAt         *time.Time `json:"graded_at,omitempty"`
	GradedBy         *int       `json:"graded_by,omitempty"`
	Feedback         string     `json:"feedback,omitempty"`
}

type CreateQuizRequest struct {
	Title       string                  `json:"title"`
	Description string                  `json:"description"`
	CourseID    int                     `json:"course_id"`
	QuizType    string                  `json:"quiz_type"`
	PDFFilePath string                  `json:"pdf_file_path,omitempty"`
	TimeLimit   *int                    `json:"time_limit"`
	TotalPoints int                     `json:"total_points"`
	DueDate     *time.Time              `json:"due_date"`
	Questions   []CreateQuestionRequest `json:"questions"`
}

type CreateQuestionRequest struct {
	QuestionType   string `json:"question_type"`
	Points         int    `json:"points"`
	QuestionText   string `json:"question"`
	OptionA        string `json:"option_a,omitempty"`
	OptionB        string `json:"option_b,omitempty"`
	OptionC        string `json:"option_c,omitempty"`
	OptionD        string `json:"option_d,omitempty"`
	CorrectAnswer  string `json:"correct_answer,omitempty"`
	EssayAnswerKey string `json:"essay_answer_key,omitempty"`
}

// createQuizHandler handles quiz creation
func createQuizHandler(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
	w.Header().Set("Content-Type", "application/json")

	log.Printf("Quiz creation request received")

	// Get teacher ID from context
	teacherID, ok := r.Context().Value("user_id").(int)
	if !ok {
		log.Printf("Teacher ID not found in context")
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	log.Printf("Teacher ID: %d", teacherID)

	// Custom decoder to handle flexible date format
	var raw map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&raw); err != nil {
		log.Printf("Error decoding request: %v", err)
		http.Error(w, "Invalid request format", http.StatusBadRequest)
		return
	}
	// Parse due_date flexibly
	var dueDatePtr *time.Time
	if rawDue, ok := raw["due_date"]; ok && rawDue != nil {
		switch v := rawDue.(type) {
		case string:
			var parsed time.Time
			layouts := []string{
				time.RFC3339,
				"2006-01-02T15:04",
				"2006-01-02T15:04:05",
				"2006-01-02 15:04:05",
				"2006-01-02 15:04",
			}
			for _, layout := range layouts {
				t, err := time.Parse(layout, v)
				if err == nil {
					parsed = t
					dueDatePtr = &parsed
					break
				}
			}
			if dueDatePtr == nil {
				log.Printf("Error parsing due_date: %v", v)
			}
		}
	}
	// Build CreateQuizRequest from raw
	req := CreateQuizRequest{
		Title:       getString(raw["title"]),
		Description: getString(raw["description"]),
		CourseID:    getInt(raw["course_id"]),
		QuizType:    getString(raw["quiz_type"]),
		PDFFilePath: getString(raw["pdf_file_path"]),
		TimeLimit:   getIntPtr(raw["time_limit"]),
		TotalPoints: getInt(raw["total_points"]),
		DueDate:     dueDatePtr,
		Questions:   parseQuestions(raw["questions"]),
	}
	log.Printf("Request decoded successfully: %+v", req)
	// Helper functions for flexible JSON parsing

	// Validate required fields
	if req.Title == "" || req.CourseID == 0 {
		log.Printf("Validation error: title or course_id missing. Payload: %+v", req)
		http.Error(w, "Title and course_id are required", http.StatusBadRequest)
		return
	}

	// Verify teacher owns the course
	var courseTeacherID int
	err := DB.QueryRow("SELECT teacher_id FROM courses WHERE id = ?", req.CourseID).Scan(&courseTeacherID)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Course not found", http.StatusNotFound)
			return
		}
		log.Printf("Error checking course ownership: %v", err)
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}

	if courseTeacherID != teacherID {
		http.Error(w, "You don't have permission to create quizzes for this course", http.StatusForbidden)
		return
	}

	// Begin transaction
	tx, err := DB.Begin()
	if err != nil {
		log.Printf("Error starting transaction: %v", err)
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}
	defer tx.Rollback()

	// Insert quiz
	quizQuery := `
		INSERT INTO quizzes_new (title, description, course_id, quiz_type, pdf_file_path, time_limit, total_points, due_date)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	`

	// Handle nil values for optional fields
	var pdfFilePath interface{} = req.PDFFilePath
	if pdfFilePath == "" {
		pdfFilePath = nil
	}
	var timeLimit interface{} = req.TimeLimit
	if timeLimit == nil {
		timeLimit = nil
	}
	var dueDate interface{} = req.DueDate
	if dueDate == nil {
		dueDate = nil
	}
	result, err := tx.Exec(quizQuery, req.Title, req.Description, req.CourseID, req.QuizType, pdfFilePath, timeLimit, req.TotalPoints, dueDate)
	if err != nil {
		log.Printf("Error creating quiz: %v", err)
		http.Error(w, "Error creating quiz", http.StatusInternalServerError)
		return
	}

	quizID, err := result.LastInsertId()
	if err != nil {
		log.Printf("Error getting quiz ID: %v", err)
		http.Error(w, "Error creating quiz", http.StatusInternalServerError)
		return
	}

	// Insert questions if provided
	if req.Questions != nil && len(req.Questions) > 0 {
		for _, q := range req.Questions {
			questionQuery := `
			       INSERT INTO quiz_questions_new (quiz_id, question_type, points, question, option_a, option_b, option_c, option_d, correct_answer, essay_answer_key)
			       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		       `
			var optionA, optionB, optionC, optionD, correctAnswer, essayAnswerKey interface{}
			optionA = q.OptionA
			if optionA == "" {
				optionA = nil
			}
			optionB = q.OptionB
			if optionB == "" {
				optionB = nil
			}
			optionC = q.OptionC
			if optionC == "" {
				optionC = nil
			}
			optionD = q.OptionD
			if optionD == "" {
				optionD = nil
			}
			correctAnswer = q.CorrectAnswer
			if correctAnswer == "" {
				correctAnswer = nil
			}
			essayAnswerKey = q.EssayAnswerKey
			if essayAnswerKey == "" {
				essayAnswerKey = nil
			}
			_, err := tx.Exec(questionQuery, quizID, q.QuestionType, q.Points, q.QuestionText, optionA, optionB, optionC, optionD, correctAnswer, essayAnswerKey)
			if err != nil {
				log.Printf("Error creating question: %v, payload: %+v", err, q)
				http.Error(w, "Error creating questions", http.StatusInternalServerError)
				return
			}
		}
	}

	// Commit transaction
	if err := tx.Commit(); err != nil {
		log.Printf("Error committing transaction: %v", err)
		http.Error(w, "Error creating quiz", http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"success": true,
		"quiz_id": quizID,
		"message": "Quiz created successfully",
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

// getQuizzesByCourseHandler retrieves all quizzes for a course
func getQuizzesByCourseHandler(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
	w.Header().Set("Content-Type", "application/json")

	vars := mux.Vars(r)
	courseID, err := strconv.Atoi(vars["courseId"])
	if err != nil {
		http.Error(w, "Invalid course ID", http.StatusBadRequest)
		return
	}

	log.Printf("Fetching quizzes for course ID: %d", courseID)

	// Ambil quiz dari database
	quizRows, err := DB.Query(`
	       SELECT id, title, description, course_id, quiz_type, pdf_file_path, time_limit, total_points, is_active, due_date, created_at, updated_at
	       FROM quizzes_new WHERE course_id = ? ORDER BY id ASC`, courseID)
	if err != nil {
		log.Printf("Error fetching quizzes: %v", err)
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}
	defer quizRows.Close()

	quizzes := []Quiz{}
	for quizRows.Next() {
		var quiz Quiz
		var dueDate sql.NullTime
		var timeLimit sql.NullInt32
		var pdfFilePath sql.NullString
		err := quizRows.Scan(&quiz.ID, &quiz.Title, &quiz.Description, &quiz.CourseID, &quiz.QuizType,
			&pdfFilePath, &timeLimit, &quiz.TotalPoints, &quiz.IsActive, &dueDate,
			&quiz.CreatedAt, &quiz.UpdatedAt)
		if err != nil {
			log.Printf("Error scanning quiz: %v", err)
			continue
		}
		if dueDate.Valid {
			quiz.DueDate = &dueDate.Time
		}
		if timeLimit.Valid {
			timeLimitInt := int(timeLimit.Int32)
			quiz.TimeLimit = &timeLimitInt
		}
		if pdfFilePath.Valid {
			quiz.PDFFilePath = pdfFilePath.String
		}
		// Ambil questions untuk quiz ini
		questionsQuery := `SELECT id, quiz_id, question_type, points, question, option_a, option_b, option_c, option_d, correct_answer, essay_answer_key, created_at FROM quiz_questions_new WHERE quiz_id = ? ORDER BY id ASC`
		rows, err := DB.Query(questionsQuery, quiz.ID)
		if err != nil {
			log.Printf("Error fetching questions for quiz %d: %v", quiz.ID, err)
			quiz.Questions = []Question{}
		} else {
			var questions []Question
			for rows.Next() {
				var q Question
				var optionA, optionB, optionC, optionD, correctAnswer, essayAnswerKey sql.NullString
				err := rows.Scan(&q.ID, &q.QuizID, &q.QuestionType, &q.Points, &q.QuestionText,
					&optionA, &optionB, &optionC, &optionD, &correctAnswer, &essayAnswerKey, &q.CreatedAt)
				if err != nil {
					log.Printf("Error scanning question: %v", err)
					continue
				}
				if optionA.Valid {
					q.OptionA = optionA.String
				}
				if optionB.Valid {
					q.OptionB = optionB.String
				}
				if optionC.Valid {
					q.OptionC = optionC.String
				}
				if optionD.Valid {
					q.OptionD = optionD.String
				}
				if correctAnswer.Valid {
					q.CorrectAnswer = correctAnswer.String
				}
				if essayAnswerKey.Valid {
					q.EssayAnswerKey = essayAnswerKey.String
				}
				questions = append(questions, q)
			}
			quiz.Questions = questions
			rows.Close()
		}
		quizzes = append(quizzes, quiz)
	}

	log.Printf("Fetched %d quizzes for course %d", len(quizzes), courseID)
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(quizzes)
}

// getQuizByIDHandler retrieves a specific quiz with questions
func getQuizByIDHandler(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
	w.Header().Set("Content-Type", "application/json")

	vars := mux.Vars(r)
	quizID, err := strconv.Atoi(vars["quizId"])
	if err != nil {
		http.Error(w, "Invalid quiz ID", http.StatusBadRequest)
		return
	}

	// Get quiz details
	quizQuery := `
		SELECT id, title, description, course_id, quiz_type, pdf_file_path, time_limit, total_points, is_active, due_date, created_at, updated_at
		FROM quizzes_new
		WHERE id = ?
	`

	var quiz Quiz
	var dueDate sql.NullTime
	var timeLimit sql.NullInt32
	var pdfFilePath sql.NullString

	err = DB.QueryRow(quizQuery, quizID).Scan(&quiz.ID, &quiz.Title, &quiz.Description, &quiz.CourseID, &quiz.QuizType,
		&pdfFilePath, &timeLimit, &quiz.TotalPoints, &quiz.IsActive, &dueDate,
		&quiz.CreatedAt, &quiz.UpdatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Quiz not found", http.StatusNotFound)
			return
		}
		log.Printf("Error fetching quiz: %v", err)
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}

	if dueDate.Valid {
		quiz.DueDate = &dueDate.Time
	}
	if timeLimit.Valid {
		timeLimitInt := int(timeLimit.Int32)
		quiz.TimeLimit = &timeLimitInt
	}
	if pdfFilePath.Valid {
		quiz.PDFFilePath = pdfFilePath.String
	}

	// Get questions for the quiz
	questionsQuery := `
		SELECT id, quiz_id, question_type, points, question, option_a, option_b, option_c, option_d, correct_answer, essay_answer_key, created_at
		FROM quiz_questions_new
		WHERE quiz_id = ?
		ORDER BY id ASC
	`

	rows, err := DB.Query(questionsQuery, quizID)
	if err != nil {
		log.Printf("Error fetching questions: %v", err)
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var questions []Question
	for rows.Next() {
		var q Question
		var optionA, optionB, optionC, optionD, correctAnswer, essayAnswerKey sql.NullString

		err := rows.Scan(&q.ID, &q.QuizID, &q.QuestionType, &q.Points, &q.QuestionText,
			&optionA, &optionB, &optionC, &optionD, &correctAnswer, &essayAnswerKey, &q.CreatedAt)
		if err != nil {
			log.Printf("Error scanning question: %v", err)
			continue
		}

		if optionA.Valid {
			q.OptionA = optionA.String
		}
		if optionB.Valid {
			q.OptionB = optionB.String
		}
		if optionC.Valid {
			q.OptionC = optionC.String
		}
		if optionD.Valid {
			q.OptionD = optionD.String
		}
		if correctAnswer.Valid {
			q.CorrectAnswer = correctAnswer.String
		}
		if essayAnswerKey.Valid {
			q.EssayAnswerKey = essayAnswerKey.String
		}

		questions = append(questions, q)
	}

	quiz.Questions = questions

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(quiz)
}

// uploadQuizPDFHandler handles PDF file uploads for quizzes
func uploadQuizPDFHandler(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
	w.Header().Set("Content-Type", "application/json")

	// Check if user is authenticated
	teacherID, ok := r.Context().Value("user_id").(int)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Parse the multipart form
	err := r.ParseMultipartForm(15 << 20) // 15 MB max
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

	// Validate file type (PDF only)
	fileExt := strings.ToLower(filepath.Ext(handler.Filename))
	if fileExt != ".pdf" {
		http.Error(w, "Only PDF files are allowed", http.StatusBadRequest)
		return
	}

	// Create uploads directory if it doesn't exist
	uploadsDir := "./uploads/quiz-pdfs"
	if _, err := os.Stat(uploadsDir); os.IsNotExist(err) {
		err = os.MkdirAll(uploadsDir, 0755)
		if err != nil {
			log.Printf("Error creating uploads directory: %v", err)
			http.Error(w, "Server error", http.StatusInternalServerError)
			return
		}
	}

	// Generate a unique filename
	cleanFilename := strings.ReplaceAll(handler.Filename, " ", "_")
	filename := fmt.Sprintf("%d_%d_%s", teacherID, time.Now().UnixNano(), cleanFilename)

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

	// Create the URL path for the file
	urlPath := "/uploads/quiz-pdfs/" + filename
	log.Printf("PDF uploaded successfully. Path: %s", urlPath)

	response := map[string]interface{}{
		"success":   true,
		"file_path": urlPath,
		"message":   "PDF uploaded successfully",
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

// updateQuizHandler handles updating an existing quiz
func updateQuizHandler(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
	w.Header().Set("Content-Type", "application/json")

	vars := mux.Vars(r)
	quizID := vars["quizId"]

	var req struct {
		Title       string `json:"title"`
		Description string `json:"description"`
		QuizType    string `json:"quiz_type"`
		TimeLimit   *int   `json:"time_limit"`
		DueDate     string `json:"due_date"`
		IsActive    bool   `json:"is_active"`
		Questions   []struct {
			ID            *int   `json:"id"`
			QuestionType  string `json:"question_type"`
			Question      string `json:"question"`
			Points        int    `json:"points"`
			OptionA       string `json:"option_a"`
			OptionB       string `json:"option_b"`
			OptionC       string `json:"option_c"`
			OptionD       string `json:"option_d"`
			CorrectAnswer string `json:"correct_answer"`
		} `json:"questions"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("Error decoding request: %v", err)
		http.Error(w, "Invalid request format", http.StatusBadRequest)
		return
	}

	// Start transaction
	tx, err := DB.Begin()
	if err != nil {
		log.Printf("Error starting transaction: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer tx.Rollback()

	// Update quiz
	var dueDate interface{}
	if req.DueDate != "" {
		dueDate = req.DueDate
	}

	_, err = tx.Exec(`
		UPDATE quizzes 
		SET title = ?, description = ?, quiz_type = ?, time_limit = ?, due_date = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
		WHERE id = ?`,
		req.Title, req.Description, req.QuizType, req.TimeLimit, dueDate, req.IsActive, quizID)
	if err != nil {
		log.Printf("Error updating quiz: %v", err)
		http.Error(w, "Failed to update quiz", http.StatusInternalServerError)
		return
	}

	// Update questions for interactive quizzes
	if req.QuizType == "interactive" {
		// Delete existing questions
		_, err = tx.Exec("DELETE FROM quiz_questions WHERE quiz_id = ?", quizID)
		if err != nil {
			log.Printf("Error deleting existing questions: %v", err)
			http.Error(w, "Failed to update questions", http.StatusInternalServerError)
			return
		}

		// Insert updated questions
		for _, q := range req.Questions {
			_, err = tx.Exec(`
				INSERT INTO quiz_questions (quiz_id, question_type, question, points, option_a, option_b, option_c, option_d, correct_answer)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				quizID, q.QuestionType, q.Question, q.Points, q.OptionA, q.OptionB, q.OptionC, q.OptionD, q.CorrectAnswer)
			if err != nil {
				log.Printf("Error inserting question: %v", err)
				http.Error(w, "Failed to update questions", http.StatusInternalServerError)
				return
			}
		}
	}

	// Commit transaction
	if err = tx.Commit(); err != nil {
		log.Printf("Error committing transaction: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"success": true,
		"message": "Quiz updated successfully",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// deleteQuizHandler handles deleting a quiz
func deleteQuizHandler(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
	w.Header().Set("Content-Type", "application/json")

	vars := mux.Vars(r)
	quizID := vars["quizId"]

	// Start transaction
	tx, err := DB.Begin()
	if err != nil {
		log.Printf("Error starting transaction: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer tx.Rollback()

	// Check if quiz has submissions
	var submissionCount int
	err = tx.QueryRow("SELECT COUNT(*) FROM quiz_submissions WHERE quiz_id = ?", quizID).Scan(&submissionCount)
	if err != nil {
		log.Printf("Error checking submissions: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	if submissionCount > 0 {
		http.Error(w, "Cannot delete quiz with existing submissions", http.StatusBadRequest)
		return
	}

	// Delete quiz questions first
	_, err = tx.Exec("DELETE FROM quiz_questions WHERE quiz_id = ?", quizID)
	if err != nil {
		log.Printf("Error deleting quiz questions: %v", err)
		http.Error(w, "Failed to delete quiz", http.StatusInternalServerError)
		return
	}

	// Delete quiz
	_, err = tx.Exec("DELETE FROM quizzes WHERE id = ?", quizID)
	if err != nil {
		log.Printf("Error deleting quiz: %v", err)
		http.Error(w, "Failed to delete quiz", http.StatusInternalServerError)
		return
	}

	// Commit transaction
	if err = tx.Commit(); err != nil {
		log.Printf("Error committing transaction: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"success": true,
		"message": "Quiz deleted successfully",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// checkQuizSubmissionHandler checks if student has already submitted a quiz
func checkQuizSubmissionHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	quizID := vars["quizId"]

	userID, ok := r.Context().Value("user_id").(int)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var count int
	err := DB.QueryRow("SELECT COUNT(*) FROM quiz_submissions WHERE quiz_id = ? AND student_id = ?", quizID, userID).Scan(&count)
	if err != nil {
		log.Printf("Error checking quiz submission: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"has_submitted": count > 0,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// submitQuizHandler handles quiz submissions from students with auto-grading
func submitQuizHandler(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
	w.Header().Set("Content-Type", "application/json")

	// Get student ID from context
	studentID, ok := r.Context().Value("user_id").(int)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var req struct {
		QuizID  int                    `json:"quiz_id"`
		Answers map[string]interface{} `json:"answers"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("Error decoding request: %v", err)
		http.Error(w, "Invalid request format", http.StatusBadRequest)
		return
	}

	// Check if student already submitted this quiz
	var existingSubmissionID int
	err := DB.QueryRow("SELECT id FROM quiz_submissions WHERE quiz_id = ? AND student_id = ?", req.QuizID, studentID).Scan(&existingSubmissionID)
	if err == nil {
		http.Error(w, "You have already submitted this quiz", http.StatusBadRequest)
		return
	}

	// Convert answers to JSON string
	answersJSON, err := json.Marshal(req.Answers)
	if err != nil {
		log.Printf("Error marshaling answers: %v", err)
		http.Error(w, "Error processing answers", http.StatusInternalServerError)
		return
	}

	// Get quiz details and questions
	var totalPoints int
	err = DB.QueryRow("SELECT total_points FROM quizzes WHERE id = ?", req.QuizID).Scan(&totalPoints)
	if err != nil {
		log.Printf("Error fetching quiz details: %v", err)
		http.Error(w, "Quiz not found", http.StatusNotFound)
		return
	}

	// Get all questions for this quiz
	questionsQuery := `
		SELECT id, question_type, points, correct_answer 
		FROM quiz_questions 
		WHERE quiz_id = ?
	`
	rows, err := DB.Query(questionsQuery, req.QuizID)
	if err != nil {
		log.Printf("Error fetching questions: %v", err)
		http.Error(w, "Error processing quiz", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	// Calculate score for multiple choice questions
	var autoGradedScore float64
	var hasEssayQuestions bool
	var mcQuestions []Question

	for rows.Next() {
		var q Question
		var correctAnswer sql.NullString
		err := rows.Scan(&q.ID, &q.QuestionType, &q.Points, &correctAnswer)
		if err != nil {
			log.Printf("Error scanning question: %v", err)
			continue
		}

		if correctAnswer.Valid {
			q.CorrectAnswer = correctAnswer.String
		}

		if q.QuestionType == "multiple_choice" {
			mcQuestions = append(mcQuestions, q)
		} else if q.QuestionType == "essay" {
			hasEssayQuestions = true
		}
	}

	// Auto-grade multiple choice questions
	for _, q := range mcQuestions {
		questionIDStr := strconv.Itoa(q.ID)
		if studentAnswer, exists := req.Answers[questionIDStr]; exists {
			if studentAnswerStr, ok := studentAnswer.(string); ok {
				if strings.ToUpper(studentAnswerStr) == strings.ToUpper(q.CorrectAnswer) {
					autoGradedScore += float64(q.Points)
				}
			}
		}
	}

	// Begin transaction
	tx, err := DB.Begin()
	if err != nil {
		log.Printf("Error starting transaction: %v", err)
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}
	defer tx.Rollback()

	// Insert submission
	var finalScore *float64
	var gradedAt *time.Time

	if !hasEssayQuestions {
		// If only multiple choice, set final score immediately
		finalScore = &autoGradedScore
		now := time.Now()
		gradedAt = &now
	}

	submissionQuery := `
		INSERT INTO quiz_submissions (quiz_id, student_id, submission_type, answers, score, total_points, graded_at)
		VALUES (?, ?, 'interactive', ?, ?, ?, ?)
	`

	result, err := tx.Exec(submissionQuery, req.QuizID, studentID, string(answersJSON), finalScore, totalPoints, gradedAt)
	if err != nil {
		log.Printf("Error inserting submission: %v", err)
		http.Error(w, "Error submitting quiz", http.StatusInternalServerError)
		return
	}

	submissionID, err := result.LastInsertId()
	if err != nil {
		log.Printf("Error getting submission ID: %v", err)
		http.Error(w, "Error submitting quiz", http.StatusInternalServerError)
		return
	}

	// Insert individual answers into quiz_answers table
	for questionIDStr, answer := range req.Answers {
		questionID, err := strconv.Atoi(questionIDStr)
		if err != nil {
			continue
		}

		answerStr := ""
		if answer != nil {
			answerStr = fmt.Sprintf("%v", answer)
		}

		// Find question details
		var questionType string
		var points int
		var correctAnswer sql.NullString
		err = DB.QueryRow("SELECT question_type, points, correct_answer FROM quiz_questions WHERE id = ?", questionID).Scan(&questionType, &points, &correctAnswer)
		if err != nil {
			log.Printf("Error fetching question details: %v", err)
			continue
		}

		var isCorrect *bool
		var pointsAwarded *float64

		if questionType == "multiple_choice" && correctAnswer.Valid {
			correct := strings.ToUpper(answerStr) == strings.ToUpper(correctAnswer.String)
			isCorrect = &correct
			if correct {
				awarded := float64(points)
				pointsAwarded = &awarded
			} else {
				awarded := 0.0
				pointsAwarded = &awarded
			}
		}

		answerQuery := `
			INSERT INTO quiz_answers (submission_id, question_id, answer, is_correct, points_awarded)
			VALUES (?, ?, ?, ?, ?)
		`
		_, err = tx.Exec(answerQuery, submissionID, questionID, answerStr, isCorrect, pointsAwarded)
		if err != nil {
			log.Printf("Error inserting answer: %v", err)
		}
	}

	// Commit transaction
	if err := tx.Commit(); err != nil {
		log.Printf("Error committing transaction: %v", err)
		http.Error(w, "Error submitting quiz", http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"success": true,
		"message": "Quiz submitted successfully",
	}

	if finalScore != nil {
		response["score"] = *finalScore
		response["total_points"] = totalPoints
		response["auto_graded"] = true
	} else {
		response["message"] = "Quiz submitted successfully. Waiting for teacher to grade essay questions."
		response["auto_graded"] = false
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

// submitQuizPDFHandler handles PDF quiz submissions from students
func submitQuizPDFHandler(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
	w.Header().Set("Content-Type", "application/json")

	// Get student ID from context
	studentID, ok := r.Context().Value("user_id").(int)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Parse the multipart form
	err := r.ParseMultipartForm(15 << 20) // 15 MB max
	if err != nil {
		log.Printf("Error parsing multipart form: %v", err)
		http.Error(w, "Error parsing form", http.StatusBadRequest)
		return
	}

	// Get quiz ID from form
	quizIDStr := r.FormValue("quiz_id")
	if quizIDStr == "" {
		http.Error(w, "Quiz ID is required", http.StatusBadRequest)
		return
	}

	quizID, err := strconv.Atoi(quizIDStr)
	if err != nil {
		http.Error(w, "Invalid quiz ID", http.StatusBadRequest)
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
	uploadsDir := "./uploads/quiz-answers"
	if _, err := os.Stat(uploadsDir); os.IsNotExist(err) {
		err = os.MkdirAll(uploadsDir, 0755)
		if err != nil {
			log.Printf("Error creating uploads directory: %v", err)
			http.Error(w, "Server error", http.StatusInternalServerError)
			return
		}
	}

	// Generate a unique filename
	cleanFilename := strings.ReplaceAll(handler.Filename, " ", "_")
	filename := fmt.Sprintf("%d_%d_%d_%s", studentID, quizID, time.Now().UnixNano(), cleanFilename)

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

	// Get quiz details for points
	var totalPoints int
	err = DB.QueryRow("SELECT total_points FROM quizzes_new WHERE id = ?", quizID).Scan(&totalPoints)
	if err != nil {
		log.Printf("Error fetching quiz details: %v", err)
		http.Error(w, "Quiz not found", http.StatusNotFound)
		return
	}

	// Create the URL path for the file
	urlPath := "/uploads/quiz-answers/" + filename

	// Insert submission
	submissionQuery := `
		INSERT INTO quiz_submissions (quiz_id, student_id, submission_type, uploaded_file_path, total_points)
		VALUES (?, ?, 'pdf_upload', ?, ?)
		ON DUPLICATE KEY UPDATE 
		uploaded_file_path = VALUES(uploaded_file_path), 
		submitted_at = CURRENT_TIMESTAMP
	`

	_, err = DB.Exec(submissionQuery, quizID, studentID, urlPath, totalPoints)
	if err != nil {
		log.Printf("Error inserting submission: %v", err)
		http.Error(w, "Error submitting quiz", http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"success":   true,
		"file_path": urlPath,
		"message":   "Quiz answer submitted successfully",
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

// debugQuizzesHandler untuk debug - melihat semua quiz di database
func debugQuizzesHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	// Query semua quiz tanpa filter
	rows, err := DB.Query("SELECT id, title, description, course_id, quiz_type, total_points, is_active, created_at FROM quizzes_new ORDER BY id ASC")
	if err != nil {
		log.Printf("Error fetching all quizzes: %v", err)
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var quizzes []map[string]interface{}
	for rows.Next() {
		var id, courseID, totalPoints int
		var title, description, quizType string
		var isActive bool
		var createdAt time.Time

		err := rows.Scan(&id, &title, &description, &courseID, &quizType, &totalPoints, &isActive, &createdAt)
		if err != nil {
			log.Printf("Error scanning quiz: %v", err)
			continue
		}

		quiz := map[string]interface{}{
			"id":           id,
			"title":        title,
			"description":  description,
			"course_id":    courseID,
			"quiz_type":    quizType,
			"total_points": totalPoints,
			"is_active":    isActive,
			"created_at":   createdAt,
		}
		quizzes = append(quizzes, quiz)
	}

	log.Printf("Debug: Found %d total quizzes in database", len(quizzes))
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"total_quizzes": len(quizzes),
		"quizzes":       quizzes,
	})
}

// QuizSubmissionDetail represents detailed submission info for teachers
type QuizSubmissionDetail struct {
	ID               int                    `json:"id"`
	QuizID           int                    `json:"quiz_id"`
	QuizTitle        string                 `json:"quiz_title"`
	StudentID        int                    `json:"student_id"`
	StudentName      string                 `json:"student_name"`
	StudentEmail     string                 `json:"student_email"`
	SubmissionType   string                 `json:"submission_type"`
	Answers          map[string]interface{} `json:"answers,omitempty"`
	UploadedFilePath string                 `json:"uploaded_file_path,omitempty"`
	Score            *float64               `json:"score,omitempty"`
	TotalPoints      int                    `json:"total_points"`
	SubmittedAt      time.Time              `json:"submitted_at"`
	GradedAt         *time.Time             `json:"graded_at,omitempty"`
	GradedBy         *int                   `json:"graded_by,omitempty"`
	Feedback         string                 `json:"feedback,omitempty"`
	QuestionDetails  []QuestionAnswer       `json:"question_details,omitempty"`
}

type QuestionAnswer struct {
	QuestionID    int      `json:"question_id"`
	QuestionText  string   `json:"question_text"`
	QuestionType  string   `json:"question_type"`
	Points        int      `json:"points"`
	StudentAnswer string   `json:"student_answer"`
	CorrectAnswer string   `json:"correct_answer,omitempty"`
	IsCorrect     *bool    `json:"is_correct,omitempty"`
	PointsAwarded *float64 `json:"points_awarded,omitempty"`
}

// getQuizSubmissionsHandler - untuk guru melihat semua submission quiz
func getQuizSubmissionsHandler(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
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

	vars := mux.Vars(r)
	quizID, err := strconv.Atoi(vars["quizId"])
	if err != nil {
		http.Error(w, "Invalid quiz ID", http.StatusBadRequest)
		return
	}

	// Verify teacher owns the quiz
	var courseID int
	err = DB.QueryRow(`
		SELECT c.id FROM courses c 
		JOIN quizzes q ON c.id = q.course_id 
		WHERE q.id = ? AND c.teacher_id = ?
	`, quizID, teacherID).Scan(&courseID)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Quiz not found or you don't have permission", http.StatusNotFound)
			return
		}
		log.Printf("Error checking quiz ownership: %v", err)
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}

	// Get all submissions for this quiz
	submissionsQuery := `
		SELECT 
			qs.id, qs.quiz_id, q.title as quiz_title, qs.student_id, 
			s.name as student_name, s.email as student_email,
			qs.submission_type, qs.answers, qs.uploaded_file_path,
			qs.score, qs.total_points, qs.submitted_at, qs.graded_at,
			qs.graded_by, qs.feedback
		FROM quiz_submissions qs
		JOIN quizzes q ON qs.quiz_id = q.id
		JOIN students s ON qs.student_id = s.id
		WHERE qs.quiz_id = ?
		ORDER BY qs.submitted_at DESC
	`

	rows, err := DB.Query(submissionsQuery, quizID)
	if err != nil {
		log.Printf("Error fetching submissions: %v", err)
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var submissions []QuizSubmissionDetail
	for rows.Next() {
		var submission QuizSubmissionDetail
		var answersJSON sql.NullString
		var uploadedFilePath sql.NullString
		var score sql.NullFloat64
		var gradedAt sql.NullTime
		var gradedBy sql.NullInt32
		var feedback sql.NullString

		err := rows.Scan(
			&submission.ID, &submission.QuizID, &submission.QuizTitle,
			&submission.StudentID, &submission.StudentName, &submission.StudentEmail,
			&submission.SubmissionType, &answersJSON, &uploadedFilePath,
			&score, &submission.TotalPoints, &submission.SubmittedAt,
			&gradedAt, &gradedBy, &feedback,
		)
		if err != nil {
			log.Printf("Error scanning submission: %v", err)
			continue
		}

		// Parse answers JSON
		if answersJSON.Valid && answersJSON.String != "" {
			var answers map[string]interface{}
			if err := json.Unmarshal([]byte(answersJSON.String), &answers); err == nil {
				submission.Answers = answers
			}
		}

		if uploadedFilePath.Valid {
			submission.UploadedFilePath = uploadedFilePath.String
		}
		if score.Valid {
			submission.Score = &score.Float64
		}
		if gradedAt.Valid {
			submission.GradedAt = &gradedAt.Time
		}
		if gradedBy.Valid {
			gradedByInt := int(gradedBy.Int32)
			submission.GradedBy = &gradedByInt
		}
		if feedback.Valid {
			submission.Feedback = feedback.String
		}

		// Get question details with answers
		questionDetailsQuery := `
			SELECT 
				qa.question_id, qq.question as question_text, qq.question_type,
				qq.points, qa.answer as student_answer, qq.correct_answer,
				qa.is_correct, qa.points_awarded
			FROM quiz_answers qa
			JOIN quiz_questions qq ON qa.question_id = qq.id
			WHERE qa.submission_id = ?
			ORDER BY qa.question_id
		`

		questionRows, err := DB.Query(questionDetailsQuery, submission.ID)
		if err != nil {
			log.Printf("Error fetching question details: %v", err)
		} else {
			var questionDetails []QuestionAnswer
			for questionRows.Next() {
				var qa QuestionAnswer
				var correctAnswer sql.NullString
				var isCorrect sql.NullBool
				var pointsAwarded sql.NullFloat64

				err := questionRows.Scan(
					&qa.QuestionID, &qa.QuestionText, &qa.QuestionType,
					&qa.Points, &qa.StudentAnswer, &correctAnswer,
					&isCorrect, &pointsAwarded,
				)
				if err != nil {
					log.Printf("Error scanning question answer: %v", err)
					continue
				}

				if correctAnswer.Valid {
					qa.CorrectAnswer = correctAnswer.String
				}
				if isCorrect.Valid {
					qa.IsCorrect = &isCorrect.Bool
				}
				if pointsAwarded.Valid {
					qa.PointsAwarded = &pointsAwarded.Float64
				}

				questionDetails = append(questionDetails, qa)
			}
			submission.QuestionDetails = questionDetails
			questionRows.Close()
		}

		submissions = append(submissions, submission)
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":     true,
		"submissions": submissions,
	})
}

// gradeEssayHandler - untuk guru menilai soal essay
func gradeEssayHandler(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
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

	var req struct {
		SubmissionID int `json:"submission_id"`
		Grades       []struct {
			QuestionID    int     `json:"question_id"`
			PointsAwarded float64 `json:"points_awarded"`
		} `json:"grades"`
		Feedback string `json:"feedback"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("Error decoding request: %v", err)
		http.Error(w, "Invalid request format", http.StatusBadRequest)
		return
	}

	log.Printf("Grading request: SubmissionID=%d, Grades=%+v, Feedback=%s", req.SubmissionID, req.Grades, req.Feedback)

	// Verify teacher has permission to grade this submission
	var quizID int
	err := DB.QueryRow(`
		SELECT q.id FROM quizzes q
		JOIN quiz_submissions qs ON q.id = qs.quiz_id
		JOIN courses c ON q.course_id = c.id
		WHERE qs.id = ? AND c.teacher_id = ?
	`, req.SubmissionID, teacherID).Scan(&quizID)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Submission not found or you don't have permission", http.StatusNotFound)
			return
		}
		log.Printf("Error checking grading permission: %v", err)
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}

	// Begin transaction
	tx, err := DB.Begin()
	if err != nil {
		log.Printf("Error starting transaction: %v", err)
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}
	defer tx.Rollback()

	// Update individual question grades
	for _, grade := range req.Grades {
		updateGradeQuery := `
			UPDATE quiz_answers 
			SET points_awarded = ?, is_correct = CASE WHEN ? > 0 THEN TRUE ELSE FALSE END
			WHERE submission_id = ? AND question_id = ?
		`
		_, err := tx.Exec(updateGradeQuery, grade.PointsAwarded, grade.PointsAwarded, req.SubmissionID, grade.QuestionID)
		if err != nil {
			log.Printf("Error updating grade: %v", err)
			http.Error(w, "Error updating grades", http.StatusInternalServerError)
			return
		}
	}

	// Calculate total score
	var totalScore float64
	err = tx.QueryRow(`
		SELECT COALESCE(SUM(points_awarded), 0) 
		FROM quiz_answers 
		WHERE submission_id = ?
	`, req.SubmissionID).Scan(&totalScore)
	if err != nil {
		log.Printf("Error calculating total score: %v", err)
		http.Error(w, "Error calculating score", http.StatusInternalServerError)
		return
	}

	// Update submission with final score
	updateSubmissionQuery := `
		UPDATE quiz_submissions 
		SET score = ?, graded_at = CURRENT_TIMESTAMP, graded_by = ?, feedback = ?
		WHERE id = ?
	`
	_, err = tx.Exec(updateSubmissionQuery, totalScore, teacherID, req.Feedback, req.SubmissionID)
	if err != nil {
		log.Printf("Error updating submission: %v", err)
		http.Error(w, "Error updating submission", http.StatusInternalServerError)
		return
	}

	// Commit transaction
	if err := tx.Commit(); err != nil {
		log.Printf("Error committing transaction: %v", err)
		http.Error(w, "Error saving grades", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":     true,
		"message":     "Grades saved successfully",
		"total_score": totalScore,
	})
}

// getStudentQuizResultsHandler - untuk siswa melihat nilai quiz mereka
func getStudentQuizResultsHandler(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
	w.Header().Set("Content-Type", "application/json")

	// Get student ID from context
	studentID, ok := r.Context().Value("user_id").(int)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Get quiz results for this student
	resultsQuery := `
		SELECT 
			qs.id, qs.quiz_id, q.title as quiz_title, c.name as course_name,
			qs.score, qs.total_points, qs.submitted_at, qs.graded_at,
			qs.feedback
		FROM quiz_submissions qs
		JOIN quizzes_new q ON qs.quiz_id = q.id
		JOIN courses c ON q.course_id = c.id
		WHERE qs.student_id = ?
		ORDER BY qs.submitted_at DESC
	`

	rows, err := DB.Query(resultsQuery, studentID)
	if err != nil {
		log.Printf("Error fetching student results: %v", err)
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var submissionID, quizID, totalPoints int
		var quizTitle, courseName string
		var score sql.NullFloat64
		var submittedAt time.Time
		var gradedAt sql.NullTime
		var feedback sql.NullString

		err := rows.Scan(
			&submissionID, &quizID, &quizTitle, &courseName,
			&score, &totalPoints, &submittedAt, &gradedAt, &feedback,
		)
		if err != nil {
			log.Printf("Error scanning result: %v", err)
			continue
		}

		result := map[string]interface{}{
			"submission_id": submissionID,
			"quiz_id":       quizID,
			"quiz_title":    quizTitle,
			"course_name":   courseName,
			"total_points":  totalPoints,
			"submitted_at":  submittedAt,
		}

		if score.Valid {
			result["score"] = score.Float64
			result["percentage"] = (score.Float64 / float64(totalPoints)) * 100
			result["is_graded"] = true
		} else {
			result["score"] = nil
			result["percentage"] = nil
			result["is_graded"] = false
		}

		if gradedAt.Valid {
			result["graded_at"] = gradedAt.Time
		}

		if feedback.Valid {
			result["feedback"] = feedback.String
		}

		results = append(results, result)
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"results": results,
	})
}

// getStudentQuizDetailHandler - untuk siswa melihat detail jawaban quiz mereka
func getStudentQuizDetailHandler(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
	w.Header().Set("Content-Type", "application/json")

	// Get student ID from context
	studentID, ok := r.Context().Value("user_id").(int)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	vars := mux.Vars(r)
	submissionID, err := strconv.Atoi(vars["submissionId"])
	if err != nil {
		http.Error(w, "Invalid submission ID", http.StatusBadRequest)
		return
	}

	// Verify this submission belongs to the student
	var quizID int
	err = DB.QueryRow("SELECT quiz_id FROM quiz_submissions WHERE id = ? AND student_id = ?", submissionID, studentID).Scan(&quizID)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Submission not found", http.StatusNotFound)
			return
		}
		log.Printf("Error checking submission ownership: %v", err)
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}

	// Get submission details with question answers
	detailQuery := `
		SELECT 
			qs.id, qs.quiz_id, q.title as quiz_title,
			qs.score, qs.total_points, qs.submitted_at, qs.graded_at,
			qs.feedback
		FROM quiz_submissions qs
		JOIN quizzes_new q ON qs.quiz_id = q.id
		WHERE qs.id = ?
	`

	var submission map[string]interface{}
	var score sql.NullFloat64
	var gradedAt sql.NullTime
	var feedback sql.NullString
	var submissionIDResult, quizIDResult, totalPoints int
	var quizTitle string
	var submittedAt time.Time

	err = DB.QueryRow(detailQuery, submissionID).Scan(
		&submissionIDResult, &quizIDResult, &quizTitle,
		&score, &totalPoints, &submittedAt, &gradedAt, &feedback,
	)
	if err != nil {
		log.Printf("Error fetching submission detail: %v", err)
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}

	submission = map[string]interface{}{
		"submission_id": submissionIDResult,
		"quiz_id":       quizIDResult,
		"quiz_title":    quizTitle,
		"total_points":  totalPoints,
		"submitted_at":  submittedAt,
	}

	if score.Valid {
		submission["score"] = score.Float64
		submission["percentage"] = (score.Float64 / float64(totalPoints)) * 100
		submission["is_graded"] = true
	} else {
		submission["score"] = nil
		submission["percentage"] = nil
		submission["is_graded"] = false
	}

	if gradedAt.Valid {
		submission["graded_at"] = gradedAt.Time
	}

	if feedback.Valid {
		submission["feedback"] = feedback.String
	}

	// Get question details with student answers
	questionDetailsQuery := `
		SELECT 
			qa.question_id, qq.question as question_text, qq.question_type,
			qq.points, qa.answer as student_answer, qq.correct_answer,
			qa.is_correct, qa.points_awarded,
			qq.option_a, qq.option_b, qq.option_c, qq.option_d
		FROM quiz_answers qa
		JOIN quiz_questions_new qq ON qa.question_id = qq.id
		WHERE qa.submission_id = ?
		ORDER BY qa.question_id
	`

	questionRows, err := DB.Query(questionDetailsQuery, submissionID)
	if err != nil {
		log.Printf("Error fetching question details: %v", err)
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}
	defer questionRows.Close()

	var questionDetails []map[string]interface{}
	for questionRows.Next() {
		var questionID, points int
		var questionText, questionType, studentAnswer string
		var correctAnswer sql.NullString
		var isCorrect sql.NullBool
		var pointsAwarded sql.NullFloat64
		var optionA, optionB, optionC, optionD sql.NullString

		err := questionRows.Scan(
			&questionID, &questionText, &questionType,
			&points, &studentAnswer, &correctAnswer,
			&isCorrect, &pointsAwarded,
			&optionA, &optionB, &optionC, &optionD,
		)
		if err != nil {
			log.Printf("Error scanning question detail: %v", err)
			continue
		}

		question := map[string]interface{}{
			"question_id":    questionID,
			"question_text":  questionText,
			"question_type":  questionType,
			"points":         points,
			"student_answer": studentAnswer,
		}

		if correctAnswer.Valid {
			question["correct_answer"] = correctAnswer.String
		}
		if isCorrect.Valid {
			question["is_correct"] = isCorrect.Bool
		}
		if pointsAwarded.Valid {
			question["points_awarded"] = pointsAwarded.Float64
		}

		// Add options for multiple choice questions
		if questionType == "multiple_choice" {
			options := map[string]interface{}{}
			if optionA.Valid {
				options["A"] = optionA.String
			}
			if optionB.Valid {
				options["B"] = optionB.String
			}
			if optionC.Valid {
				options["C"] = optionC.String
			}
			if optionD.Valid {
				options["D"] = optionD.String
			}
			question["options"] = options
		}

		questionDetails = append(questionDetails, question)
	}

	submission["question_details"] = questionDetails

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":    true,
		"submission": submission,
	})
}
