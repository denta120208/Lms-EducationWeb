-- Database: `lms_garage`

-- Tabel: courses
CREATE TABLE `courses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `teacher_id` int(11) NOT NULL,
  `subject` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `teacher_id` (`teacher_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel: course_enrollments
CREATE TABLE `course_enrollments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `course_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `enrolled_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_enrollment` (`course_id`,`student_id`),
  KEY `student_id` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel: materials
CREATE TABLE `materials` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `instructor_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `instructor_id` (`instructor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel: quizzes
CREATE TABLE `quizzes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `material_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `material_id` (`material_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel: quiz_questions
CREATE TABLE `quiz_questions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `quiz_id` int(11) NOT NULL,
  `question` text NOT NULL,
  `option_a` varchar(255) DEFAULT NULL,
  `option_b` varchar(255) DEFAULT NULL,
  `option_c` varchar(255) DEFAULT NULL,
  `option_d` varchar(255) DEFAULT NULL,
  `correct_answer` enum('A','B','C','D') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `quiz_id` (`quiz_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel: students
CREATE TABLE `students` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `students` (`id`, `name`, `email`, `password`, `created_at`, `updated_at`) VALUES
(1, 'John Doe', 'test@example.com', '$2a$10$za8QgzV9mJ/s3t5t0zxOWuqUxRlSGAEWyWnmEbisRmOeQfB.3oqgW', '2025-08-06 03:23:51', '2025-08-06 03:23:51'),
(2, 'Jane Smith', 'jane@example.com', '$2a$10$anT1iA8vKqHgRHCLJUvAieYfegSHDOpsoqQP9L1Le1vO8vntlm./2', '2025-08-06 03:23:51', '2025-08-06 03:23:51'),
(3, 'Avelyn Chintia', 'avelyn@example.com', '$2a$10$cZdai3RflGMHH3m3asDQf.Jr2atDBsiJXLjSpyeWc/Qo96myE2Fiu', '2025-08-06 03:23:51', '2025-08-06 03:23:51');

-- Tabel: teachers
CREATE TABLE `teachers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `subject` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `teachers` (`id`, `name`, `email`, `password`, `subject`, `created_at`) VALUES
(1, 'Mr. Agus', 'guru@gmail.com', '$2a$10$rAxey1CyjJO4Pc.lEqbokud7DpykglSlZWdCyhazPRRtYqxUIOK4G', 'Mathematics', '2025-08-06 03:23:51'),
(2, 'Ms. Aurel', 'ms.aurel@gmail.com', '$2a$10$q.jR7pVnvxwyiuSLqARLW.owperfhTCVZ7wbm/b0sOBQUEjNk71Km', 'Science', '2025-08-06 03:23:51');

-- Tabel: users
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','instructor','student') DEFAULT 'student',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Foreign Key Constraints
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`);

ALTER TABLE `course_enrollments`
  ADD CONSTRAINT `course_enrollments_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `course_enrollments_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE;

ALTER TABLE `materials`
  ADD CONSTRAINT `materials_ibfk_1` FOREIGN KEY (`instructor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `quizzes`
  ADD CONSTRAINT `quizzes_ibfk_1` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`) ON DELETE CASCADE;

ALTER TABLE `quiz_questions`
  ADD CONSTRAINT `quiz_questions_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE;
