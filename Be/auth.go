package main

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// JWT Secret Key - dalam production, ini harus disimpan di environment variable
var jwtSecret = []byte("your-secret-key-change-this-in-production")

// Student struct untuk data siswa
type Student struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password,omitempty"` // omitempty agar password tidak di-return ke frontend
}

// Teacher struct untuk data guru
type Teacher struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Subject  string `json:"subject"`
	Password string `json:"password,omitempty"` // omitempty agar password tidak di-return ke frontend
}

// Course struct untuk data kursus
type Course struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Subject     string `json:"subject"`
	Grade       string `json:"grade"`
	TeacherID   int    `json:"teacher_id"`
	TeacherName string `json:"teacher_name,omitempty"`
}

// LoginRequest struct untuk request login
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// LoginResponse struct untuk response login
type LoginResponse struct {
	Token   string  `json:"token"`
	Student Student `json:"student"`
	Message string  `json:"message"`
}

// TeacherLoginResponse struct untuk response login guru
type TeacherLoginResponse struct {
	Token   string  `json:"token"`
	Teacher Teacher `json:"teacher"`
	Message string  `json:"message"`
}

// Claims struct untuk JWT claims
type Claims struct {
	StudentID int    `json:"student_id"`
	TeacherID int    `json:"teacher_id"`
	Email     string `json:"email"`
	Role      string `json:"role"` // "student" atau "teacher"
	jwt.RegisteredClaims
}

// HashPassword - hash password menggunakan bcrypt
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

// CheckPasswordHash - verifikasi password dengan hash
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// GenerateJWT - generate JWT token untuk student
func GenerateJWT(studentID int, email string) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour) // Token berlaku 24 jam

	claims := &Claims{
		StudentID: studentID,
		Email:     email,
		Role:      "student",
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "lms-garage",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

// GenerateTeacherJWT - generate JWT token untuk teacher
func GenerateTeacherJWT(teacherID int, email string) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour) // Token berlaku 24 jam

	claims := &Claims{
		TeacherID: teacherID,
		Email:     email,
		Role:      "teacher",
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "lms-garage",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

// ValidateJWT - validasi JWT token
func ValidateJWT(tokenString string) (*Claims, error) {
	claims := &Claims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, errors.New("invalid token")
	}

	return claims, nil
}

// GetStudentByEmail - ambil data siswa berdasarkan email
func GetStudentByEmail(email string) (*Student, error) {
	var student Student

	query := "SELECT id, name, email, password FROM students WHERE email = ?"
	row := DB.QueryRow(query, email)

	err := row.Scan(&student.ID, &student.Name, &student.Email, &student.Password)
	if err != nil {
		return nil, err
	}

	return &student, nil
}

// CreateStudent - buat siswa baru (untuk testing)
func CreateStudent(name, email, password string) error {
	hashedPassword, err := HashPassword(password)
	if err != nil {
		return err
	}

	query := "INSERT INTO students (name, email, password) VALUES (?, ?, ?)"
	_, err = DB.Exec(query, name, email, hashedPassword)
	return err
}

// GetTeacherByEmail - ambil data guru berdasarkan email
func GetTeacherByEmail(email string) (*Teacher, error) {
	var teacher Teacher

	query := "SELECT id, name, email, subject, password FROM teachers WHERE email = ?"
	row := DB.QueryRow(query, email)

	err := row.Scan(&teacher.ID, &teacher.Name, &teacher.Email, &teacher.Subject, &teacher.Password)
	if err != nil {
		return nil, err
	}

	return &teacher, nil
}

// CreateTeacher - buat guru baru
func CreateTeacher(name, email, password, subject string) error {
	hashedPassword, err := HashPassword(password)
	if err != nil {
		return err
	}

	query := "INSERT INTO teachers (name, email, password, subject) VALUES (?, ?, ?, ?)"
	_, err = DB.Exec(query, name, email, hashedPassword, subject)
	return err
}

// GetCoursesByTeacher - ambil kursus berdasarkan teacher ID
func GetCoursesByTeacher(teacherID int) ([]Course, error) {
	var courses []Course

	query := `SELECT c.id, c.title, c.description, c.subject, c.grade, c.teacher_id, t.name as teacher_name 
			  FROM courses c 
			  LEFT JOIN teachers t ON c.teacher_id = t.id 
			  WHERE c.teacher_id = ?`

	rows, err := DB.Query(query, teacherID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var course Course
		err := rows.Scan(&course.ID, &course.Title, &course.Description, &course.Subject, &course.Grade, &course.TeacherID, &course.TeacherName)
		if err != nil {
			return nil, err
		}
		courses = append(courses, course)
	}

	return courses, nil
}

// CreateCourse - buat kursus baru
func CreateCourse(title, description, subject, grade string, teacherID int) error {
	query := "INSERT INTO courses (title, description, subject, grade, teacher_id) VALUES (?, ?, ?, ?, ?)"
	_, err := DB.Exec(query, title, description, subject, grade, teacherID)
	return err
}
