package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

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

	// Inisialisasi router
	r := mux.NewRouter()

	// Test endpoint untuk database
	r.HandleFunc("/api/test-db", testDBConnection).Methods("GET")
	r.HandleFunc("/api/db-status", getDBStatus).Methods("GET")

	// Endpoint dasar (dummy)
	r.HandleFunc("/api/auth/login", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"message": "Login endpoint"}`))
	}).Methods("POST")

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
	fmt.Println("📊 Test database connection: http://localhost:" + port + "/api/test-db")
	log.Fatal(http.ListenAndServe(":"+port, r))
}

// Fungsi untuk test koneksi database
func testDBConnection(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if DB == nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"status": "error", "message": "Database connection is nil"}`))
		return
	}

	if err := DB.Ping(); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(fmt.Sprintf(`{"status": "error", "message": "Database ping failed: %v"}`, err)))
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status": "success", "message": "Database connection is working!"}`))
}

// Fungsi untuk mendapatkan status database dan tabel
func getDBStatus(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if DB == nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"status": "error", "message": "Database connection is nil"}`))
		return
	}

	// Test koneksi
	if err := DB.Ping(); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(fmt.Sprintf(`{"status": "error", "message": "Database ping failed: %v"}`, err)))
		return
	}

	// Ambil daftar tabel
	rows, err := DB.Query("SHOW TABLES")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(fmt.Sprintf(`{"status": "error", "message": "Failed to show tables: %v"}`, err)))
		return
	}
	defer rows.Close()

	var tables []string
	for rows.Next() {
		var tableName string
		if err := rows.Scan(&tableName); err != nil {
			continue
		}
		tables = append(tables, tableName)
	}

	response := map[string]interface{}{
		"status":      "success",
		"message":     "Database is connected and working!",
		"database":    "lms_garage",
		"tables":      tables,
		"table_count": len(tables),
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}
