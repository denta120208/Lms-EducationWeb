-- Create teachers table
CREATE TABLE teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    subject VARCHAR(100) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create students table
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Update courses foreign key to reference teachers table
ALTER TABLE courses 
DROP FOREIGN KEY courses_ibfk_1;

ALTER TABLE courses
ADD CONSTRAINT courses_ibfk_1 FOREIGN KEY (teacher_id) REFERENCES teachers(id);

-- Insert sample teachers
INSERT INTO teachers (name, email, password, subject) VALUES 
('Guru', 'guru@gmail.com', '$2a$10$3QeI1zcVKKItc.NcvjAOEuDxOaKirENylqgRqpLEcJ2b/9EeXQbC2', 'Mathematics'),  -- password: 123456
('Ms. Aurel', 'ms.aurel@gmail.com', '$2a$10$3QeI1zcVKKItc.NcvjAOEuDxOaKirENylqgRqpLEcJ2b/9EeXQbC2', 'Science'); -- password: 123456