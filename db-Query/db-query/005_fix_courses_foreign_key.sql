-- Backup existing courses
CREATE TABLE courses_backup AS SELECT * FROM courses;

-- Drop existing foreign key constraints
ALTER TABLE course_enrollments DROP FOREIGN KEY course_enrollments_ibfk_1;
ALTER TABLE courses DROP FOREIGN KEY courses_ibfk_1;

-- Drop and recreate courses table with correct foreign key
DROP TABLE courses;
CREATE TABLE courses (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `image_path` varchar(255) DEFAULT NULL,
  `teacher_id` int NOT NULL,
  `subject` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `teacher_id` (`teacher_id`),
  CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Restore courses data
INSERT INTO courses (id, title, description, image_path, teacher_id, subject, created_at, updated_at)
SELECT id, title, description, image_path, teacher_id, subject, created_at, updated_at
FROM courses_backup;

-- Drop backup table
DROP TABLE courses_backup;

-- Recreate course_enrollments foreign key
ALTER TABLE course_enrollments
ADD CONSTRAINT course_enrollments_ibfk_1 FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;