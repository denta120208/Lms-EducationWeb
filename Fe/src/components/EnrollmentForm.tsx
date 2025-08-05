import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { api } from '../services/api';

interface Student {
  id: number;
  name: string;
  email: string;
  is_enrolled: boolean;
}

interface EnrollmentFormProps {
  courseId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ courseId, onClose, onSuccess }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadStudents();
  }, [courseId]);

  const loadStudents = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/teacher/courses/${courseId}/students`);
      if (response.data && response.data.students) {
        setStudents(response.data.students);
        // Set initially selected students
        const initialSelected = response.data.students
          .filter((student: Student) => student.is_enrolled)
          .map((student: Student) => student.id);
        setSelectedStudents(initialSelected);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load students');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await api.put(`/teacher/courses/${courseId}/enrollments`, {
        student_ids: selectedStudents
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update enrollments');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStudent = (studentId: number) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        maxWidth: '600px',
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
          Manage Students
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

        <div style={{ marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              fontSize: '14px',
            }}
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            maxHeight: '400px',
            overflow: 'auto',
            marginBottom: '20px',
          }}>
            {isLoading ? (
              <div style={{
                padding: '20px',
                textAlign: 'center',
                color: '#6b7280',
              }}>
                Loading students...
              </div>
            ) : filteredStudents.length === 0 ? (
              <div style={{
                padding: '20px',
                textAlign: 'center',
                color: '#6b7280',
              }}>
                No students found
              </div>
            ) : (
              filteredStudents.map(student => (
                <div
                  key={student.id}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    backgroundColor: selectedStudents.includes(student.id) ? '#f3f4f6' : 'white',
                  }}
                  onClick={() => toggleStudent(student.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => toggleStudent(student.id)}
                    style={{ cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                    }}>
                      {student.name}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#6b7280',
                    }}>
                      {student.email}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
            }}>
              {selectedStudents.length} students selected
            </div>
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
    </div>
  );
};

export default EnrollmentForm;