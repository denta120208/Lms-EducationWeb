import React, { useState } from 'react';
import { X, Upload, FileText, Image, Video, Youtube } from 'lucide-react';
import { api } from '../services/api';

interface CourseMaterialFormProps {
  courseId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const CourseMaterialForm: React.FC<CourseMaterialFormProps> = ({ courseId, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'image' | 'pdf' | 'video' | 'youtube'>('image');
  const [file, setFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const validateForm = () => {
    if (!title) {
      setError('Title is required');
      return false;
    }
    if (type === 'youtube' && !youtubeUrl) {
      setError('YouTube URL is required');
      return false;
    }
    if ((type === 'image' || type === 'pdf' || type === 'video') && !file) {
      setError('File is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      let materialData = {
        title,
        description,
        type,
        file_path: '',
        youtube_url: type === 'youtube' ? youtubeUrl : ''
      };

      // Upload file if provided
      if (file && type !== 'youtube') {
        try {
          const formData = new FormData();
          formData.append('file', file);
          
          const uploadResponse = await api.post('/api/upload/material', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          
          if (uploadResponse.data && uploadResponse.data.success && uploadResponse.data.file_path) {
            materialData.file_path = uploadResponse.data.file_path;
            console.log("File uploaded successfully, path:", uploadResponse.data.file_path);
          } else {
            throw new Error('File upload failed');
          }
        } catch (uploadErr) {
          console.error('File upload failed:', uploadErr);
          setError('Failed to upload file');
          return;
        }
      }
      
      // Create material
      const response = await api.post(`/api/courses/${courseId}/materials`, materialData);
    
      if (response.data.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.data.message || 'Failed to create material');
      }
    } catch (err: any) {
      console.error('Error creating material:', err);
      
      if (err.code === 'ERR_NETWORK') {
        setError('Network error: Please check if the backend server is running');
      } else if (err.response) {
        setError(`Server error: ${err.response.data?.message || err.response.statusText || 'Unknown error'}`);
      } else if (err.request) {
        setError('No response from server. Please check your backend connection.');
      } else {
        setError(`Error: ${err.message || 'Unknown error occurred'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getFileAccept = () => {
    switch (type) {
      case 'image':
        return 'image/jpeg,image/png,image/gif,image/webp';
      case 'pdf':
        return 'application/pdf';
      case 'video':
        return 'video/mp4,video/avi,video/mov,video/wmv,video/flv,video/webm';
      default:
        return '';
    }
  };

  const getMaxFileSize = () => {
    switch (type) {
      case 'image':
        return '15MB';
      case 'pdf':
        return '50MB';
      case 'video':
        return '50MB';
      default:
        return '';
    }
  };

  const getTypeIcon = (materialType: string) => {
    switch (materialType) {
      case 'image':
        return <Image size={20} />;
      case 'pdf':
        return <FileText size={20} />;
      case 'video':
        return <Video size={20} />;
      case 'youtube':
        return <Youtube size={20} />;
      default:
        return <FileText size={20} />;
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
          Add Course Material
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
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
              }}
              required
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
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                minHeight: '80px',
                resize: 'vertical',
              }}
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label 
              htmlFor="type"
              style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
              }}
            >
              Material Type *
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as 'image' | 'pdf' | 'video' | 'youtube')}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
              }}
              required
            >
              <option value="image">Image</option>
              <option value="pdf">PDF Document</option>
              <option value="video">Video File</option>
              <option value="youtube">YouTube Video</option>
            </select>
          </div>

          {type === 'youtube' ? (
            <div style={{ marginBottom: '20px' }}>
              <label 
                htmlFor="youtubeUrl"
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                }}
              >
                YouTube URL *
              </label>
              <input
                id="youtubeUrl"
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                }}
                required
              />
            </div>
          ) : (
            <div style={{ marginBottom: '20px' }}>
              <label 
                htmlFor="file"
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                }}
              >
                {type === 'image' ? 'Image File' : type === 'pdf' ? 'PDF File' : 'Video File'} *
              </label>
              
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: '2px dashed #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  width: '100%',
                  minHeight: '60px',
                  textAlign: 'center',
                }}
              >
                {getTypeIcon(type)}
                {file ? file.name : `Choose ${type} file`}
                <Upload size={16} />
                <input
                  id="file"
                  type="file"
                  accept={getFileAccept()}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  required
                />
              </label>
              <p style={{ margin: '8px 0 0 0', color: '#6b7280', fontSize: '12px' }}>
                Max size: {getMaxFileSize()}
              </p>
            </div>
          )}
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: '24px' 
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: '8px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? 'Adding...' : 'Add Material'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseMaterialForm;