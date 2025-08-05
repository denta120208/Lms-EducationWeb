import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (courseData: CourseData) => void;
  course?: CourseData | null;
  isLoading?: boolean;
}

export interface CourseData {
  id?: number;
  title: string;
  subject: string;
  description: string;
}

const CourseModal: React.FC<CourseModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  course = null,
  isLoading = false 
}) => {
  const [formData, setFormData] = useState<CourseData>({
    title: '',
    subject: '',
    description: ''
  });

  useEffect(() => {
    if (course) {
      setFormData({
        id: course.id,
        title: course.title || '',
        subject: course.subject || '',
        description: course.description || ''
      });
    } else {
      setFormData({
        title: '',
        subject: '',
        description: ''
      });
    }
  }, [course, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  const modalStyles = {
    overlay: {
      position: 'fixed' as 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '8px',
      width: '90%',
      maxWidth: '500px',
      padding: '24px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      position: 'relative' as 'relative'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    title: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#374151',
      margin: 0
    },
    closeButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as 'column',
      gap: '16px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column' as 'column',
      gap: '4px'
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151'
    },
    input: {
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s'
    },
    textarea: {
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s',
      minHeight: '100px',
      resize: 'vertical' as 'vertical'
    },
    select: {
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s',
      backgroundColor: 'white'
    },
    footer: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px',
      marginTop: '24px'
    },
    cancelButton: {
      padding: '8px 16px',
      backgroundColor: '#f3f4f6',
      color: '#374151',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'background-color 0.2s'
    },
    submitButton: {
      padding: '8px 16px',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'background-color 0.2s'
    },
    loadingButton: {
      padding: '8px 16px',
      backgroundColor: '#93c5fd',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'not-allowed',
      fontSize: '14px'
    }
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <div style={modalStyles.header}>
          <h3 style={modalStyles.title}>{course ? 'Edit Course' : 'Add New Course'}</h3>
          <button 
            style={modalStyles.closeButton}
            onClick={onClose}
            type="button"
          >
            <X size={20} color="#6b7280" />
          </button>
        </div>

        <form style={modalStyles.form} onSubmit={handleSubmit}>
          <div style={modalStyles.formGroup}>
            <label style={modalStyles.label} htmlFor="title">Course Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              style={modalStyles.input}
              placeholder="e.g. Mathematics"
              required
            />
          </div>

          <div style={modalStyles.formGroup}>
            <label style={modalStyles.label} htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              style={modalStyles.input}
              placeholder="e.g. Mathematics"
              required
            />
          </div>

          <div style={modalStyles.formGroup}>
            <label style={modalStyles.label} htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              style={modalStyles.textarea}
              placeholder="Course description..."
            />
          </div>

          <div style={modalStyles.footer}>
            <button
              type="button"
              onClick={onClose}
              style={modalStyles.cancelButton}
              onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#e5e7eb'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#f3f4f6'}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={isLoading ? modalStyles.loadingButton : modalStyles.submitButton}
              onMouseEnter={!isLoading ? (e) => (e.target as HTMLElement).style.backgroundColor = '#2563eb' : undefined}
              onMouseLeave={!isLoading ? (e) => (e.target as HTMLElement).style.backgroundColor = '#3b82f6' : undefined}
            >
              {isLoading ? 'Saving...' : (course ? 'Update Course' : 'Create Course')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseModal;