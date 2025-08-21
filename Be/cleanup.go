package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"strings"
)

// cleanupUploads removes orphaned files from the ./uploads directory
func cleanupUploads() error {
	uploadsDir := "./uploads"
	log.Printf("Starting cleanup check of uploads directory: %s", uploadsDir)

	// Check if directory exists
	if _, err := os.Stat(uploadsDir); os.IsNotExist(err) {
		log.Printf("Uploads directory does not exist, creating: %s", uploadsDir)
		return os.MkdirAll(uploadsDir, 0755)
	}

	// Get all files in uploads directory
	files, err := ioutil.ReadDir(uploadsDir)
	if err != nil {
		return fmt.Errorf("failed to read uploads directory: %w", err)
	}

	if len(files) == 0 {
		log.Printf("Uploads directory is empty: %s", uploadsDir)
		return nil
	}

	// Get all image paths from database
	rows, err := DB.Query("SELECT image_path FROM courses WHERE image_path IS NOT NULL AND image_path != ''")
	if err != nil {
		return fmt.Errorf("failed to query course images: %w", err)
	}
	defer rows.Close()

	// Create a map of valid image paths
	validImages := make(map[string]bool)
	for rows.Next() {
		var imagePath string
		if err := rows.Scan(&imagePath); err != nil {
			log.Printf("Warning: Error scanning image path: %v", err)
			continue
		}
		// Convert URL path to filesystem path
		if strings.HasPrefix(imagePath, "/uploads/") {
			imagePath = "." + imagePath
		}
		validImages[filepath.Base(imagePath)] = true
	}

	// Delete files that are not in the database
	var deletedCount int
	for _, file := range files {
		if !validImages[file.Name()] {
			filePath := filepath.Join(uploadsDir, file.Name())
			if err := os.Remove(filePath); err != nil {
				log.Printf("Warning: Failed to delete orphaned file %s: %v", filePath, err)
			} else {
				log.Printf("Deleted orphaned file: %s", filePath)
				deletedCount++
			}
		}
	}

	if deletedCount > 0 {
		log.Printf("Cleanup completed: removed %d orphaned files", deletedCount)
	} else {
		log.Printf("No orphaned files found in uploads directory")
	}

	return nil
}