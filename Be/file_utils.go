package main

import (
	"log"
	"os"
	"strings"
)

// deleteFile removes a file given its URL path
func deleteFile(urlPath string) error {
	// Convert URL path to filesystem path
	// Example: /uploads/123_image.jpg -> ./uploads/123_image.jpg
	if urlPath == "" {
		return nil
	}

	// Remove leading slash and convert to local path
	localPath := "." + urlPath
	
	// Ensure the path is within uploads directory
	if !strings.HasPrefix(localPath, "./uploads/") {
		log.Printf("Attempted to delete file outside uploads directory: %s", localPath)
		return nil
	}

	// Check if file exists
	if _, err := os.Stat(localPath); os.IsNotExist(err) {
		log.Printf("File does not exist: %s", localPath)
		return nil
	}

	// Delete the file
	err := os.Remove(localPath)
	if err != nil {
		log.Printf("Error deleting file %s: %v", localPath, err)
		return err
	}

	log.Printf("Successfully deleted file: %s", localPath)
	return nil
}