import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid3X3, BookOpen, User, Search, Plus } from 'lucide-react';

interface Teacher {
  id: number;
  name: string;
  email: string;
  subject: string;
}

interface Course {
  id: number;
  title: string;
  subject: string;
  grade: string;
  teacher_name: string;
}

const TeacherCourses = () => {
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadTeacherData = async () => {
      try {
        const teacherData = localStorage.getItem('teacherData');
        const token = localStorage.getItem('teacherToken');
        
        if (!teacherData || !token) {
          navigate('/login');
          return;
        }

        const parsedTeacher = JSON.parse(teacherData);
        setTeacher(parsedTeacher);

        // Load courses data
        const response = await fetch('http://localhost:8080/api/teacher/courses', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCourses(data.courses || []);
        } else {
          setError('Failed to load courses data');
        }
      } catch (error: any) {
        setError(error.message || 'Failed to load courses');
      } finally {
        setIsLoading(false);
      }
    };

    loadTeacherData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('teacherToken');
    localStorage.removeItem('teacherData');
    navigate('/login');
  };

  const handleDashboard = () => {
    navigate('/teacher/dashboard');
  };

  // Default courses if none from API
  const defaultCourses = [
    {
      id: 1,
      title: 'Mathematics',
      subject: 'Mathematics',
      grade: '10th grade',
      teacher_name: 'Mr. Agus',
      image: '/api/placeholder/300/200'
    },
    {
      id: 2,
      title: 'Science',
      subject: 'Science', 
      grade: '9th grade',
      teacher_name: 'Ms. Aurel',
      image: '/api/placeholder/300/200'
    }
  ];

  const displayCourses = courses.length > 0 ? courses : defaultCourses;
  const filteredCourses = displayCourses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      backgroundColor: '#f0f4ff',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '80px',
        backgroundColor: '#6366f1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '20px',
        gap: '20px'
      }}>
        <div 
          onClick={handleDashboard}
          style={{
            width: '48px',
            height: '48px',
            backgroundColor: '#4f46e5',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <Grid3X3 size={24} color="white" />
        </div>
        <div style={{
          width: '48px',
          height: '48px',
          backgroundColor: '#374151',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <BookOpen size={24} color="white" />
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#fbbf24',
          padding: '16px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: '24px', 
              color: '#f97316',
              fontWeight: 'normal'
            }}>
              Hello, <span style={{ fontWeight: 'bold', color: '#000' }}>Teacher</span>
            </h1>
            <p style={{ 
              margin: 0, 
              fontSize: '14px', 
              color: '#666',
              marginTop: '4px'
            }}>
              The best view comes after the hardest climb
            </p>
          </div>
          
          <div style={{ position: 'relative' }}>
            <div 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#374151',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <User size={20} color="white" />
            </div>
            
            {showProfileMenu && (
              <div style={{
                position: 'absolute',
                top: '50px',
                right: '0',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                padding: '8px',
                minWidth: '120px',
                zIndex: 1000
              }}>
                <div style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '14px' }}>Profile</div>
                <div style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '14px' }}>Grades</div>
                <div 
                  onClick={handleLogout}
                  style={{ 
                    padding: '8px 12px', 
                    cursor: 'pointer', 
                    fontSize: '14px',
                    borderTop: '1px solid #eee',
                    marginTop: '4px'
                  }}
                >
                  Log Out
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div style={{ 
          flex: 1, 
          padding: '32px'
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            marginBottom: '32px',
            color: '#374151'
          }}>
            My Courses
          </h2>

          {/* Course Overview Section */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: '600',
              marginBottom: '24px',
              color: '#374151'
            }}>
              Course overview
            </h3>

            {/* Filter and Search */}
            <div style={{ 
              display: 'flex', 
              gap: '16px',
              marginBottom: '32px',
              alignItems: 'center'
            }}>
              <button style={{
                padding: '8px 16px',
                backgroundColor: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: '500'
              }}>
                All
              </button>
              
              <div style={{ 
                position: 'relative',
                flex: 1,
                maxWidth: '300px'
              }}>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <button style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#3b82f6',
                border: 'none',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}>
                <Plus size={16} color="white" />
              </button>
            </div>

            {/* Courses Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {filteredCourses.map((course) => (
                <div key={course.id} style={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
                >
                  {/* Course Image */}
                  <div style={{
                    height: '160px',
                    background: course.title === 'Mathematics' 
                      ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
                      : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Geometric patterns */}
                    {course.title === 'Mathematics' && (
                      <>
                        <div style={{
                          position: 'absolute',
                          top: '16px',
                          left: '16px',
                          width: '32px',
                          height: '32px',
                          backgroundColor: '#4b5563',
                          transform: 'rotate(45deg)'
                        }} />
                        <div style={{
                          position: 'absolute',
                          top: '32px',
                          right: '24px',
                          width: '24px',
                          height: '24px',
                          backgroundColor: '#374151',
                          transform: 'rotate(12deg)'
                        }} />
                        <div style={{
                          position: 'absolute',
                          bottom: '24px',
                          left: '32px',
                          width: '40px',
                          height: '40px',
                          backgroundColor: '#4b5563',
                          transform: 'rotate(-12deg)'
                        }} />
                      </>
                    )}
                    
                    {course.title === 'Science' && (
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80px',
                        height: '80px',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          borderRadius: '50%'
                        }} />
                      </div>
                    )}
                  </div>

                  {/* Course Info */}
                  <div style={{ padding: '20px' }}>
                    <h4 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#3b82f6',
                      margin: '0 0 8px 0'
                    }}>
                      {course.title}
                    </h4>
                    <p style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      margin: 0
                    }}>
                      {course.teacher_name || teacher?.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '48px',
                color: '#9ca3af'
              }}>
                <BookOpen size={48} color="#d1d5db" />
                <p style={{ marginTop: '16px', fontSize: '16px' }}>
                  No courses found
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherCourses;