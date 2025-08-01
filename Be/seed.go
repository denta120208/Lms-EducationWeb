package main

import (
	"fmt"
	"log"
)

// SeedTestData - menambahkan data test untuk development
func SeedTestData() error {
	fmt.Println("🌱 Seeding test data...")

	// Cek apakah sudah ada student test
	var count int
	err := DB.QueryRow("SELECT COUNT(*) FROM students WHERE email = ?", "test@example.com").Scan(&count)
	if err != nil {
		return fmt.Errorf("gagal cek existing data: %v", err)
	}

	if count > 0 {
		fmt.Println("✅ Test student sudah ada")
		return nil
	}

	// Buat test student
	testStudents := []struct {
		name     string
		email    string
		password string
	}{
		{"John Doe", "test@example.com", "password123"},
		{"Jane Smith", "jane@example.com", "password123"},
		{"Avelyn Chintia", "avelyn@example.com", "password123"},
	}

	for _, student := range testStudents {
		err := CreateStudent(student.name, student.email, student.password)
		if err != nil {
			fmt.Printf("⚠️  Gagal membuat student %s: %v\n", student.email, err)
		} else {
			fmt.Printf("✅ Student %s berhasil dibuat\n", student.email)
		}
	}

	fmt.Println("🌱 Seeding selesai!")
	return nil
}

// RunSeed - function untuk menjalankan seeding (bisa dipanggil dari main jika diperlukan)
func RunSeed() {
	// Inisialisasi koneksi database
	if err := InitDB(); err != nil {
		log.Fatalf("Gagal koneksi ke database: %v", err)
	}

	// Seed test data
	if err := SeedTestData(); err != nil {
		log.Fatalf("Gagal seed data: %v", err)
	}

	fmt.Println("✅ Seeding berhasil!")
	fmt.Println("📝 Test accounts:")
	fmt.Println("   Email: test@example.com, Password: password123")
	fmt.Println("   Email: jane@example.com, Password: password123")
	fmt.Println("   Email: avelyn@example.com, Password: password123")
}
