package main

import (
	"log"
	"os"
	"path/filepath"
)

// cleanupUploads removes all files from the uploads directory
func cleanupUploads() error {
	uploadsDir := "./uploads"
	
	// Check if directory exists
	if _, err := os.Stat(uploadsDir); os.IsNotExist(err) {
		log.Printf("Uploads directory does not exist, nothing to clean")
		return nil
	}

	// Remove all files in the directory
	err := filepath.Walk(uploadsDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		
		// Skip the directory itself
		if path == uploadsDir {
			return nil
		}
		
		// Remove the file or directory
		if err := os.Remove(path); err != nil {
			log.Printf("Error removing %s: %v", path, err)
			return err
		}
		
		log.Printf("Removed: %s", path)
		return nil
	})

	if err != nil {
		log.Printf("Error cleaning uploads directory: %v", err)
		return err
	}

	log.Printf("Successfully cleaned uploads directory")
	return nil
}