import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { api } from '../services/api';

interface ContentFormProps {
  courseId: number;
  content?: {
    id: number;
    type: ContentType;
    title: string;
    description: string;
    section: string;
    deadline?: string;
    questions?: QuizQuestion[];
  };
  onClose: () => void;
  onSuccess: () => void;
}

type ContentType = 'material' | 'quiz' | 'task' | 'exam';

interface QuizOption {
  text: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  question: string;
  options: QuizOption[];
}

const ContentForm: React.FC<ContentFormProps> = ({ courseId, content, onClose, onSuccess }) => {
  const [contentType, setContentType] = useState<ContentType>(content?.type || 'material');
  const [title, setTitle] = useState(content?.title || '');
  const [description, setDescription] = useState(content?.description || '');
  const [section, setSection] = useState(content?.section || '');
  const [deadline, setDeadline] = useState(content?.deadline || '');
  const [questions, setQuestions] = useState<QuizQuestion[]>(content?.questions || [{
    question: '',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ]
  }]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = {
        type: contentType,
        title,
        description,
        section,
        ...(contentType === 'task' && { deadline }),
        ...(contentType === 'quiz' && { questions }),
        ...(contentType === 'exam' && { questions })
      };

      let response;
      if (content?.id) {
        response = await api.put(`/api/teacher/contents/${content.id}`, data);
      } else {
        response = await api.post(`/api/teacher/courses/${courseId}/contents`, data);
      }

      if (response.data.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.data.message || 'Failed to create content');
      }
    } catch (err: any) {
      console.error('Error creating content:', err);
      setError(err.response?.data?.message || 'Failed to create content');
    } finally {
      setIsLoading(false);
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, {
      question: '',
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ]
    }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const newQuestions = [...questions];
    if (field === 'question') {
      newQuestions[index].question = value;
    } else if (field.startsWith('option')) {
      const optionIndex = parseInt(field.split('-')[1]);
      newQuestions[index].options[optionIndex].text = value;
    } else if (field.startsWith('correct')) {
      const optionIndex = parseInt(field.split('-')[1]);
      // Unselect all other options
      newQuestions[index].options.forEach(opt => opt.isCorrect = false);
      newQuestions[index].options[optionIndex].isCorrect = true;
    }
    setQuestions(newQuestions);
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
          Add Content
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
          {/* Content Type Selection */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
            }}>
              Content Type
            </label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value as ContentType)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
              }}
              disabled={!!content}
            >
              <option value="material">Material</option>
              <option value="quiz">Quiz</option>
              <option value="task">Task</option>
              <option value="exam">Exam</option>
            </select>
          </div>

          {/* Section Field */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
            }}>
              Section
            </label>
            <input
              type="text"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              placeholder="e.g. Introduction, Chapter 1, etc."
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

          {/* Title Field */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
            }}>
              Title
            </label>
            <input
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

          {/* Description Field */}
          {(contentType === 'material' || contentType === 'task') && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
              }}>
                Description
              </label>
              <textarea
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
                required
              />
            </div>
          )}

          {/* Deadline Field for Task */}
          {contentType === 'task' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
              }}>
                Deadline
              </label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
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
          )}

          {/* Questions for Quiz and Exam */}
          {(contentType === 'quiz' || contentType === 'exam') && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
              }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                }}>
                  Questions
                </label>
                <button
                  type="button"
                  onClick={addQuestion}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={14} />
                  Add Question
                </button>
              </div>

              {questions.map((question, qIndex) => (
                <div
                  key={qIndex}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '16px',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '12px',
                  }}>
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                      placeholder="Question text"
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px',
                        marginRight: '8px',
                      }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {question.options.map((option, oIndex) => (
                    <div
                      key={oIndex}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: oIndex < question.options.length - 1 ? '8px' : 0,
                      }}
                    >
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={option.isCorrect}
                        onChange={() => updateQuestion(qIndex, `correct-${oIndex}`, true)}
                        required={question.options.every(opt => !opt.isCorrect)}
                      />
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => updateQuestion(qIndex, `option-${oIndex}`, e.target.value)}
                        placeholder={`Option ${oIndex + 1}`}
                        style={{
                          flex: 1,
                          padding: '6px 10px',
                          borderRadius: '4px',
                          border: '1px solid #d1d5db',
                          fontSize: '14px',
                        }}
                        required
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '24px',
          }}>
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
              {isLoading ? 'Creating...' : 'Create Content'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContentForm;