package main

import (
	"fmt"
	"log"
)

// SeedTestData - menambahkan data test untuk development
func SeedTestData() error {
	fmt.Println("🌱 Seeding test data...")

	// Seed Students
	var studentCount int
	err := DB.QueryRow("SELECT COUNT(*) FROM students WHERE email = ?", "test@example.com").Scan(&studentCount)
	if err != nil {
		return fmt.Errorf("gagal cek existing student data: %v", err)
	}

	if studentCount == 0 {
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
	} else {
		fmt.Println("✅ Test students sudah ada")
	}

	// Seed Teachers
	var teacherCount int
	err = DB.QueryRow("SELECT COUNT(*) FROM teachers WHERE email = ?", "guru@gmail.com").Scan(&teacherCount)
	if err != nil {
		return fmt.Errorf("gagal cek existing teacher data: %v", err)
	}

	if teacherCount == 0 {
		// Buat test teacher
		testTeachers := []struct {
			name     string
			email    string
			password string
			subject  string
		}{
			{"Mr. Agus", "guru@gmail.com", "123456", "Mathematics"},
			{"Ms. Aurel", "ms.aurel@gmail.com", "123456", "Science"},
		}

		for _, teacher := range testTeachers {
			err := CreateTeacher(teacher.name, teacher.email, teacher.password, teacher.subject)
			if err != nil {
				fmt.Printf("⚠️  Gagal membuat teacher %s: %v\n", teacher.email, err)
			} else {
				fmt.Printf("✅ Teacher %s berhasil dibuat\n", teacher.email)
			}
		}
	} else {
		fmt.Println("✅ Test teachers sudah ada")
	}

	// Seed some test courses with images
	var courseCount int
	err = DB.QueryRow("SELECT COUNT(*) FROM courses").Scan(&courseCount)
	if err != nil {
		return fmt.Errorf("gagal cek existing course data: %v", err)
	}

	if courseCount == 0 {
		// Get teacher IDs
		var teacherID1, teacherID2 int
		err = DB.QueryRow("SELECT id FROM teachers WHERE email = ?", "guru@gmail.com").Scan(&teacherID1)
		if err != nil {
			fmt.Printf("⚠️  Teacher guru@gmail.com not found: %v\n", err)
			teacherID1 = 0
		}
		
		err = DB.QueryRow("SELECT id FROM teachers WHERE email = ?", "gmail").Scan(&teacherID2)
		if err != nil {
			// Create the gmail teacher if not exists
			err = CreateTeacher("Teacher Gmail", "gmail", "ya", "General Studies")
			if err != nil {
				fmt.Printf("⚠️  Gagal membuat teacher gmail: %v\n", err)
				teacherID2 = 0
			} else {
				err = DB.QueryRow("SELECT id FROM teachers WHERE email = ?", "gmail").Scan(&teacherID2)
				if err != nil {
					fmt.Printf("⚠️  Gagal mendapatkan ID teacher gmail: %v\n", err)
					teacherID2 = 0
				} else {
					fmt.Printf("✅ Teacher gmail berhasil dibuat dengan ID %d\n", teacherID2)
				}
			}
		}

		// Create test courses
		testCourses := []struct {
			title       string
			description string
			subject     string
			grade       string
			teacherID   int
			imagePath   string
		}{
			{
				"Mathematics Grade 10",
				"Advanced mathematics course covering algebra, geometry, and calculus basics",
				"Mathematics",
				"10",
				teacherID1,
				"/uploads/1754465600902445500_Screenshot_(153).png",
			},
			{
				"Science Fundamentals",
				"Introduction to physics, chemistry, and biology concepts",
				"Science",
				"9",
				teacherID2,
				"/uploads/1754556399763364000_Screenshot_(187).png",
			},
			{
				"English Literature",
				"Exploring classic and modern literature with writing exercises",
				"English",
				"11",
				teacherID1,
				"",
			},
		}

		for _, course := range testCourses {
			if course.teacherID > 0 {
				query := "INSERT INTO courses (title, description, subject, grade, teacher_id, image_path) VALUES (?, ?, ?, ?, ?, ?)"
				_, err := DB.Exec(query, course.title, course.description, course.subject, course.grade, course.teacherID, course.imagePath)
				if err != nil {
					fmt.Printf("⚠️  Gagal membuat course %s: %v\n", course.title, err)
				} else {
					fmt.Printf("✅ Course %s berhasil dibuat\n", course.title)
				}
			}
		}
	} else {
		fmt.Println("✅ Test courses sudah ada")
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
	fmt.Println("   Students:")
	fmt.Println("     Email: test@example.com, Password: password123")
	fmt.Println("     Email: jane@example.com, Password: password123")
	fmt.Println("     Email: avelyn@example.com, Password: password123")
	fmt.Println("   Teachers:")
	fmt.Println("     Email: guru@gmail.com, Password: 123456")
	fmt.Println("     Email: ms.aurel@gmail.com, Password: 123456")
}
