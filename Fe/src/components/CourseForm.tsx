import React, { useState } from 'react';
import { X } from 'lucide-react';
import { api } from '../services/api';

interface CourseFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CourseForm: React.FC<CourseFormProps> = ({ onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!title || !subject) {
      setError('Title and subject are required');
      return;
    }

    setIsLoading(true);

    try {
      let courseData = {
        title,
        description,
        subject,
        grade,
        image_path: ''
      };

      // Upload image if provided
      if (file) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          
          const uploadResponse = await api.post('/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          
          if (uploadResponse.data && uploadResponse.data.success) {
            courseData.image_path = uploadResponse.data.filePath;
            console.log("Image uploaded successfully, path:", uploadResponse.data.filePath);
          } else {
            console.warn("Image upload response did not contain success flag or filePath", uploadResponse.data);
          }
        } catch (uploadErr) {
          console.error('Image upload failed, continuing without image:', uploadErr);
          // Continue without image if upload fails
        }
      }
      
      // Create course (with or without image)
      const response = await api.post('/teacher/courses', courseData);
    
      if (response.data.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.data.message || 'Failed to create course');
      }
    } catch (err: any) {
      console.error('Error creating course:', err);
      
      // Provide more specific error messages
      if (err.code === 'ERR_NETWORK') {
        setError('Network error: Please check if the backend server is running');
      } else if (err.response) {
        // The request was made and the server responded with a status code
        setError(`Server error: ${err.response.data?.message || err.response.statusText || 'Unknown error'}`);
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response from server. Please check your backend connection.');
      } else {
        // Something happened in setting up the request
        setError(`Error: ${err.message || 'Unknown error occurred'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative',
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          <X size={24} color="#374151" />
        </button>
        
        <h2 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#374151',
          marginBottom: '24px',
        }}>
          Create New Course
        </h2>
        
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '16px',
            fontSize: '14px',
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label 
              htmlFor="title"
              style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
              }}
            >
              Course Title*
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Mathematics 101"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label 
              htmlFor="subject"
              style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
              }}
            >
              Subject*
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Mathematics"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label 
              htmlFor="grade"
              style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
              }}
            >
              Grade Level
            </label>
            <input
              id="grade"
              type="text"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="e.g. 10th grade"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label 
              htmlFor="description"
              style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
              }}
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Course description..."
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                minHeight: '100px',
                resize: 'vertical',
              }}
            />
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label 
              htmlFor="image"
              style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
              }}
            >
              Course Image
            </label>
            
            {preview ? (
              <div style={{ marginBottom: '12px' }}>
                <img 
                  src={preview} 
                  alt="Preview" 
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    borderRadius: '6px',
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  style={{
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    marginTop: '8px',
                  }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div style={{
                border: '2px dashed #d1d5db',
                borderRadius: '6px',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
              }}
              onClick={() => document.getElementById('image')?.click()}
              >
                <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                  Click to upload an image
                </p>
              </div>
            )}
            
            <input
              id="image"
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 16px',
                backgroundColor: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
              }}
              disabled={isLoading}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              style={{
                padding: '10px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                opacity: isLoading ? 0.7 : 1,
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;