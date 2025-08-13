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

// submitQuizHandler handles quiz submissions from students
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

	// Convert answers to JSON string
	answersJSON, err := json.Marshal(req.Answers)
	if err != nil {
		log.Printf("Error marshaling answers: %v", err)
		http.Error(w, "Error processing answers", http.StatusInternalServerError)
		return
	}

	// Get quiz details for points
	var totalPoints int
	err = DB.QueryRow("SELECT total_points FROM quizzes_new WHERE id = ?", req.QuizID).Scan(&totalPoints)
	if err != nil {
		log.Printf("Error fetching quiz details: %v", err)
		http.Error(w, "Quiz not found", http.StatusNotFound)
		return
	}

	// Insert submission
	submissionQuery := `
		INSERT INTO quiz_submissions (quiz_id, student_id, submission_type, answers, total_points)
		VALUES (?, ?, 'interactive', ?, ?)
		ON DUPLICATE KEY UPDATE 
		answers = VALUES(answers), 
		submitted_at = CURRENT_TIMESTAMP
	`

	_, err = DB.Exec(submissionQuery, req.QuizID, studentID, string(answersJSON), totalPoints)
	if err != nil {
		log.Printf("Error inserting submission: %v", err)
		http.Error(w, "Error submitting quiz", http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"success": true,
		"message": "Quiz submitted successfully",
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
