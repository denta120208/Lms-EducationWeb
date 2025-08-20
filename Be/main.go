package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)

func main() {
	// Inisialisasi koneksi database
	fmt.Println("Menginisialisasi koneksi database...")
	if err := InitDB(); err != nil {
		log.Fatalf("Gagal koneksi ke database: %v", err)
	}
	fmt.Println("✅ Berhasil terhubung ke database!")

	// Clean up uploads directory
	if err := cleanupUploads(); err != nil {
		fmt.Printf("⚠️  Warning: Failed to clean uploads directory: %v\n", err)
	}

	// Create quiz tables
	if err := CreateQuizTables(DB); err != nil {
		fmt.Printf("⚠️  Warning: Failed to create quiz tables: %v\n", err)
	}

	// Seed test data
	if err := SeedTestData(); err != nil {
		fmt.Printf("⚠️  Warning: Gagal seed data: %v\n", err)
	}

	// Inisialisasi router
	r := mux.NewRouter()

	// Enable CORS
	r.Use(corsMiddleware)

	// Health check endpoint
	r.HandleFunc("/api/health", healthCheck).Methods("GET")

	// Authentication endpoints
	r.HandleFunc("/api/auth/login", loginHandler).Methods("POST")
	r.HandleFunc("/api/auth/login", optionsHandler).Methods("OPTIONS")
	r.HandleFunc("/api/auth/register", registerHandler).Methods("POST")
	r.HandleFunc("/api/auth/register", optionsHandler).Methods("OPTIONS")

	// Admin authentication (DB2)
	r.HandleFunc("/api/admin/login", adminLoginHandler).Methods("POST")
	r.HandleFunc("/api/admin/login", optionsHandler).Methods("OPTIONS")

	// Teacher authentication endpoints
	r.HandleFunc("/api/auth/teacher/login", teacherLoginHandler).Methods("POST")
	r.HandleFunc("/api/auth/teacher/login", optionsHandler).Methods("OPTIONS")

	// Protected endpoints
	r.HandleFunc("/api/profile", authMiddleware(profileHandler)).Methods("GET")
	r.HandleFunc("/api/profile", optionsHandler).Methods("OPTIONS")
	r.HandleFunc("/api/dashboard", authMiddleware(dashboardHandler)).Methods("GET")
	r.HandleFunc("/api/dashboard", optionsHandler).Methods("OPTIONS")

	// Teacher protected endpoints
	r.HandleFunc("/api/teacher/dashboard", teacherAuthMiddleware(teacherDashboardHandler)).Methods("GET")
	r.HandleFunc("/api/teacher/dashboard", optionsHandler).Methods("OPTIONS")
	r.HandleFunc("/api/teacher/courses", teacherAuthMiddleware(teacherCoursesHandler)).Methods("GET")
	r.HandleFunc("/api/teacher/courses", teacherAuthMiddleware(createCourseHandler)).Methods("POST")
	r.HandleFunc("/api/teacher/courses", optionsHandler).Methods("OPTIONS")
	r.HandleFunc("/api/teacher/courses/{id:[0-9]+}", teacherAuthMiddleware(updateCourseHandler)).Methods("PUT")
	r.HandleFunc("/api/teacher/courses/{id:[0-9]+}", teacherAuthMiddleware(deleteCourseHandler)).Methods("DELETE")
	r.HandleFunc("/api/teacher/courses/{id:[0-9]+}", optionsHandler).Methods("OPTIONS")

	// Course enrollment endpoints
	r.HandleFunc("/api/teacher/courses/{id:[0-9]+}/students", teacherAuthMiddleware(getAvailableStudentsHandler)).Methods("GET")
	r.HandleFunc("/api/teacher/courses/{id:[0-9]+}/enrollments", teacherAuthMiddleware(updateEnrollmentsHandler)).Methods("PUT")
	r.HandleFunc("/api/teacher/courses/{id:[0-9]+}/students", optionsHandler).Methods("OPTIONS")
	r.HandleFunc("/api/teacher/courses/{id:[0-9]+}/enrollments", optionsHandler).Methods("OPTIONS")

	// Student course endpoints
	r.HandleFunc("/api/dashboard/courses", authMiddleware(getEnrolledCoursesHandler)).Methods("GET")
	r.HandleFunc("/api/dashboard/courses", optionsHandler).Methods("OPTIONS")
	r.HandleFunc("/api/dashboard/all-courses", authMiddleware(getAllAvailableCoursesHandler)).Methods("GET")
	r.HandleFunc("/api/dashboard/all-courses", optionsHandler).Methods("OPTIONS")
	r.HandleFunc("/api/teacher/profile", teacherAuthMiddleware(teacherProfileHandler)).Methods("GET")
	r.HandleFunc("/api/teacher/profile", optionsHandler).Methods("OPTIONS")

	// File uploads
	r.HandleFunc("/api/upload", teacherAuthMiddleware(uploadFileHandler)).Methods("POST")
	r.HandleFunc("/api/upload", optionsHandler).Methods("OPTIONS")
	r.HandleFunc("/api/upload/material", teacherAuthMiddleware(uploadMaterialFileHandler)).Methods("POST")
	r.HandleFunc("/api/upload/material", optionsHandler).Methods("OPTIONS")

	// Course materials endpoints
	r.HandleFunc("/api/courses/{courseId:[0-9]+}/materials", teacherAuthMiddleware(createCourseMaterialHandler)).Methods("POST")
	r.HandleFunc("/api/courses/{courseId:[0-9]+}/materials", getCourseMaterialsHandler).Methods("GET")
	r.HandleFunc("/api/courses/{courseId:[0-9]+}/materials", optionsHandler).Methods("OPTIONS")
	r.HandleFunc("/api/materials/{materialId:[0-9]+}", teacherAuthMiddleware(deleteMaterialHandler)).Methods("DELETE")
	r.HandleFunc("/api/materials/{materialId:[0-9]+}", optionsHandler).Methods("OPTIONS")

	// Quiz endpoints
	r.HandleFunc("/api/courses/{courseId:[0-9]+}/quizzes", teacherAuthMiddleware(createQuizHandler)).Methods("POST")
	r.HandleFunc("/api/courses/{courseId:[0-9]+}/quizzes", getQuizzesByCourseHandler).Methods("GET")
	r.HandleFunc("/api/courses/{courseId:[0-9]+}/quizzes", optionsHandler).Methods("OPTIONS")
	r.HandleFunc("/api/quizzes/{quizId:[0-9]+}", getQuizByIDHandler).Methods("GET")
	r.HandleFunc("/api/quizzes/{quizId:[0-9]+}", teacherAuthMiddleware(updateQuizHandler)).Methods("PUT")
	r.HandleFunc("/api/quizzes/{quizId:[0-9]+}", teacherAuthMiddleware(deleteQuizHandler)).Methods("DELETE")
	r.HandleFunc("/api/quizzes/{quizId:[0-9]+}", optionsHandler).Methods("OPTIONS")
	r.HandleFunc("/api/upload/quiz-pdf", teacherAuthMiddleware(uploadQuizPDFHandler)).Methods("POST")
	r.HandleFunc("/api/upload/quiz-pdf", optionsHandler).Methods("OPTIONS")

	// Quiz submission endpoints
	r.HandleFunc("/api/quiz-submissions", authMiddleware(submitQuizHandler)).Methods("POST")
	r.HandleFunc("/api/quiz-submissions", optionsHandler).Methods("OPTIONS")
	r.HandleFunc("/api/quiz-submissions/check/{quizId}", authMiddleware(checkQuizSubmissionHandler)).Methods("GET")
	r.HandleFunc("/api/quiz-submissions/check/{quizId}", optionsHandler).Methods("OPTIONS")
	r.HandleFunc("/api/quiz-submissions/pdf", authMiddleware(submitQuizPDFHandler)).Methods("POST")
	r.HandleFunc("/api/quiz-submissions/pdf", optionsHandler).Methods("OPTIONS")

	// Quiz grading and results endpoints
	r.HandleFunc("/api/quizzes/{quizId:[0-9]+}/submissions", teacherAuthMiddleware(getQuizSubmissionsHandler)).Methods("GET")
	r.HandleFunc("/api/quizzes/{quizId:[0-9]+}/submissions", optionsHandler).Methods("OPTIONS")
	r.HandleFunc("/api/quiz-submissions/grade", teacherAuthMiddleware(gradeEssayHandler)).Methods("POST")
	r.HandleFunc("/api/quiz-submissions/grade", optionsHandler).Methods("OPTIONS")
	r.HandleFunc("/api/student/quiz-results", authMiddleware(getStudentQuizResultsHandler)).Methods("GET")
	r.HandleFunc("/api/student/quiz-results", optionsHandler).Methods("OPTIONS")
	r.HandleFunc("/api/student/quiz-results/{submissionId:[0-9]+}", authMiddleware(getStudentQuizDetailHandler)).Methods("GET")
	r.HandleFunc("/api/student/quiz-results/{submissionId:[0-9]+}", optionsHandler).Methods("OPTIONS")

	// Debug static file test page
	r.HandleFunc("/debug", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./debug_static.html")
	}).Methods("GET")

	// Debug quiz endpoint
	r.HandleFunc("/api/debug/quizzes", debugQuizzesHandler).Methods("GET")

	// Serve uploaded files with CORS support
	r.PathPrefix("/uploads/").Handler(corsFileHandler(http.StripPrefix("/uploads/", http.FileServer(http.Dir("./uploads")))))

	// Create uploads directories if they don't exist
	os.MkdirAll("./uploads", 0755)
	os.MkdirAll("./uploads/materials", 0755)
	os.MkdirAll("./uploads/quiz-pdfs", 0755)

	// Endpoint dasar (dummy)
	r.HandleFunc("/api/users", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"message": "Users endpoint"}`))
	}).Methods("GET")

	r.HandleFunc("/api/materials", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"message": "Materials endpoint"}`))
	}).Methods("GET")

	r.HandleFunc("/api/quizzes", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"message": "Quizzes endpoint"}`))
	}).Methods("GET")

	// Menentukan port
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("🚀 Server berjalan di http://localhost:%s\n", port)
	fmt.Printf("📊 Health check: http://localhost:%s/api/health\n", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}

// CORS File Handler for static files
func corsFileHandler(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers for file requests
		origin := r.Header.Get("Origin")
		if origin == "http://localhost:5173" || origin == "http://localhost:5174" {
			w.Header().Set("Access-Control-Allow-Origin", origin)
		} else {
			w.Header().Set("Access-Control-Allow-Origin", "*")
		}
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().Set("Access-Control-Max-Age", "86400")

		// Handle preflight requests
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Call the next handler
		next.ServeHTTP(w, r)
	})
}

// CORS Middleware
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers for all responses
		origin := r.Header.Get("Origin")
		if origin == "http://localhost:5173" || origin == "http://localhost:5174" {
			w.Header().Set("Access-Control-Allow-Origin", origin)
		} else {
			w.Header().Set("Access-Control-Allow-Origin", "*") // Allow all origins for development
		}
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().Set("Access-Control-Max-Age", "86400")

		// Handle preflight requests
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Call the next handler
		next.ServeHTTP(w, r)
	})
}

// Auth Middleware
func authMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Authorization header required", http.StatusUnauthorized)
			return
		}

		tokenString := strings.Replace(authHeader, "Bearer ", "", 1)
		claims, err := ValidateJWT(tokenString)
		if err != nil {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		// Add claims to request context
		ctx := context.WithValue(r.Context(), "user_id", claims.StudentID)
		ctx = context.WithValue(ctx, "user_email", claims.Email)
		ctx = context.WithValue(ctx, "user_role", claims.Role)

		// Also set in headers for backward compatibility
		r.Header.Set("X-Student-ID", fmt.Sprintf("%d", claims.StudentID))
		r.Header.Set("X-Student-Email", claims.Email)

		// Call the next handler with the updated context
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}

// Teacher Auth Middleware
func teacherAuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Authorization header required", http.StatusUnauthorized)
			return
		}

		tokenString := strings.Replace(authHeader, "Bearer ", "", 1)
		claims, err := ValidateJWT(tokenString)
		if err != nil {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		// Pastikan ini adalah token teacher
		if claims.Role != "teacher" {
			http.Error(w, "Teacher access required", http.StatusForbidden)
			return
		}

		// Add claims to request context
		ctx := context.WithValue(r.Context(), "user_id", claims.TeacherID)
		ctx = context.WithValue(ctx, "user_email", claims.Email)
		ctx = context.WithValue(ctx, "user_role", claims.Role)

		// Also set in headers for backward compatibility
		r.Header.Set("X-Teacher-ID", fmt.Sprintf("%d", claims.TeacherID))
		r.Header.Set("X-Teacher-Email", claims.Email)

		// Call the next handler with the updated context
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}

// Options Handler for CORS preflight
func optionsHandler(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers explicitly for OPTIONS requests
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Max-Age", "86400")

	w.WriteHeader(http.StatusOK)
}

// Admin auth middleware
func adminAuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        authHeader := r.Header.Get("Authorization")
        if authHeader == "" { http.Error(w, "Authorization header required", http.StatusUnauthorized); return }
        tokenString := strings.Replace(authHeader, "Bearer ", "", 1)
        claims, err := ValidateJWT(tokenString)
        if err != nil || claims.Role != "admin" { http.Error(w, "Admin access required", http.StatusForbidden); return }
        ctx := context.WithValue(r.Context(), "admin_id", claims.AdminID)
        next.ServeHTTP(w, r.WithContext(ctx))
    }
}

// Admin Login Handler (DB2)
func adminLoginHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")

    if DB2 == nil {
        http.Error(w, "Admin DB not configured", http.StatusServiceUnavailable)
        return
    }

    var req AdminLoginRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "Invalid request body", http.StatusBadRequest)
        return
    }
    if req.Username == "" || req.Password == "" {
        http.Error(w, "Username and password are required", http.StatusBadRequest)
        return
    }

    // Query admin from DB2
    var admin AdminUser
    row := DB2.QueryRow("SELECT id, username, email, password FROM admin_users WHERE username = ?", req.Username)
    if err := row.Scan(&admin.ID, &admin.Username, &admin.Email, &admin.Password); err != nil {
        http.Error(w, "Username atau password salah", http.StatusUnauthorized)
        return
    }
    if !CheckPasswordHash(req.Password, admin.Password) {
        http.Error(w, "Username atau password salah", http.StatusUnauthorized)
        return
    }

    token, err := GenerateAdminJWT(admin.ID, admin.Email)
    if err != nil {
        http.Error(w, "Failed to generate token", http.StatusInternalServerError)
        return
    }

    admin.Password = ""
    resp := AdminLoginResponse{ Token: token, Admin: admin, Message: "Login berhasil" }
    json.NewEncoder(w).Encode(resp)
}

// Admin settings endpoints removed per request

// Login Handler
func loginHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var loginReq LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&loginReq); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validasi input
	if loginReq.Email == "" || loginReq.Password == "" {
		http.Error(w, "Email and password are required", http.StatusBadRequest)
		return
	}

	if len(loginReq.Password) < 6 {
		http.Error(w, "Password must be at least 6 characters", http.StatusBadRequest)
		return
	}

	// Cari student berdasarkan email
	student, err := GetStudentByEmail(loginReq.Email)
	if err != nil {
		http.Error(w, "Email atau password salah", http.StatusUnauthorized)
		return
	}

	// Verifikasi password
	if !CheckPasswordHash(loginReq.Password, student.Password) {
		http.Error(w, "Email atau password salah", http.StatusUnauthorized)
		return
	}

	// Generate JWT token
	token, err := GenerateJWT(student.ID, student.Email)
	if err != nil {
		http.Error(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}

	// Hapus password dari response
	student.Password = ""

	response := LoginResponse{
		Token:   token,
		Student: *student,
		Message: "Login berhasil",
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

// Register Handler
func registerHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var student Student
	if err := json.NewDecoder(r.Body).Decode(&student); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validasi input
	if student.Name == "" || student.Email == "" || student.Password == "" {
		http.Error(w, "Name, email, and password are required", http.StatusBadRequest)
		return
	}

	if len(student.Password) < 6 {
		http.Error(w, "Password must be at least 6 characters", http.StatusBadRequest)
		return
	}

	// Buat student baru
	if err := CreateStudent(student.Name, student.Email, student.Password); err != nil {
		if strings.Contains(err.Error(), "Duplicate entry") {
			http.Error(w, "Email already exists", http.StatusConflict)
			return
		}
		http.Error(w, "Failed to create student", http.StatusInternalServerError)
		return
	}

	response := map[string]string{
		"message": "Student registered successfully",
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

// Profile Handler (Protected)
func profileHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	email := r.Header.Get("X-Student-Email")
	student, err := GetStudentByEmail(email)
	if err != nil {
		http.Error(w, "Student not found", http.StatusNotFound)
		return
	}

	// Hapus password dari response
	student.Password = ""

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(student)
}

// Dashboard Handler (Protected)
func dashboardHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	email := r.Header.Get("X-Student-Email")
	student, err := GetStudentByEmail(email)
	if err != nil {
		http.Error(w, "Student not found", http.StatusNotFound)
		return
	}

	response := map[string]interface{}{
		"message": "Welcome to dashboard",
		"student": map[string]interface{}{
			"id":    student.ID,
			"name":  student.Name,
			"email": student.Email,
		},
		"courses": []map[string]interface{}{
			{"id": 1, "title": "React Fundamentals", "progress": 75},
			{"id": 2, "title": "Node.js Backend", "progress": 50},
			{"id": 3, "title": "Database Design", "progress": 25},
		},
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

// Health check endpoint - sederhana dan bersih
func healthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Check database connection
	dbStatus := "connected"
	if DB == nil || DB.Ping() != nil {
		dbStatus = "disconnected"
	}

	response := map[string]interface{}{
		"status":   "ok",
		"message":  "LMS Garage API is running",
		"database": dbStatus,
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

// Teacher Login Handler
func teacherLoginHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var loginReq LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&loginReq); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validasi input
	if loginReq.Email == "" || loginReq.Password == "" {
		http.Error(w, "Email and password are required", http.StatusBadRequest)
		return
	}

	// Cari teacher berdasarkan email
	teacher, err := GetTeacherByEmail(loginReq.Email)
	if err != nil {
		http.Error(w, "Email atau password salah", http.StatusUnauthorized)
		return
	}

	// Verifikasi password
	if !CheckPasswordHash(loginReq.Password, teacher.Password) {
		http.Error(w, "Email atau password salah", http.StatusUnauthorized)
		return
	}

	// Generate JWT token
	token, err := GenerateTeacherJWT(teacher.ID, teacher.Email)
	if err != nil {
		http.Error(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}

	// Hapus password dari response
	teacher.Password = ""

	response := TeacherLoginResponse{
		Token:   token,
		Teacher: *teacher,
		Message: "Login berhasil",
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

// Teacher Dashboard Handler
func teacherDashboardHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Get teacher ID from context
	teacherID, ok := r.Context().Value("user_id").(int)
	if !ok {
		http.Error(w, "Unauthorized or invalid teacher ID", http.StatusUnauthorized)
		return
	}

	// Get teacher email from context
	email, _ := r.Context().Value("user_email").(string)
	if email == "" {
		email = r.Header.Get("X-Teacher-Email") // Fallback to header
	}

	// Get teacher information
	teacher, err := GetTeacherByEmail(email)
	if err != nil {
		http.Error(w, "Teacher not found", http.StatusNotFound)
		return
	}

	// Get courses from auth.go's implementation
	basicCourses, err := GetCoursesByTeacher(teacherID)
	if err != nil {
		log.Printf("Error getting courses: %v", err)
		basicCourses = []Course{} // Empty array if error
	}

	// Calculate total courses
	totalCourses := len(basicCourses)

	response := map[string]interface{}{
		"message": "Welcome to teacher dashboard",
		"teacher": map[string]interface{}{
			"id":      teacher.ID,
			"name":    teacher.Name,
			"email":   teacher.Email,
			"subject": teacher.Subject,
		},
		"courses": basicCourses,
		"summary": map[string]interface{}{
			"total_courses": totalCourses,
			"subjects": []map[string]interface{}{
				{"name": "Mathematics", "grade": "10th grade", "students": 25},
				{"name": "Mathematics", "grade": "9th grade", "students": 30},
				{"name": "Science", "grade": "7th grade", "students": 28},
			},
		},
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

// teacherCoursesHandler is now defined in course.go

// Teacher Profile Handler
func teacherProfileHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Get teacher email from context
	email, _ := r.Context().Value("user_email").(string)
	if email == "" {
		email = r.Header.Get("X-Teacher-Email") // Fallback to header
	}

	if email == "" {
		http.Error(w, "Teacher email not found in request", http.StatusBadRequest)
		return
	}

	teacher, err := GetTeacherByEmail(email)
	if err != nil {
		http.Error(w, "Teacher not found", http.StatusNotFound)
		return
	}

	// Hapus password dari response
	teacher.Password = ""

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(teacher)
}
