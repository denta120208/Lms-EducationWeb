import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid3X3, BookOpen, User, ChevronDown, Search, Plus } from 'lucide-react';

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

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

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

        // Load dashboard data
        const response = await fetch('http://localhost:8080/api/teacher/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCourses(data.courses || []);
        } else {
          setError('Failed to load dashboard data');
        }
      } catch (error: any) {
        setError(error.message || 'Failed to load dashboard');
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

  const handleMyCourses = () => {
    navigate('/teacher/courses');
  };

  // Generate calendar for current month
  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const calendarDays = generateCalendar();
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

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
        <div style={{
          width: '48px',
          height: '48px',
          backgroundColor: '#4f46e5',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <Grid3X3 size={24} color="white" />
        </div>
        <div 
          onClick={handleMyCourses}
          style={{
            width: '48px',
            height: '48px',
            backgroundColor: '#374151',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
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
          padding: '32px',
          display: 'flex',
          gap: '32px'
        }}>
          {/* Left Column */}
          <div style={{ flex: 2 }}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              marginBottom: '24px',
              color: '#374151'
            }}>
              Dashboard
            </h2>

            {/* Course Summary */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '32px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                marginBottom: '20px'
              }}>
                <BookOpen size={20} color="#374151" />
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600',
                  margin: 0,
                  color: '#374151'
                }}>
                  Course Summary
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px'
                }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#374151' }}>10th grade</div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>Mathematics</div>
                  </div>
                  <button style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#3b82f6',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}>
                    go to course
                  </button>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px'
                }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#374151' }}>9th grade</div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>Mathematics</div>
                  </div>
                  <button style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#3b82f6',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}>
                    go to course
                  </button>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px'
                }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#374151' }}>7th grade</div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>Science</div>
                  </div>
                  <button style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#3b82f6',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}>
                    go to course
                  </button>
                </div>
              </div>
            </div>

            {/* Assignment Section */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600',
                marginBottom: '20px',
                color: '#374151'
              }}>
                Assignment
              </h3>

              <div style={{ 
                display: 'flex', 
                gap: '16px',
                marginBottom: '24px'
              }}>
                <button style={{
                  padding: '8px 16px',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}>
                  Next 7 days
                </button>
                
                <div style={{ 
                  flex: 1,
                  position: 'relative'
                }}>
                  <input
                    type="text"
                    placeholder="search by activity or type name"
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
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '120px',
                color: '#9ca3af'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <BookOpen size={48} color="#d1d5db" />
                  <p style={{ marginTop: '16px', fontSize: '14px' }}>No assignments yet</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Calendar */}
          <div style={{ flex: 1 }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600',
                  margin: 0,
                  color: '#374151'
                }}>
                  Calendar
                </h3>
                <button style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}>
                  View event
                </button>
              </div>

              <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                <h4 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600',
                  margin: 0,
                  color: '#374151'
                }}>
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h4>
              </div>

              {/* Calendar Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '4px',
                marginBottom: '8px'
              }}>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <div key={day} style={{
                    padding: '8px 4px',
                    textAlign: 'center',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6b7280'
                  }}>
                    {day.slice(0, 3)}
                  </div>
                ))}
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '4px'
              }}>
                {calendarDays.map((day, index) => {
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                  const isToday = day.toDateString() === new Date().toDateString();
                  
                  return (
                    <div key={index} style={{
                      padding: '8px 4px',
                      textAlign: 'center',
                      fontSize: '14px',
                      color: isCurrentMonth ? '#374151' : '#d1d5db',
                      backgroundColor: isToday ? '#3b82f6' : 'transparent',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}>
                      {day.getDate()}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;