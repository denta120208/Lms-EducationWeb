import React, { useState, useEffect } from 'react';
import { Plus, FileText, Clock, Users, Edit, Trash2, Download, Upload, CheckCircle, BarChart3 } from 'lucide-react';
import { api } from '../services/api';
import QuizResults from './QuizResults';

interface Quiz {
  id: number;
  title: string;
  description: string;
  course_id: number;
  quiz_type: 'interactive' | 'pdf';
  pdf_file_path?: string;
  time_limit?: number;
  total_points: number;
  is_active: boolean;
  due_date?: string;
  created_at: string;
  updated_at: string;
  questions?: Question[];
}

interface Question {
  id: number;
  quiz_id: number;
  question_type: 'multiple_choice' | 'essay';
  points: number;
  question: string;
  option_a?: string;
  option_b?: string;
  option_c?: string;
  option_d?: string;
  correct_answer?: string;
  essay_answer_key?: string;
  created_at: string;
}

interface QuizManagementProps {
  courseId: number;
}

const QuizManagement: React.FC<QuizManagementProps> = ({ courseId }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedQuizForResults, setSelectedQuizForResults] = useState<Quiz | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuizzes();
  }, [courseId]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/courses/${courseId}/quizzes`);
      setQuizzes(response.data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching quizzes:', err);
      setError('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    fetchQuizzes();
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setEditingQuiz(quiz);
  };

  const handleQuizUpdated = () => {
    setEditingQuiz(null);
    fetchQuizzes();
  };

  const handleDeleteQuiz = async (quizId: number) => {
    if (!window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/api/quizzes/${quizId}`);
      fetchQuizzes();
    } catch (err: any) {
      console.error('Error deleting quiz:', err);
      setError('Failed to delete quiz');
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px',
        color: '#6b7280'
      }}>
        Loading quizzes...
      </div>
    );
  }

  if (selectedQuizForResults) {
    return (
      <QuizResults
        quizId={selectedQuizForResults.id}
        quizTitle={selectedQuizForResults.title}
        onBack={() => setSelectedQuizForResults(null)}
      />
    );
  }

  if (editingQuiz) {
    return (
      <QuizForm
        courseId={courseId}
        quiz={editingQuiz}
        onSuccess={handleQuizUpdated}
        onCancel={() => setEditingQuiz(null)}
      />
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px' 
      }}>
        <h3 style={{ margin: 0, color: '#1f2937', fontSize: '18px', fontWeight: '600' }}>
          Course Quizzes
        </h3>
        <button
          onClick={() => setShowCreateForm(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          <Plus size={16} />
          Create Quiz
        </button>
      </div>

      {error && (
        <div style={{
          padding: '12px',
          backgroundColor: '#fee2e2',
          border: '1px solid #fca5a5',
          borderRadius: '6px',
          color: '#dc2626',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {showCreateForm && (
        <QuizForm
          courseId={courseId}
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {quizzes.length === 0 ? (
        <div style={{
          textAlign: 'center' as const,
          padding: '40px',
          color: '#6b7280'
        }}>
          <FileText size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <p style={{ margin: 0, fontSize: '16px' }}>No quizzes created yet</p>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
            Create your first quiz to get started
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {quizzes.map((quiz) => (
            <QuizCard 
              key={quiz.id} 
              quiz={quiz} 
              onUpdate={fetchQuizzes}
              onViewResults={() => setSelectedQuizForResults(quiz)}
              onEdit={() => handleEditQuiz(quiz)}
              onDelete={() => handleDeleteQuiz(quiz.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Quiz Card Component
const QuizCard: React.FC<{ 
  quiz: Quiz; 
  onUpdate: () => void; 
  onViewResults: () => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ quiz, onUpdate, onViewResults, onEdit, onDelete }) => {
  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px',
      backgroundColor: 'white'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <h4 style={{ margin: 0, color: '#1f2937', fontSize: '16px', fontWeight: '600' }}>
              {quiz.title}
            </h4>
            <span style={{
              padding: '2px 8px',
              backgroundColor: quiz.quiz_type === 'interactive' ? '#dbeafe' : '#fef3c7',
              color: quiz.quiz_type === 'interactive' ? '#1e40af' : '#92400e',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {quiz.quiz_type === 'interactive' ? 'Interactive' : 'PDF'}
            </span>
          </div>
          
          {quiz.description && (
            <p style={{ margin: '0 0 12px 0', color: '#6b7280', fontSize: '14px' }}>
              {quiz.description}
            </p>
          )}

          <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#6b7280' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle size={14} />
              {quiz.total_points} points
            </div>
            {quiz.time_limit && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} />
                {quiz.time_limit} minutes
              </div>
            )}
            {quiz.due_date && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Users size={14} />
                Due: {new Date(quiz.due_date).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onViewResults}
            style={{
              padding: '6px',
              backgroundColor: '#ede9fe',
              border: '1px solid #c4b5fd',
              borderRadius: '4px',
              cursor: 'pointer',
              color: '#7c3aed'
            }}
            title="View Results"
          >
            <BarChart3 size={16} />
          </button>
          {quiz.quiz_type === 'pdf' && quiz.pdf_file_path && (
            <button
              onClick={() => window.open(`http://localhost:8080${quiz.pdf_file_path}`, '_blank')}
              style={{
                padding: '6px',
                backgroundColor: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                cursor: 'pointer',
                color: '#374151'
              }}
              title="Download PDF"
            >
              <Download size={16} />
            </button>
          )}
          <button
            onClick={onEdit}
            style={{
              padding: '6px',
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              cursor: 'pointer',
              color: '#374151'
            }}
            title="Edit Quiz"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={onDelete}
            style={{
              padding: '6px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '4px',
              cursor: 'pointer',
              color: '#dc2626'
            }}
            title="Delete Quiz"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Quiz Form Component (Create/Edit)
const QuizForm: React.FC<{
  courseId: number;
  quiz?: Quiz | null;
  onSuccess: () => void;
  onCancel: () => void;
}> = ({ courseId, quiz, onSuccess, onCancel }) => {
  const isEditing = !!quiz;
  const [formData, setFormData] = useState({
    title: quiz?.title || '',
    description: quiz?.description || '',
    quiz_type: (quiz?.quiz_type as 'interactive' | 'pdf') || 'interactive',
    time_limit: quiz?.time_limit?.toString() || '',
    total_points: quiz?.total_points?.toString() || '100',
    due_date: quiz?.due_date ? new Date(quiz.due_date).toISOString().slice(0, 16) : ''
  });
  const [questions, setQuestions] = useState<any[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load quiz questions if editing
  useEffect(() => {
    if (isEditing && quiz && quiz.quiz_type === 'interactive') {
      const loadQuestions = async () => {
        try {
          const response = await api.get(`/api/quizzes/${quiz.id}`);
          if (response.data.questions) {
            setQuestions(response.data.questions);
          }
        } catch (err) {
          console.error('Error loading quiz questions:', err);
        }
      };
      loadQuestions();
    }
  }, [isEditing, quiz]);

  const addQuestion = () => {
    setQuestions([...questions, {
      question_type: 'multiple_choice',
      points: 10,
      question: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_answer: 'A'
    }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let pdfFilePath = '';
      
      // Upload PDF if quiz type is PDF and file is selected
      if (formData.quiz_type === 'pdf' && pdfFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', pdfFile);
        
        const uploadResponse = await api.post('/api/upload/quiz-pdf', formDataUpload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        pdfFilePath = uploadResponse.data.file_path;
      }

      // Create or update quiz
      const quizData = {
        title: formData.title,
        description: formData.description,
        course_id: courseId,
        quiz_type: formData.quiz_type,
        time_limit: formData.time_limit ? parseInt(formData.time_limit) : null,
        total_points: parseInt(formData.total_points),
        due_date: formData.due_date || null,
        pdf_file_path: pdfFilePath,
        is_active: true,
        questions: formData.quiz_type === 'interactive' ? questions : []
      };

      if (isEditing && quiz) {
        await api.put(`/api/quizzes/${quiz.id}`, quizData);
      } else {
        await api.post(`/api/courses/${courseId}/quizzes`, quizData);
      }
      onSuccess();
    } catch (err: any) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} quiz:`, err);
      setError(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} quiz`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '20px',
      backgroundColor: 'white',
      marginBottom: '20px'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px' 
      }}>
        <h4 style={{ margin: 0, color: '#1f2937', fontSize: '16px', fontWeight: '600' }}>
          {isEditing ? 'Edit Quiz' : 'Create New Quiz'}
        </h4>
        <button
          onClick={onCancel}
          style={{
            padding: '6px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#6b7280'
          }}
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: '16px' }}>
          {/* Quiz Title */}
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              Quiz Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
              placeholder="Enter quiz title"
              required
            />
          </div>

          {/* Quiz Description */}
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                resize: 'vertical' as const,
                minHeight: '80px'
              }}
              placeholder="Enter quiz description"
            />
          </div>

          {/* Quiz Type */}
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              Quiz Type *
            </label>
            <div style={{ display: 'flex', gap: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="quiz_type"
                  value="interactive"
                  checked={formData.quiz_type === 'interactive'}
                  onChange={(e) => setFormData({ ...formData, quiz_type: e.target.value as 'interactive' | 'pdf' })}
                />
                <span style={{ fontSize: '14px' }}>Interactive Quiz (Multiple Choice/Essay)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="quiz_type"
                  value="pdf"
                  checked={formData.quiz_type === 'pdf'}
                  onChange={(e) => setFormData({ ...formData, quiz_type: e.target.value as 'interactive' | 'pdf' })}
                />
                <span style={{ fontSize: '14px' }}>PDF Quiz (File Upload)</span>
              </label>
            </div>
          </div>

          {/* PDF Upload (only for PDF quiz type) */}
          {formData.quiz_type === 'pdf' && (
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Upload PDF File *
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                required={formData.quiz_type === 'pdf'}
              />
            </div>
          )}

          {/* Quiz Settings */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Time Limit (minutes)
              </label>
              <input
                type="number"
                value={formData.time_limit}
                onChange={(e) => setFormData({ ...formData, time_limit: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                placeholder="No limit"
                min="1"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Total Points *
              </label>
              <input
                type="number"
                value={formData.total_points}
                onChange={(e) => setFormData({ ...formData, total_points: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                required
                min="1"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                Due Date
              </label>
              <input
                type="datetime-local"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          {/* Questions (only for interactive quiz) */}
          {formData.quiz_type === 'interactive' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  Questions
                </label>
                <button
                  type="button"
                  onClick={addQuestion}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  <Plus size={14} />
                  Add Question
                </button>
              </div>

              {questions.map((question, index) => (
                <QuestionForm
                  key={index}
                  question={question}
                  index={index}
                  onUpdate={updateQuestion}
                  onRemove={removeQuestion}
                />
              ))}
            </div>
          )}

          {error && (
            <div style={{
              padding: '12px',
              backgroundColor: '#fee2e2',
              border: '1px solid #fca5a5',
              borderRadius: '6px',
              color: '#dc2626',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          {/* Submit Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: '8px 16px',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '8px 16px',
                backgroundColor: loading ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Quiz' : 'Create Quiz')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

// Question Form Component
const QuestionForm: React.FC<{
  question: any;
  index: number;
  onUpdate: (index: number, field: string, value: any) => void;
  onRemove: (index: number) => void;
}> = ({ question, index, onUpdate, onRemove }) => {
  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '6px',
      padding: '16px',
      marginBottom: '12px',
      backgroundColor: '#f9fafb'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h5 style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: '#374151' }}>
          Question {index + 1}
        </h5>
        <button
          type="button"
          onClick={() => onRemove(index)}
          style={{
            padding: '4px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#dc2626'
          }}
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div style={{ display: 'grid', gap: '12px' }}>
        {/* Question Type and Points */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', color: '#6b7280' }}>
              Question Type
            </label>
            <select
              value={question.question_type}
              onChange={(e) => onUpdate(index, 'question_type', e.target.value)}
              style={{
                width: '100%',
                padding: '6px 8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            >
              <option value="multiple_choice">Multiple Choice</option>
              <option value="essay">Essay</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', color: '#6b7280' }}>
              Points
            </label>
            <input
              type="number"
              value={question.points}
              onChange={(e) => onUpdate(index, 'points', parseInt(e.target.value))}
              style={{
                width: '100%',
                padding: '6px 8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '12px'
              }}
              min="1"
            />
          </div>
        </div>

        {/* Question Text */}
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', color: '#6b7280' }}>
            Question *
          </label>
          <textarea
            value={question.question}
            onChange={(e) => onUpdate(index, 'question', e.target.value)}
            style={{
              width: '100%',
              padding: '6px 8px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '12px',
              resize: 'vertical' as const,
              minHeight: '60px'
            }}
            placeholder="Enter your question here"
            required
          />
        </div>

        {/* Multiple Choice Options */}
        {question.question_type === 'multiple_choice' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', color: '#6b7280' }}>
                  Option A
                </label>
                <input
                  type="text"
                  value={question.option_a}
                  onChange={(e) => onUpdate(index, 'option_a', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                  placeholder="Option A"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', color: '#6b7280' }}>
                  Option B
                </label>
                <input
                  type="text"
                  value={question.option_b}
                  onChange={(e) => onUpdate(index, 'option_b', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                  placeholder="Option B"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', color: '#6b7280' }}>
                  Option C
                </label>
                <input
                  type="text"
                  value={question.option_c}
                  onChange={(e) => onUpdate(index, 'option_c', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                  placeholder="Option C"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', color: '#6b7280' }}>
                  Option D
                </label>
                <input
                  type="text"
                  value={question.option_d}
                  onChange={(e) => onUpdate(index, 'option_d', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                  placeholder="Option D"
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', color: '#6b7280' }}>
                Correct Answer
              </label>
              <select
                value={question.correct_answer}
                onChange={(e) => onUpdate(index, 'correct_answer', e.target.value)}
                style={{
                  width: '200px',
                  padding: '6px 8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>
          </>
        )}

        {/* Essay Answer Key */}
        {question.question_type === 'essay' && (
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', color: '#6b7280' }}>
              Answer Key / Sample Answer
            </label>
            <textarea
              value={question.essay_answer_key}
              onChange={(e) => onUpdate(index, 'essay_answer_key', e.target.value)}
              style={{
                width: '100%',
                padding: '6px 8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '12px',
                resize: 'vertical' as const,
                minHeight: '60px'
              }}
              placeholder="Enter answer key or sample answer for grading reference"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizManagement;
