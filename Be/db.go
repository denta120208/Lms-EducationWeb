package main

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

var DB *sql.DB

func InitDB() error {
	// Load .env file if exists
	if err := godotenv.Load(); err != nil {
		fmt.Println("⚠️  File .env tidak ditemukan, menggunakan nilai default")
	}

	user := os.Getenv("DB_USER")
	pass := os.Getenv("DB_PASS")
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	name := os.Getenv("DB_NAME")

	if user == "" {
		user = "root"
	}
	if pass == "" {
		pass = ""
	}
	if host == "" {
		host = "localhost"
	}
	if port == "" {
		port = "3306"
	}
	if name == "" {
		name = "lms_garage"
	}

	fmt.Printf("🔗 Mencoba koneksi ke database: %s@%s:%s/%s\n", user, host, port, name)

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true&charset=utf8mb4&collation=utf8mb4_unicode_ci", user, pass, host, port, name)

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return fmt.Errorf("gagal membuka koneksi database: %v", err)
	}

	// Set connection pool settings
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(25)

	if err := db.Ping(); err != nil {
		return fmt.Errorf("gagal ping database: %v", err)
	}

	DB = db
	fmt.Println("✅ Koneksi database berhasil!")

	// Buat tabel jika belum ada
	if err := createTables(); err != nil {
		fmt.Printf("⚠️  Warning: Gagal membuat tabel: %v\n", err)
	}

	// Create course materials table
	if err := createCourseMaterialsTable(); err != nil {
		fmt.Printf("⚠️  Warning: Gagal membuat tabel course_materials: %v\n", err)
	}

	return nil
}

// Fungsi untuk membuat tabel dasar
func createTables() error {
	tables := []string{
		`CREATE TABLE IF NOT EXISTS students (
			id INT AUTO_INCREMENT PRIMARY KEY,
			name VARCHAR(100) NOT NULL,
			email VARCHAR(100) UNIQUE NOT NULL,
			password VARCHAR(255) NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
		)`,
		`CREATE TABLE IF NOT EXISTS teachers (
			id INT AUTO_INCREMENT PRIMARY KEY,
			name VARCHAR(100) NOT NULL,
			email VARCHAR(100) UNIQUE NOT NULL,
			password VARCHAR(255) NOT NULL,
			subject VARCHAR(100),
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
		)`,
		`CREATE TABLE IF NOT EXISTS courses (
			id INT AUTO_INCREMENT PRIMARY KEY,
			title VARCHAR(255) NOT NULL,
			description TEXT,
			subject VARCHAR(100),
			grade VARCHAR(20),
			teacher_id INT,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL
		)`,
		`CREATE TABLE IF NOT EXISTS users (
			id INT AUTO_INCREMENT PRIMARY KEY,
			username VARCHAR(50) UNIQUE NOT NULL,
			email VARCHAR(100) UNIQUE NOT NULL,
			password VARCHAR(255) NOT NULL,
			role ENUM('admin', 'instructor', 'student') DEFAULT 'student',
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
		)`,
		`CREATE TABLE IF NOT EXISTS materials (
			id INT AUTO_INCREMENT PRIMARY KEY,
			title VARCHAR(255) NOT NULL,
			description TEXT,
			content LONGTEXT,
			instructor_id INT,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE SET NULL
		)`,
		`CREATE TABLE IF NOT EXISTS quizzes (
			id INT AUTO_INCREMENT PRIMARY KEY,
			title VARCHAR(255) NOT NULL,
			description TEXT,
			material_id INT,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE
		)`,
		`CREATE TABLE IF NOT EXISTS quiz_questions (
			id INT AUTO_INCREMENT PRIMARY KEY,
			quiz_id INT NOT NULL,
			question TEXT NOT NULL,
			option_a VARCHAR(255),
			option_b VARCHAR(255),
			option_c VARCHAR(255),
			option_d VARCHAR(255),
			correct_answer ENUM('A', 'B', 'C', 'D') NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
		)`,
		`CREATE TABLE IF NOT EXISTS course_enrollments (
			id INT AUTO_INCREMENT PRIMARY KEY,
			course_id INT NOT NULL,
			student_id INT NOT NULL,
			enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			UNIQUE KEY unique_enrollment (course_id, student_id),
			FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
			FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
		)`,
	}

	for _, table := range tables {
		if _, err := DB.Exec(table); err != nil {
			return fmt.Errorf("gagal membuat tabel: %v", err)
		}
	}

	fmt.Println("✅ Tabel database berhasil dibuat/diverifikasi!")
	return nil
}
