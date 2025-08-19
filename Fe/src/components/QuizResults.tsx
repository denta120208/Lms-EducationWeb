import React, { useState, useEffect } from 'react';
import { Eye, Edit, CheckCircle, Clock, User, FileText, Award, MessageSquare } from 'lucide-react';
import { api } from '../services/api';

interface QuizSubmission {
  id: number;
  quiz_id: number;
  quiz_title: string;
  student_id: number;
  student_name: string;
  student_email: string;
  submission_type: string;
  answers?: { [key: string]: any };
  uploaded_file_path?: string;
  score?: number;
  total_points: number;
  submitted_at: string;
  graded_at?: string;
  graded_by?: number;
  feedback?: string;
  question_details?: QuestionAnswer[];
}

interface QuestionAnswer {
  question_id: number;
  question_text: string;
  question_type: string;
  points: number;
  student_answer: string;
  correct_answer?: string;
  is_correct?: boolean;
  points_awarded?: number;
}

interface QuizResultsProps {
  quizId: number;
  quizTitle: string;
  onBack: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ quizId, quizTitle, onBack }) => {
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<QuizSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, [quizId]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/quizzes/${quizId}/submissions`);
      setSubmissions(response.data.submissions || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching submissions:', err);
      setError('Failed to load quiz submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleGradeSubmission = (submission: QuizSubmission) => {
    setSelectedSubmission(submission);
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
        Loading submissions...
      </div>
    );
  }

  if (selectedSubmission) {
    return (
      <GradingInterface
        submission={selectedSubmission}
        onBack={() => setSelectedSubmission(null)}
        onGraded={() => {
          setSelectedSubmission(null);
          fetchSubmissions();
        }}
      />
    );
  }

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
            Quiz Results: {quizTitle}
          </h2>
          <p style={{ margin: '8px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
            {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
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
          Back to Quiz
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

      {/* Statistics */}
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
            <User size={16} style={{ color: '#3b82f6' }} />
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Total Submissions</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937' }}>
            {submissions.length}
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
            {submissions.filter(s => s.score !== undefined).length}
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
            {submissions.filter(s => s.score === undefined).length}
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
            {submissions.filter(s => s.score !== undefined).length > 0 
              ? Math.round(submissions.filter(s => s.score !== undefined).reduce((acc, s) => acc + (s.score || 0), 0) / submissions.filter(s => s.score !== undefined).length)
              : '-'
            }
          </div>
        </div>
      </div>

      {/* Submissions List */}
      {submissions.length === 0 ? (
        <div style={{
          textAlign: 'center' as const,
          padding: '40px',
          color: '#6b7280'
        }}>
          <FileText size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <p style={{ margin: 0, fontSize: '16px' }}>No submissions yet</p>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
            Students haven't submitted this quiz yet
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {submissions.map((submission) => (
            <SubmissionCard
              key={submission.id}
              submission={submission}
              onGrade={() => handleGradeSubmission(submission)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Submission Card Component
const SubmissionCard: React.FC<{
  submission: QuizSubmission;
  onGrade: () => void;
}> = ({ submission, onGrade }) => {
  const isGraded = submission.score !== undefined;
  const percentage = isGraded ? Math.round((submission.score! / submission.total_points) * 100) : null;

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px',
      backgroundColor: 'white'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <h4 style={{ margin: 0, color: '#1f2937', fontSize: '16px', fontWeight: '600' }}>
              {submission.student_name}
            </h4>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              {submission.student_email}
            </span>
            {isGraded ? (
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

          <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
            <span>
              Submitted: {new Date(submission.submitted_at).toLocaleString()}
            </span>
            {submission.graded_at && (
              <span>
                Graded: {new Date(submission.graded_at).toLocaleString()}
              </span>
            )}
          </div>

          {isGraded && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                fontSize: '18px',
                fontWeight: '600',
                color: percentage! >= 70 ? '#059669' : percentage! >= 50 ? '#d97706' : '#dc2626'
              }}>
                {submission.score}/{submission.total_points} ({percentage}%)
              </div>
            </div>
          )}

          {submission.feedback && (
            <div style={{ 
              marginTop: '8px', 
              padding: '8px', 
              backgroundColor: '#f9fafb', 
              borderRadius: '4px',
              fontSize: '14px',
              color: '#374151'
            }}>
              <strong>Feedback:</strong> {submission.feedback}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onGrade}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              backgroundColor: isGraded ? '#f3f4f6' : '#3b82f6',
              color: isGraded ? '#374151' : 'white',
              border: '1px solid',
              borderColor: isGraded ? '#d1d5db' : '#3b82f6',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {isGraded ? <Eye size={16} /> : <Edit size={16} />}
            {isGraded ? 'View' : 'Grade'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Grading Interface Component
const GradingInterface: React.FC<{
  submission: QuizSubmission;
  onBack: () => void;
  onGraded: () => void;
}> = ({ submission, onBack, onGraded }) => {
  const [grades, setGrades] = useState<{ [key: number]: number }>({});
  const [feedback, setFeedback] = useState(submission.feedback || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize grades with existing points
    if (submission.question_details) {
      const initialGrades: { [key: number]: number } = {};
      submission.question_details.forEach(qa => {
        initialGrades[qa.question_id] = qa.points_awarded || 0;
      });
      setGrades(initialGrades);
    }
  }, [submission]);

  const handleGradeChange = (questionId: number, points: number) => {
    setGrades(prev => ({
      ...prev,
      [questionId]: points
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const gradeData = {
        submission_id: submission.id,
        grades: Object.entries(grades).map(([questionId, points]) => ({
          question_id: parseInt(questionId),
          points_awarded: points
        })),
        feedback: feedback
      };

      await api.post('/api/quiz-submissions/grade', gradeData);
      onGraded();
    } catch (err: any) {
      console.error('Error saving grades:', err);
      setError('Failed to save grades. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const totalScore = Object.values(grades).reduce((sum, points) => sum + points, 0);

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
            Grading: {submission.student_name}
          </h2>
          <p style={{ margin: '8px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
            {submission.quiz_title} • Submitted: {new Date(submission.submitted_at).toLocaleString()}
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
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
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '8px 16px',
              backgroundColor: saving ? '#9ca3af' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {saving ? 'Saving...' : 'Save Grades'}
          </button>
        </div>
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

      {/* Score Summary */}
      <div style={{
        padding: '16px',
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '16px', fontWeight: '500', color: '#374151' }}>
            Total Score:
          </span>
          <span style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>
            {totalScore} / {submission.total_points}
          </span>
        </div>
      </div>

      {/* Questions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
        {submission.question_details?.map((qa, index) => (
          <QuestionGrading
            key={qa.question_id}
            questionAnswer={qa}
            questionNumber={index + 1}
            grade={grades[qa.question_id] || 0}
            onGradeChange={(points) => handleGradeChange(qa.question_id, points)}
          />
        ))}
      </div>

      {/* Feedback */}
      <div style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
        backgroundColor: 'white'
      }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          fontSize: '14px', 
          fontWeight: '500', 
          color: '#374151' 
        }}>
          Feedback (Optional)
        </label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            resize: 'vertical' as const,
            minHeight: '80px'
          }}
          placeholder="Provide feedback for the student..."
        />
      </div>
    </div>
  );
};

// Question Grading Component
const QuestionGrading: React.FC<{
  questionAnswer: QuestionAnswer;
  questionNumber: number;
  grade: number;
  onGradeChange: (points: number) => void;
}> = ({ questionAnswer, questionNumber, grade, onGradeChange }) => {
  const isMultipleChoice = questionAnswer.question_type === 'multiple_choice';
  const isCorrect = questionAnswer.is_correct;

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px',
      backgroundColor: 'white'
    }}>
      {/* Question Header */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
          <h4 style={{ margin: 0, color: '#1f2937', fontSize: '16px', fontWeight: '600' }}>
            Question {questionNumber}
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
              {questionAnswer.points} points
            </span>
          </div>
        </div>
        <p style={{ margin: 0, color: '#374151', fontSize: '14px' }}>
          {questionAnswer.question_text}
        </p>
      </div>

      {/* Student Answer */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '4px', 
          fontSize: '14px', 
          fontWeight: '500', 
          color: '#374151' 
        }}>
          Student Answer:
        </label>
        <div style={{
          padding: '8px 12px',
          backgroundColor: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          fontSize: '14px',
          color: '#374151'
        }}>
          {questionAnswer.student_answer || 'No answer provided'}
        </div>
      </div>

      {/* Correct Answer (for multiple choice) */}
      {isMultipleChoice && questionAnswer.correct_answer && (
        <div style={{ marginBottom: '12px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '4px', 
            fontSize: '14px', 
            fontWeight: '500', 
            color: '#374151' 
          }}>
            Correct Answer:
          </label>
          <div style={{
            padding: '8px 12px',
            backgroundColor: isCorrect ? '#dcfce7' : '#fee2e2',
            border: '1px solid',
            borderColor: isCorrect ? '#bbf7d0' : '#fca5a5',
            borderRadius: '6px',
            fontSize: '14px',
            color: isCorrect ? '#166534' : '#dc2626'
          }}>
            {questionAnswer.correct_answer}
            {isCorrect !== undefined && (
              <span style={{ marginLeft: '8px', fontWeight: '500' }}>
                ({isCorrect ? 'Correct' : 'Incorrect'})
              </span>
            )}
          </div>
        </div>
      )}

      {/* Grade Input */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
          Points Awarded:
        </label>
        <input
          type="number"
          min="0"
          max={questionAnswer.points}
          value={grade}
          onChange={(e) => onGradeChange(Math.min(questionAnswer.points, Math.max(0, parseFloat(e.target.value) || 0)))}
          style={{
            width: '80px',
            padding: '4px 8px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            fontSize: '14px',
            textAlign: 'center' as const
          }}
          disabled={isMultipleChoice && isCorrect !== undefined}
        />
        <span style={{ fontSize: '14px', color: '#6b7280' }}>
          / {questionAnswer.points}
        </span>
        {isMultipleChoice && isCorrect !== undefined && (
          <span style={{ 
            fontSize: '12px', 
            color: '#6b7280',
            fontStyle: 'italic'
          }}>
            (Auto-graded)
          </span>
        )}
      </div>
    </div>
  );
};

export default QuizResults;