import React, { useState, useEffect } from 'react';
import { Clock, FileText, Download, Upload, CheckCircle, AlertCircle, Brain, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

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
  created_at: string;
}

interface QuizStudentViewProps {
  courseId: number;
}

const QuizStudentView: React.FC<QuizStudentViewProps> = ({ courseId }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
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

  const handleQuizSelect = async (quiz: Quiz) => {
    if (quiz.quiz_type === 'interactive') {
      try {
        const response = await api.get(`/api/quizzes/${quiz.id}`);
        setSelectedQuiz(response.data);
      } catch (err) {
        console.error('Error loading quiz details:', err);
        setError('Failed to load quiz details');
      }
    } else {
      setSelectedQuiz(quiz);
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

  if (selectedQuiz) {
    return (
      <QuizTaking 
        quiz={selectedQuiz} 
        onBack={() => setSelectedQuiz(null)}
        onSubmit={() => setSelectedQuiz(null)}
      />
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: 0, color: '#1f2937', fontSize: '18px', fontWeight: '600' }}>
          Available Quizzes
        </h3>
        <p style={{ margin: '8px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
          Click on a quiz to start taking it
        </p>
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

      {quizzes.length === 0 ? (
        <div style={{
          textAlign: 'center' as const,
          padding: '40px',
          color: '#6b7280'
        }}>
          <Brain size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <p style={{ margin: 0, fontSize: '16px' }}>No quizzes available</p>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
            Your teacher hasn't created any quizzes yet
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {quizzes.map((quiz) => (
            <QuizStudentCard 
              key={quiz.id} 
              quiz={quiz} 
              onSelect={() => handleQuizSelect(quiz)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Quiz Card for Students
const QuizStudentCard: React.FC<{ quiz: Quiz; onSelect: () => void }> = ({ quiz, onSelect }) => {
  const isOverdue = quiz.due_date && new Date(quiz.due_date) < new Date();
  
  return (
    <div 
      onClick={!isOverdue ? onSelect : undefined}
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
        backgroundColor: 'white',
        cursor: !isOverdue ? 'pointer' : 'not-allowed',
        opacity: isOverdue ? 0.6 : 1,
        transition: 'all 0.2s ease',
        boxShadow: !isOverdue ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none'
      }}
      onMouseEnter={(e) => {
        if (!isOverdue) {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isOverdue) {
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
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
            {isOverdue && (
              <span style={{
                padding: '2px 8px',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                Overdue
              </span>
            )}
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
                <AlertCircle size={14} />
                Due: {new Date(quiz.due_date).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        {!isOverdue && (
          <div style={{ display: 'flex', alignItems: 'center', color: '#3b82f6' }}>
            <ArrowRight size={20} />
          </div>
        )}
      </div>
    </div>
  );
};

// Quiz Taking Component
const QuizTaking: React.FC<{
  quiz: Quiz;
  onBack: () => void;
  onSubmit: () => void;
}> = ({ quiz, onBack, onSubmit }) => {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (quiz.time_limit) {
      setTimeRemaining(quiz.time_limit * 60); // Convert to seconds
    }
  }, [quiz.time_limit]);

  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleSubmit(); // Auto-submit when time runs out
    }
  }, [timeRemaining]);

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);

      if (quiz.quiz_type === 'pdf') {
        if (!uploadedFile) {
          setError('Please upload your answer file');
          return;
        }

        // Upload the answer file
        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('quiz_id', quiz.id.toString());
        
        // Note: You'll need to implement this endpoint
        await api.post('/api/quiz-submissions/pdf', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Submit interactive quiz answers
        const submission = {
          quiz_id: quiz.id,
          answers: answers
        };
        
        // Note: You'll need to implement this endpoint
        await api.post('/api/quiz-submissions', submission);
      }

      onSubmit();
    } catch (err: any) {
      console.error('Error submitting quiz:', err);
      setError('Failed to submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div>
          <h2 style={{ margin: 0, color: '#1f2937', fontSize: '20px', fontWeight: '600' }}>
            {quiz.title}
          </h2>
          {quiz.description && (
            <p style={{ margin: '8px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
              {quiz.description}
            </p>
          )}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {timeRemaining !== null && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              backgroundColor: timeRemaining < 300 ? '#fee2e2' : '#f3f4f6', // Red if less than 5 minutes
              color: timeRemaining < 300 ? '#dc2626' : '#374151',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              <Clock size={16} />
              {formatTime(timeRemaining)}
            </div>
          )}
          
          <button
            onClick={onBack}
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
            Back
          </button>
        </div>
      </div>

      {/* Quiz Content */}
      {quiz.quiz_type === 'pdf' ? (
        <div>
          {/* PDF Download */}
          {quiz.pdf_file_path && (
            <div style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '20px',
              backgroundColor: '#f9fafb'
            }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: '#374151' }}>
                Quiz File
              </h3>
              <p style={{ margin: '0 0 16px 0', color: '#6b7280', fontSize: '14px' }}>
                Download the quiz PDF, complete it, and upload your answers below.
              </p>
              <button
                onClick={() => window.open(`http://localhost:8080${quiz.pdf_file_path}`, '_blank')}
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
                <Download size={16} />
                Download Quiz PDF
              </button>
            </div>
          )}

          {/* Answer Upload */}
          <div style={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: 'white'
          }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: '#374151' }}>
              Upload Your Answers
            </h3>
            <p style={{ margin: '0 0 16px 0', color: '#6b7280', fontSize: '14px' }}>
              Upload an image or PDF file with your completed answers.
            </p>
            
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                marginBottom: '16px'
              }}
            />
            
            {uploadedFile && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                backgroundColor: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#0369a1'
              }}>
                <FileText size={16} />
                {uploadedFile.name}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          {/* Interactive Quiz Questions */}
          {quiz.questions?.map((question, index) => (
            <div 
              key={question.id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '16px',
                backgroundColor: 'white'
              }}
            >
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ 
                  margin: '0 0 8px 0', 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#374151' 
                }}>
                  Question {index + 1} ({question.points} points)
                </h3>
                <p style={{ margin: 0, color: '#1f2937', fontSize: '14px', lineHeight: '1.5' }}>
                  {question.question}
                </p>
              </div>

              {question.question_type === 'multiple_choice' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {['A', 'B', 'C', 'D'].map((option) => {
                    const optionText = question[`option_${option.toLowerCase()}` as keyof Question] as string;
                    if (!optionText) return null;
                    
                    return (
                      <label 
                        key={option}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '12px', 
                          cursor: 'pointer',
                          padding: '8px',
                          borderRadius: '6px',
                          backgroundColor: answers[question.id] === option ? '#f0f9ff' : 'transparent',
                          border: answers[question.id] === option ? '1px solid #3b82f6' : '1px solid transparent'
                        }}
                      >
                        <input
                          type="radio"
                          name={`question_${question.id}`}
                          value={option}
                          checked={answers[question.id] === option}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          style={{ margin: 0 }}
                        />
                        <span style={{ fontSize: '14px', color: '#374151' }}>
                          {option}. {optionText}
                        </span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <textarea
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  placeholder="Type your answer here..."
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    resize: 'vertical' as const,
                    fontFamily: 'inherit'
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{
          padding: '12px',
          backgroundColor: '#fee2e2',
          border: '1px solid #fca5a5',
          borderRadius: '6px',
          color: '#dc2626',
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      {/* Submit Button */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        paddingTop: '20px',
        borderTop: '1px solid #e5e7eb'
      }}>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            padding: '12px 32px',
            backgroundColor: submitting ? '#9ca3af' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: submitting ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          {submitting ? 'Submitting...' : 'Submit Quiz'}
        </button>
      </div>
    </div>
  );
};

export default QuizStudentView;
