-- Insert teacher data
INSERT INTO teachers (name, email, password, subject)
VALUES 
('Mr. Agus', 'agus@example.com', '$2a$10$YourHashedPasswordHere', 'Mathematics'),
('Ms. Aurel', 'aurel@example.com', '$2a$10$YourHashedPasswordHere', 'Science');

-- Note: Replace $2a$10$YourHashedPasswordHere with actual bcrypt hash of the password
-- You can use the following Go code to generate the hash:
-- hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("your_password"), bcrypt.DefaultCost)