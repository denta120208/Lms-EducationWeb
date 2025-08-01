package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	_ "github.com/go-sql-driver/mysql"
)

func main() {
	r := mux.NewRouter()

	// Endpoint dasar (dummy)
	r.HandleFunc("/api/auth/login", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Login endpoint"))
	}).Methods("POST")

	r.HandleFunc("/api/users", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Users endpoint"))
	}).Methods("GET")

	r.HandleFunc("/api/materials", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Materials endpoint"))
	}).Methods("GET")

	r.HandleFunc("/api/quizzes", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Quizzes endpoint"))
	}).Methods("GET")

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	fmt.Println("Server running at :" + port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
