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

// Claims struct untuk JWT claims
type Claims struct {
	StudentID int    `json:"student_id"`
	Email     string `json:"email"`
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

// GenerateJWT - generate JWT token
func GenerateJWT(studentID int, email string) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour) // Token berlaku 24 jam

	claims := &Claims{
		StudentID: studentID,
		Email:     email,
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
