package main

import (
	"database/sql"
	"log"
)

// CreateSimpleQuizTables creates a simple quiz schema using existing tables
func CreateSimpleQuizTables(db *sql.DB) error {
	// Check if quizzes table exists and has required columns
	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'lms_garage' AND TABLE_NAME = 'quizzes' AND COLUMN_NAME = 'course_id'").Scan(&count)
	if err != nil {
		log.Printf("Error checking quizzes table: %v", err)
	}
	
	if count == 0 {
		// Add course_id column to quizzes table
		_, err = db.Exec("ALTER TABLE quizzes ADD COLUMN course_id INT(11) NOT NULL DEFAULT 1 AFTER description")
		if err != nil {
			log.Printf("Warning: Could not add course_id to quizzes: %v", err)
		} else {
			log.Println("✅ Added course_id column to quizzes table")
		}

		// Add other quiz columns
		_, err = db.Exec("ALTER TABLE quizzes ADD COLUMN quiz_type ENUM('interactive', 'pdf') DEFAULT 'interactive' AFTER course_id")
		if err != nil {
			log.Printf("Warning: Could not add quiz_type: %v", err)
		}

		_, err = db.Exec("ALTER TABLE quizzes ADD COLUMN pdf_file_path VARCHAR(255) NULL AFTER quiz_type")
		if err != nil {
			log.Printf("Warning: Could not add pdf_file_path: %v", err)
		}

		_, err = db.Exec("ALTER TABLE quizzes ADD COLUMN time_limit INT(11) NULL AFTER pdf_file_path")
		if err != nil {
			log.Printf("Warning: Could not add time_limit: %v", err)
		}

		_, err = db.Exec("ALTER TABLE quizzes ADD COLUMN total_points INT(11) DEFAULT 100 AFTER time_limit")
		if err != nil {
			log.Printf("Warning: Could not add total_points: %v", err)
		}

		_, err = db.Exec("ALTER TABLE quizzes ADD COLUMN is_active BOOLEAN DEFAULT TRUE AFTER total_points")
		if err != nil {
			log.Printf("Warning: Could not add is_active: %v", err)
		}

		_, err = db.Exec("ALTER TABLE quizzes ADD COLUMN due_date TIMESTAMP NULL AFTER is_active")
		if err != nil {
			log.Printf("Warning: Could not add due_date: %v", err)
		}
	}

	// Check quiz_questions table and add columns
	err = db.QueryRow("SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'lms_garage' AND TABLE_NAME = 'quiz_questions' AND COLUMN_NAME = 'question_type'").Scan(&count)
	if err != nil {
		log.Printf("Error checking quiz_questions table: %v", err)
	}
	
	if count == 0 {
		_, err = db.Exec("ALTER TABLE quiz_questions ADD COLUMN question_type ENUM('multiple_choice', 'essay') DEFAULT 'multiple_choice' AFTER quiz_id")
		if err != nil {
			log.Printf("Warning: Could not add question_type: %v", err)
		}

		_, err = db.Exec("ALTER TABLE quiz_questions ADD COLUMN points INT(11) DEFAULT 10 AFTER question_type")
		if err != nil {
			log.Printf("Warning: Could not add points: %v", err)
		}

		_, err = db.Exec("ALTER TABLE quiz_questions ADD COLUMN essay_answer_key TEXT NULL AFTER correct_answer")
		if err != nil {
			log.Printf("Warning: Could not add essay_answer_key: %v", err)
		}
	}

	// Create quiz_submissions table
	submissionsTableQuery := `
		CREATE TABLE IF NOT EXISTS quiz_submissions (
			id INT(11) NOT NULL AUTO_INCREMENT,
			quiz_id INT(11) NOT NULL,
			student_id INT(11) NOT NULL,
			submission_type ENUM('interactive', 'pdf_upload') DEFAULT 'interactive',
			answers JSON NULL,
			uploaded_file_path VARCHAR(255) NULL,
			score DECIMAL(5,2) NULL,
			total_points INT(11) NOT NULL,
			submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
			graded_at TIMESTAMP NULL,
			graded_by INT(11) NULL,
			feedback TEXT NULL,
			PRIMARY KEY (id),
			UNIQUE KEY unique_submission (quiz_id, student_id)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
	`

	_, err = db.Exec(submissionsTableQuery)
	if err != nil {
		log.Printf("Warning: Could not create quiz_submissions table: %v", err)
	} else {
		log.Println("✅ Quiz submissions table created successfully!")
	}

	log.Println("✅ Quiz schema setup completed!")
	return nil
}
