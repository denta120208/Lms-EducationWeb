package main

import (
	"database/sql"
	"log"
)

// CreateQuizTables creates the quiz-related tables if they don't exist
func CreateQuizTables(db *sql.DB) error {
	// Update quizzes table structure
	quizTableQuery := `
		CREATE TABLE IF NOT EXISTS quizzes_new (
			id INT(11) NOT NULL AUTO_INCREMENT,
			title VARCHAR(255) NOT NULL,
			description TEXT,
			course_id INT(11) NOT NULL,
			quiz_type ENUM('interactive', 'pdf') DEFAULT 'interactive',
			pdf_file_path VARCHAR(255) NULL,
			time_limit INT(11) NULL COMMENT 'Time limit in minutes',
			total_points INT(11) DEFAULT 100,
			is_active BOOLEAN DEFAULT TRUE,
			due_date TIMESTAMP NULL,
			created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			PRIMARY KEY (id),
			FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
	`

	// Update quiz_questions table structure  
	questionsTableQuery := `
		CREATE TABLE IF NOT EXISTS quiz_questions_new (
			id INT(11) NOT NULL AUTO_INCREMENT,
			quiz_id INT(11) NOT NULL,
			question_type ENUM('multiple_choice', 'essay') DEFAULT 'multiple_choice',
			points INT(11) DEFAULT 10,
			question TEXT NOT NULL,
			option_a VARCHAR(255) NULL,
			option_b VARCHAR(255) NULL,
			option_c VARCHAR(255) NULL,
			option_d VARCHAR(255) NULL,
			correct_answer ENUM('A','B','C','D') NULL,
			essay_answer_key TEXT NULL,
			created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY (id),
			FOREIGN KEY (quiz_id) REFERENCES quizzes_new(id) ON DELETE CASCADE
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
	`

	// Create quiz_submissions table
	submissionsTableQuery := `
		CREATE TABLE IF NOT EXISTS quiz_submissions (
			id INT(11) NOT NULL AUTO_INCREMENT,
			quiz_id INT(11) NOT NULL,
			student_id INT(11) NOT NULL,
			submission_type ENUM('interactive', 'pdf_upload') DEFAULT 'interactive',
			answers JSON NULL COMMENT 'For interactive quizzes',
			uploaded_file_path VARCHAR(255) NULL COMMENT 'For PDF quiz submissions',
			score DECIMAL(5,2) NULL,
			total_points INT(11) NOT NULL,
			submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
			graded_at TIMESTAMP NULL,
			graded_by INT(11) NULL COMMENT 'Teacher ID who graded',
			feedback TEXT NULL,
			PRIMARY KEY (id),
			UNIQUE KEY unique_submission (quiz_id, student_id),
			FOREIGN KEY (quiz_id) REFERENCES quizzes_new(id) ON DELETE CASCADE,
			FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
			FOREIGN KEY (graded_by) REFERENCES teachers(id) ON DELETE SET NULL
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
	`

	
	answersTableQuery := `
		CREATE TABLE IF NOT EXISTS quiz_answers (
			id INT(11) NOT NULL AUTO_INCREMENT,
			submission_id INT(11) NOT NULL,
			question_id INT(11) NOT NULL,
			answer TEXT NOT NULL,
			is_correct BOOLEAN NULL COMMENT 'For auto-graded questions',
			points_awarded DECIMAL(5,2) NULL,
			created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
			PRIMARY KEY (id),
			UNIQUE KEY unique_answer (submission_id, question_id),
			FOREIGN KEY (submission_id) REFERENCES quiz_submissions(id) ON DELETE CASCADE,
			FOREIGN KEY (question_id) REFERENCES quiz_questions_new(id) ON DELETE CASCADE
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
	`

	// Execute table creation queries
	if _, err := db.Exec(quizTableQuery); err != nil {
		log.Printf("Error creating quizzes_new table: %v", err)
		return err
	}
	log.Println("✅ Quizzes table created/updated successfully!")

	if _, err := db.Exec(questionsTableQuery); err != nil {
		log.Printf("Error creating quiz_questions_new table: %v", err)
		return err
	}
	log.Println("✅ Quiz questions table created/updated successfully!")

	if _, err := db.Exec(submissionsTableQuery); err != nil {
		log.Printf("Error creating quiz_submissions table: %v", err)
		return err
	}
	log.Println("✅ Quiz submissions table created successfully!")

	if _, err := db.Exec(answersTableQuery); err != nil {
		log.Printf("Error creating quiz_answers table: %v", err)
		return err
	}
	log.Println("✅ Quiz answers table created successfully!")

	return nil
}
