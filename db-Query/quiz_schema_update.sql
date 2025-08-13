-- Update quiz schema to support comprehensive quiz features
-- This will extend the existing quiz tables

-- First, let's modify the quizzes table to link to courses instead of materials
-- and add more quiz configuration options
ALTER TABLE `quizzes` 
DROP FOREIGN KEY IF EXISTS `quizzes_ibfk_1`;

ALTER TABLE `quizzes` 
ADD COLUMN `course_id` INT(11) NOT NULL AFTER `description`,
ADD COLUMN `quiz_type` ENUM('interactive', 'pdf') DEFAULT 'interactive' AFTER `course_id`,
ADD COLUMN `pdf_file_path` VARCHAR(255) NULL AFTER `quiz_type`,
ADD COLUMN `time_limit` INT(11) NULL COMMENT 'Time limit in minutes' AFTER `pdf_file_path`,
ADD COLUMN `total_points` INT(11) DEFAULT 100 AFTER `time_limit`,
ADD COLUMN `is_active` BOOLEAN DEFAULT TRUE AFTER `total_points`,
ADD COLUMN `due_date` TIMESTAMP NULL AFTER `is_active`;

-- Update quiz_questions table to support essay questions and more options
ALTER TABLE `quiz_questions`
ADD COLUMN `question_type` ENUM('multiple_choice', 'essay') DEFAULT 'multiple_choice' AFTER `quiz_id`,
ADD COLUMN `points` INT(11) DEFAULT 10 AFTER `question_type`,
MODIFY COLUMN `correct_answer` ENUM('A','B','C','D') NULL,
ADD COLUMN `essay_answer_key` TEXT NULL AFTER `correct_answer`;

-- Create quiz_submissions table to track student submissions
CREATE TABLE IF NOT EXISTS `quiz_submissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `quiz_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `submission_type` ENUM('interactive', 'pdf_upload') DEFAULT 'interactive',
  `answers` JSON NULL COMMENT 'For interactive quizzes',
  `uploaded_file_path` VARCHAR(255) NULL COMMENT 'For PDF quiz submissions',
  `score` DECIMAL(5,2) NULL,
  `total_points` INT(11) NOT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `graded_at` timestamp NULL,
  `graded_by` int(11) NULL COMMENT 'Teacher ID who graded',
  `feedback` TEXT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_submission` (`quiz_id`, `student_id`),
  KEY `quiz_id` (`quiz_id`),
  KEY `student_id` (`student_id`),
  KEY `graded_by` (`graded_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create quiz_answers table for storing individual question answers
CREATE TABLE IF NOT EXISTS `quiz_answers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `submission_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `answer` TEXT NOT NULL,
  `is_correct` BOOLEAN NULL COMMENT 'For auto-graded questions',
  `points_awarded` DECIMAL(5,2) NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_answer` (`submission_id`, `question_id`),
  KEY `submission_id` (`submission_id`),
  KEY `question_id` (`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Add foreign key constraints
ALTER TABLE `quizzes`
ADD CONSTRAINT `quizzes_course_fk` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

ALTER TABLE `quiz_submissions`
ADD CONSTRAINT `quiz_submissions_quiz_fk` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE,
ADD CONSTRAINT `quiz_submissions_student_fk` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
ADD CONSTRAINT `quiz_submissions_grader_fk` FOREIGN KEY (`graded_by`) REFERENCES `teachers` (`id`) ON DELETE SET NULL;

ALTER TABLE `quiz_answers`
ADD CONSTRAINT `quiz_answers_submission_fk` FOREIGN KEY (`submission_id`) REFERENCES `quiz_submissions` (`id`) ON DELETE CASCADE,
ADD CONSTRAINT `quiz_answers_question_fk` FOREIGN KEY (`question_id`) REFERENCES `quiz_questions` (`id`) ON DELETE CASCADE;

-- Update existing quiz_questions foreign key
ALTER TABLE `quiz_questions`
ADD CONSTRAINT `quiz_questions_quiz_fk` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE;
