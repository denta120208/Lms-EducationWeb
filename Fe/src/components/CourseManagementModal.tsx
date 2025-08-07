import React, { useState } from 'react';
import { X, Upload, Plus, BookOpen, Settings } from 'lucide-react';
import { api } from '../services/api';
import CourseMaterialForm from './CourseMaterialForm';
import CourseMaterialsList from './CourseMaterialsList';

interface CourseManagementModalProps {
  course: {
    id: number;
    title: string;
    description: string;
    image_path: string;
    subject: string;
  };
  onClose: () => void;
  onSuccess: () => void;
  onDelete?: () => void;
}

const CourseManagementModal: React.FC<CourseManagementModalProps> = ({ 
  course, 
  onClose, 
  onSuccess, 
  onDelete 
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'materials'>('details');
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [materialsKey, setMaterialsKey] = useState(0);

  // Course details form state
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description || '');
  const [subject, setSubject] = useState(course.subject);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    course.image_path ? `http://localhost:8080${course.image_path}` : null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const validateForm = () => {
    if (!title) {
      setError('Title is required');
      return false;
    }
    if (!subject) {
      setError('Subject is required');
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
      let courseData = {
        title,
        description,
        subject,
        image_path: course.image_path // Keep existing image path by default
      };

      // Upload image if provided
      if (file) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          
          const uploadResponse = await api.post('/api/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          
          if (uploadResponse.data && uploadResponse.data.success && uploadResponse.data.file_path) {
            courseData.image_path = uploadResponse.data.file_path;
            console.log("Image uploaded successfully, path:", uploadResponse.data.file_path);
          } else {
            console.warn("Image upload response did not contain success flag or file_path", uploadResponse.data);
          }
        } catch (uploadErr) {
          console.error('Image upload failed, continuing with existing image:', uploadErr);
        }
      }
      
      // Update course
      const response = await api.put(`/api/teacher/courses/${course.id}`, courseData);
    
      if (response.data.success) {
        onSuccess();
        // Don't close modal, just show success message
        setError(null);
        alert('Course updated successfully!');
      } else {
        setError(response.data.message || 'Failed to update course');
      }
    } catch (err: any) {
      console.error('Error updating course:', err);
      
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

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await api.delete(`/api/teacher/courses/${course.id}`);
      
      if (response.data.success) {
        if (onDelete) {
          onDelete();
        }
        onSuccess();
        onClose();
      } else {
        setError(response.data.message || 'Failed to delete course');
      }
    } catch (err: any) {
      console.error('Error deleting course:', err);
      
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
      setIsDeleting(false);
    }
  };

  const handleMaterialSuccess = () => {
    setShowMaterialForm(false);
    setMaterialsKey(prev => prev + 1); // Force refresh materials list
  };

  return (
    <>
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
          width: '95%',
          maxWidth: '900px',
          maxHeight: '90vh',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            padding: '24px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#374151',
              margin: 0,
            }}>
              Manage Course: {course.title}
            </h2>
            
            <button 
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <X size={24} color="#374151" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb'
          }}>
            <button
              onClick={() => setActiveTab('details')}
              style={{
                padding: '12px 24px',
                border: 'none',
                backgroundColor: activeTab === 'details' ? 'white' : 'transparent',
                color: activeTab === 'details' ? '#3b82f6' : '#6b7280',
                borderBottom: activeTab === 'details' ? '2px solid #3b82f6' : '2px solid transparent',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Settings size={16} />
              Course Details
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              style={{
                padding: '12px 24px',
                border: 'none',
                backgroundColor: activeTab === 'materials' ? 'white' : 'transparent',
                color: activeTab === 'materials' ? '#3b82f6' : '#6b7280',
                borderBottom: activeTab === 'materials' ? '2px solid #3b82f6' : '2px solid transparent',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <BookOpen size={16} />
              Materials
            </button>
          </div>

          {/* Tab Content */}
          <div style={{
            flex: 1,
            overflow: 'auto',
            padding: '24px'
          }}>
            {activeTab === 'details' && (
              <div>
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
                        minHeight: '100px',
                        resize: 'vertical',
                      }}
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
                      Subject *
                    </label>
                    <input
                      id="subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
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
                  
                  <div style={{ marginBottom: '20px' }}>
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
                    
                    {previewUrl && (
                      <div style={{ marginBottom: '12px' }}>
                        <img 
                          src={previewUrl} 
                          alt="Course preview" 
                          style={{
                            width: '100%',
                            maxHeight: '200px',
                            objectFit: 'cover',
                            borderRadius: '6px',
                          }}
                        />
                      </div>
                    )}
                    
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        width: 'fit-content',
                      }}
                    >
                      <Upload size={16} />
                      {previewUrl ? 'Change Image' : 'Upload Image'}
                      <input
                        id="image"
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                      />
                    </label>
                    <p style={{ margin: '8px 0 0 0', color: '#6b7280', fontSize: '12px' }}>
                      Supported formats: JPG, PNG, GIF, WEBP. Max size: 15MB
                    </p>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginTop: '24px' 
                  }}>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isLoading || isDeleting}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: isDeleting ? 'not-allowed' : 'pointer',
                        opacity: isDeleting ? 0.7 : 1,
                      }}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete Course'}
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
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'materials' && (
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#374151',
                    margin: 0
                  }}>
                    Course Materials
                  </h3>
                  
                  <button
                    onClick={() => setShowMaterialForm(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                    }}
                  >
                    <Plus size={16} />
                    Add Material
                  </button>
                </div>
                
                <CourseMaterialsList 
                  key={materialsKey}
                  courseId={course.id} 
                  isTeacher={true}
                  onRefresh={() => setMaterialsKey(prev => prev + 1)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Material Form Modal */}
      {showMaterialForm && (
        <CourseMaterialForm
          courseId={course.id}
          onClose={() => setShowMaterialForm(false)}
          onSuccess={handleMaterialSuccess}
        />
      )}
    </>
  );
};

export default CourseManagementModal;