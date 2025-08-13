import React, { useState } from 'react';
import { X, BookOpen, Brain } from 'lucide-react';
import CourseMaterialsList from './CourseMaterialsList';
import QuizStudentView from './QuizStudentView';

interface CourseViewModalProps {
  course: {
    id: number;
    title: string;
    description: string;
    image_path: string;
    teacher_name: string;
    subject: string;
  };
  onClose: () => void;
}

const CourseViewModal: React.FC<CourseViewModalProps> = ({ course, onClose }) => {
  const [activeTab, setActiveTab] = useState<'materials' | 'quiz'>('materials');

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
        width: '95%',
        maxWidth: '800px',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <BookOpen size={24} color="#3b82f6" />
            <div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#374151',
                margin: 0,
              }}>
                {course.title}
              </h2>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: '4px 0 0 0'
              }}>
                by {course.teacher_name} • {course.subject}
              </p>
            </div>
          </div>
          
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

        {/* Course Description */}
        {course.description && (
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#374151',
              margin: '0 0 8px 0'
            }}>
              About this course
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: 0,
              lineHeight: '1.5'
            }}>
              {course.description}
            </p>
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          backgroundColor: '#f9fafb',
          borderBottom: '1px solid #e5e7eb'
        }}>
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
          <button
            onClick={() => setActiveTab('quiz')}
            style={{
              padding: '12px 24px',
              border: 'none',
              backgroundColor: activeTab === 'quiz' ? 'white' : 'transparent',
              color: activeTab === 'quiz' ? '#3b82f6' : '#6b7280',
              borderBottom: activeTab === 'quiz' ? '2px solid #3b82f6' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Brain size={16} />
            Quiz
          </button>
        </div>

        {/* Tab Content */}
        <div style={{
          flex: 1,
          overflow: 'auto'
        }}>
          {activeTab === 'materials' && (
            <div style={{ padding: '24px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#374151',
                margin: '0 0 20px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <BookOpen size={20} />
                Course Materials
              </h3>
              
              <CourseMaterialsList 
                courseId={course.id} 
                isTeacher={false}
              />
            </div>
          )}

          {activeTab === 'quiz' && (
            <QuizStudentView courseId={course.id} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseViewModal;