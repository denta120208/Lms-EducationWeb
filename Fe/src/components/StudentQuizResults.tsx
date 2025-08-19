import React, { useState, useEffect } from 'react';
import { Award, Clock, FileText, Eye, CheckCircle, XCircle, AlertCircle, MessageSquare } from 'lucide-react';
import { api } from '../services/api';

interface QuizResult {
  submission_id: number;
  quiz_id: number;
  quiz_title: string;
  course_name: string;
  score?: number;
  total_points: number;
  percentage?: number;
  is_graded: boolean;
  submitted_at: string;
  graded_at?: string;
  feedback?: string;
}

interface QuizDetail {
  submission_id: number;
  quiz_id: number;
  quiz_title: string;
  score?: number;
  total_points: number;
  percentage?: number;
  is_graded: boolean;
  submitted_at: string;
  graded_at?: string;
  feedback?: string;
  question_details: QuestionDetail[];
}

interface QuestionDetail {
  question_id: number;
  question_text: string;
  question_type: string;
  points: number;
  student_answer: string;
  correct_answer?: string;
  is_correct?: boolean;
  points_awarded?: number;
  options?: { [key: string]: string };
}

const StudentQuizResults: React.FC = () => {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<QuizDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/student/quiz-results');
      setResults(response.data.results || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching quiz results:', err);
      setError('Failed to load quiz results');
    } finally {
      setLoading(false);
    }
  };

  const fetchResultDetail = async (submissionId: number) => {
    try {
      setDetailLoading(true);
      const response = await api.get(`/api/student/quiz-results/${submissionId}`);
      setSelectedResult(response.data.submission);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching result detail:', err);
      setError('Failed to load result details');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleViewDetail = (result: QuizResult) => {
    if (result.is_graded) {
      fetchResultDetail(result.submission_id);
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
        Loading your quiz results...
      </div>
    );
  }

  if (selectedResult) {
    return (
      <QuizDetailView
        detail={selectedResult}
        loading={detailLoading}
        onBack={() => setSelectedResult(null)}
      />
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, color: '#1f2937', fontSize: '24px', fontWeight: '600' }}>
          My Quiz Results
        </h2>
        <p style={{ margin: '8px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
          View your quiz scores and feedback
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

      {/* Statistics */}
      {results.length > 0 && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px', 
          marginBottom: '24px' 
        }}>
          <div style={{
            padding: '16px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <FileText size={16} style={{ color: '#3b82f6' }} />
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Total Quizzes</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937' }}>
              {results.length}
            </div>
          </div>

          <div style={{
            padding: '16px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <CheckCircle size={16} style={{ color: '#10b981' }} />
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Graded</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937' }}>
              {results.filter(r => r.is_graded).length}
            </div>
          </div>

          <div style={{
            padding: '16px',
            backgroundColor: '#fef3c7',
            border: '1px solid #fde68a',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Clock size={16} style={{ color: '#f59e0b' }} />
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Pending</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937' }}>
              {results.filter(r => !r.is_graded).length}
            </div>
          </div>

          <div style={{
            padding: '16px',
            backgroundColor: '#ede9fe',
            border: '1px solid #c4b5fd',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Award size={16} style={{ color: '#8b5cf6' }} />
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Average Score</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937' }}>
              {results.filter(r => r.is_graded && r.percentage !== undefined).length > 0 
                ? Math.round(results.filter(r => r.is_graded && r.percentage !== undefined).reduce((acc, r) => acc + (r.percentage || 0), 0) / results.filter(r => r.is_graded && r.percentage !== undefined).length) + '%'
                : '-'
              }
            </div>
          </div>
        </div>
      )}

      {/* Results List */}
      {results.length === 0 ? (
        <div style={{
          textAlign: 'center' as const,
          padding: '40px',
          color: '#6b7280'
        }}>
          <Award size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <p style={{ margin: 0, fontSize: '16px' }}>No quiz results yet</p>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
            Complete some quizzes to see your results here
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {results.map((result) => (
            <ResultCard
              key={result.submission_id}
              result={result}
              onViewDetail={() => handleViewDetail(result)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Result Card Component
const ResultCard: React.FC<{
  result: QuizResult;
  onViewDetail: () => void;
}> = ({ result, onViewDetail }) => {
  const getScoreColor = (percentage?: number) => {
    if (percentage === undefined) return '#6b7280';
    if (percentage >= 80) return '#059669';
    if (percentage >= 70) return '#10b981';
    if (percentage >= 60) return '#d97706';
    return '#dc2626';
  };

  const getGradeText = (percentage?: number) => {
    if (percentage === undefined) return '';
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px',
      backgroundColor: 'white',
      transition: 'all 0.2s ease'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <h4 style={{ margin: 0, color: '#1f2937', fontSize: '16px', fontWeight: '600' }}>
              {result.quiz_title}
            </h4>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              {result.course_name}
            </span>
            {result.is_graded ? (
              <span style={{
                padding: '2px 8px',
                backgroundColor: '#dcfce7',
                color: '#166534',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                Graded
              </span>
            ) : (
              <span style={{
                padding: '2px 8px',
                backgroundColor: '#fef3c7',
                color: '#92400e',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                Pending
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
            <span>
              Submitted: {new Date(result.submitted_at).toLocaleString()}
            </span>
            {result.graded_at && (
              <span>
                Graded: {new Date(result.graded_at).toLocaleString()}
              </span>
            )}
          </div>

          {result.is_graded && result.score !== undefined ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                fontSize: '20px',
                fontWeight: '600',
                color: getScoreColor(result.percentage)
              }}>
                {result.score}/{result.total_points}
              </div>
              {result.percentage !== undefined && (
                <>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '500',
                    color: getScoreColor(result.percentage)
                  }}>
                    ({result.percentage}%)
                  </div>
                  <div style={{
                    padding: '4px 8px',
                    backgroundColor: getScoreColor(result.percentage) + '20',
                    color: getScoreColor(result.percentage),
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    {getGradeText(result.percentage)}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              color: '#6b7280',
              fontSize: '14px'
            }}>
              <Clock size={16} />
              Waiting for teacher to grade
            </div>
          )}

          {result.feedback && (
            <div style={{ 
              marginTop: '12px', 
              padding: '8px', 
              backgroundColor: '#f0f9ff', 
              border: '1px solid #bae6fd',
              borderRadius: '4px',
              fontSize: '14px',
              color: '#374151'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <MessageSquare size={14} style={{ color: '#0ea5e9' }} />
                <strong style={{ color: '#0ea5e9' }}>Teacher Feedback:</strong>
              </div>
              {result.feedback}
            </div>
          )}
        </div>

        {result.is_graded && (
          <button
            onClick={onViewDetail}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <Eye size={16} />
            View Details
          </button>
        )}
      </div>
    </div>
  );
};

// Quiz Detail View Component
const QuizDetailView: React.FC<{
  detail: QuizDetail;
  loading: boolean;
  onBack: () => void;
}> = ({ detail, loading, onBack }) => {
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px',
        color: '#6b7280'
      }}>
        Loading quiz details...
      </div>
    );
  }

  const getScoreColor = (percentage?: number) => {
    if (percentage === undefined) return '#6b7280';
    if (percentage >= 80) return '#059669';
    if (percentage >= 70) return '#10b981';
    if (percentage >= 60) return '#d97706';
    return '#dc2626';
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
            {detail.quiz_title}
          </h2>
          <p style={{ margin: '8px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
            Submitted: {new Date(detail.submitted_at).toLocaleString()}
            {detail.graded_at && ` • Graded: ${new Date(detail.graded_at).toLocaleString()}`}
          </p>
        </div>
        
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
          Back to Results
        </button>
      </div>

      {/* Score Summary */}
      <div style={{
        padding: '20px',
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '18px', fontWeight: '500', color: '#374151' }}>
            Final Score:
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ 
              fontSize: '24px', 
              fontWeight: '600', 
              color: getScoreColor(detail.percentage)
            }}>
              {detail.score}/{detail.total_points}
            </span>
            {detail.percentage !== undefined && (
              <span style={{ 
                fontSize: '20px', 
                fontWeight: '500', 
                color: getScoreColor(detail.percentage)
              }}>
                ({detail.percentage}%)
              </span>
            )}
          </div>
        </div>
        
        {detail.feedback && (
          <div style={{ 
            padding: '12px', 
            backgroundColor: 'white', 
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            marginTop: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <MessageSquare size={16} style={{ color: '#3b82f6' }} />
              <strong style={{ color: '#374151' }}>Teacher Feedback:</strong>
            </div>
            <p style={{ margin: 0, color: '#374151', fontSize: '14px' }}>
              {detail.feedback}
            </p>
          </div>
        )}
      </div>

      {/* Questions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {detail.question_details.map((question, index) => (
          <QuestionDetailCard
            key={question.question_id}
            question={question}
            questionNumber={index + 1}
          />
        ))}
      </div>
    </div>
  );
};

// Question Detail Card Component
const QuestionDetailCard: React.FC<{
  question: QuestionDetail;
  questionNumber: number;
}> = ({ question, questionNumber }) => {
  const isMultipleChoice = question.question_type === 'multiple_choice';
  const isCorrect = question.is_correct;
  const pointsAwarded = question.points_awarded || 0;

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px',
      backgroundColor: 'white'
    }}>
      {/* Question Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
        <div>
          <h4 style={{ margin: 0, color: '#1f2937', fontSize: '16px', fontWeight: '600' }}>
            Question {questionNumber}
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <span style={{
              padding: '2px 8px',
              backgroundColor: isMultipleChoice ? '#dbeafe' : '#fef3c7',
              color: isMultipleChoice ? '#1e40af' : '#92400e',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {isMultipleChoice ? 'Multiple Choice' : 'Essay'}
            </span>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              {question.points} points
            </span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '16px',
            fontWeight: '600',
            color: pointsAwarded === question.points ? '#059669' : pointsAwarded > 0 ? '#d97706' : '#dc2626'
          }}>
            {pointsAwarded}/{question.points}
          </span>
          {isMultipleChoice && isCorrect !== undefined && (
            isCorrect ? (
              <CheckCircle size={20} style={{ color: '#059669' }} />
            ) : (
              <XCircle size={20} style={{ color: '#dc2626' }} />
            )
          )}
        </div>
      </div>

      {/* Question Text */}
      <div style={{ marginBottom: '12px' }}>
        <p style={{ margin: 0, color: '#374151', fontSize: '14px', lineHeight: '1.5' }}>
          {question.question_text}
        </p>
      </div>

      {/* Multiple Choice Options */}
      {isMultipleChoice && question.options && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'grid', gap: '8px' }}>
            {Object.entries(question.options).map(([key, value]) => (
              <div
                key={key}
                style={{
                  padding: '8px 12px',
                  border: '1px solid',
                  borderColor: question.student_answer === key 
                    ? (question.correct_answer === key ? '#10b981' : '#ef4444')
                    : (question.correct_answer === key ? '#10b981' : '#e5e7eb'),
                  backgroundColor: question.student_answer === key 
                    ? (question.correct_answer === key ? '#dcfce7' : '#fee2e2')
                    : (question.correct_answer === key ? '#dcfce7' : 'white'),
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: '#374151'
                }}
              >
                <span style={{ fontWeight: '500', marginRight: '8px' }}>{key}.</span>
                {value}
                {question.student_answer === key && (
                  <span style={{ 
                    marginLeft: '8px', 
                    fontSize: '12px', 
                    fontWeight: '500',
                    color: question.correct_answer === key ? '#059669' : '#dc2626'
                  }}>
                    (Your answer)
                  </span>
                )}
                {question.correct_answer === key && question.student_answer !== key && (
                  <span style={{ 
                    marginLeft: '8px', 
                    fontSize: '12px', 
                    fontWeight: '500',
                    color: '#059669'
                  }}>
                    (Correct answer)
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Essay Answer */}
      {!isMultipleChoice && (
        <div style={{ marginBottom: '12px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '6px', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#374151' 
          }}>
            Your Answer:
          </label>
          <div style={{
            padding: '12px',
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '14px',
            color: '#374151',
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap' as const
          }}>
            {question.student_answer || 'No answer provided'}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentQuizResults;