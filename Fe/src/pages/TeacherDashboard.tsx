import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid3X3, BookOpen, User, Bell, LogOut, Search, BookOpenCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { CSSProperties } from 'react';
import type { Course } from '../services/api';

const TeacherDashboard = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, _setSelectedFilter] = useState('Next 7 days'); // Using underscore prefix for unused setter
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Load courses data
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setIsLoading(true);
        // In a real app, we would fetch from the API
        // const response = await courseAPI.getCourses();
        // setCourses(response);
        
        // For now, use default courses
        await new Promise(resolve => setTimeout(resolve, 500));
        setCourses(defaultCourses);
      } catch (error) {
        console.error('Failed to load courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Generate current calendar data
  const getCurrentCalendarData = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    // Adjust start date to begin with Sunday
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    while (current <= lastDay || days.length < 42) {
      days.push({
        date: current.getDate(),
        isCurrentMonth: current.getMonth() === month,
        isToday: current.getMonth() === month && current.getDate() === today,
        fullDate: new Date(current)
      });
      current.setDate(current.getDate() + 1);
      
      if (days.length >= 42) break;
    }
    
    return {
      monthYear: now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      days
    };
  };

  const calendarData = getCurrentCalendarData();
  
  // Default courses
  const defaultCourses: Course[] = [
    {
      id: 1,
      title: 'Mathematics',
      subject: 'Mathematics',
      description: 'A comprehensive mathematics course covering algebra, geometry, and calculus.',
      grade: '10th grade',
      teacher_name: 'Mr. Agus',
      image_url: ''
    },
    {
      id: 2,
      title: 'Science',
      subject: 'Science',
      description: 'An introduction to physics, chemistry, and biology concepts.',
      grade: '9th grade',
      teacher_name: 'Mr. Agus',
      image_url: ''
    },
    {
      id: 3,
      title: 'Social Science',
      subject: 'Social Science',
      description: 'Exploring history, geography, and social studies.',
      grade: '8th grade',
      teacher_name: 'Mr. Agus',
      image_url: ''
    },
    {
      id: 4,
      title: 'English',
      subject: 'English',
      description: 'Literature, grammar, and writing skills development.',
      grade: '11th grade',
      teacher_name: 'Mr. Agus',
      image_url: ''
    }
  ];

  // Responsive breakpoints
  const isMobile = windowWidth <= 768;
  // const isTablet = windowWidth <= 1024; // Uncomment if needed later
  const isSmallMobile = windowWidth <= 480;

  const styles: Record<string, CSSProperties> = {
    container: {
      width: '100%',
      height: '100vh',
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      display: 'flex',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      overflow: 'hidden',
      fontFamily: '"Poppins", sans-serif'
    },
    sidebar: {
      width: isMobile ? '100%' : (isSmallMobile ? '56px' : '64px'),
      height: isMobile ? 'auto' : '100vh',
      backgroundColor: '#3b82f6',
      display: 'flex',
      flexDirection: isMobile ? 'row' : 'column',
      alignItems: 'center',
      justifyContent: isMobile ? 'space-around' : 'flex-start',
      paddingTop: isMobile ? '12px' : (isSmallMobile ? '16px' : '24px'),
      paddingBottom: isMobile ? '12px' : (isSmallMobile ? '16px' : '24px'),
      gap: isMobile ? '16px' : (isSmallMobile ? '24px' : '32px'),
      position: isMobile ? 'fixed' : 'static',
      bottom: isMobile ? 0 : 'auto',
      left: isMobile ? 0 : 'auto',
      zIndex: 10
    },
    sidebarIcon: {
      padding: '8px',
      backgroundColor: '#2563eb',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    sidebarIconHover: {
      padding: '8px',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.2s'
    },
    mainContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      width: isMobile ? '100%' : `calc(100vw - ${isSmallMobile ? '56px' : '64px'})`,
      height: isMobile ? 'calc(100vh - 60px)' : '100vh',
      overflow: 'auto',
      marginBottom: isMobile ? '60px' : '0'
    },
    header: {
      backgroundColor: '#fbbf24',
      padding: isSmallMobile ? '12px 16px' : isMobile ? '14px 20px' : '16px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '8px'
    },
    headerLeft: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    headerTitle: {
      fontSize: isSmallMobile ? '16px' : isMobile ? '18px' : '20px',
      fontWeight: '500',
      color: '#374151',
      margin: 0,
      flex: 1,
      minWidth: '200px'
    },
    headerSubtitle: {
      fontSize: isSmallMobile ? '11px' : isMobile ? '12px' : '14px',
      color: '#000000ff',
      margin: 0,
      display: isSmallMobile ? 'none' : 'block'
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: isSmallMobile ? '8px' : '16px',
      position: 'relative'
    },
    userAvatar: {
      width: isSmallMobile ? '28px' : '32px',
      height: isSmallMobile ? '28px' : '32px',
      backgroundColor: '#4b5563',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    content: {
      padding: isSmallMobile ? '16px' : isMobile ? '20px' : '32px',
      flex: 1,
      overflow: 'auto'
    },
    pageTitle: {
      fontSize: isSmallMobile ? '18px' : isMobile ? '20px' : '24px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: isSmallMobile ? '16px' : isMobile ? '24px' : '32px',
      marginTop: 0,
      marginLeft: 0,
      marginRight: 0
    },
    dashboardGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 400px',
      gap: isSmallMobile ? '16px' : '24px',
      maxWidth: '1400px'
    },
    leftSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: isSmallMobile ? '16px' : '24px'
    },
    assignmentCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: isSmallMobile ? '16px' : '24px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb'
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    cardTitle: {
      fontSize: isSmallMobile ? '16px' : '18px',
      fontWeight: '600',
      color: '#374151',
      margin: 0
    },
    filterButton: {
      backgroundColor: '#f3f4f6',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      padding: '6px 12px',
      fontSize: '14px',
      color: '#374151',
      cursor: 'pointer'
    },
    searchContainer: {
      position: 'relative',
      marginBottom: '20px'
    },
    searchInput: {
      width: '100%',
      padding: '10px 12px 10px 40px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      boxSizing: 'border-box'
    },
    searchIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af'
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      textAlign: 'center',
      color: '#6b7280'
    },
    emptyIcon: {
      width: '80px',
      height: '80px',
      backgroundColor: '#f3f4f6',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '16px'
    },
    emptyText: {
      fontSize: '16px',
      fontWeight: '500',
      color: '#374151',
      margin: '0 0 4px 0'
    },
    calendarCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: isSmallMobile ? '16px' : '24px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      height: 'fit-content'
    },
    calendarHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    calendarTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#374151',
      margin: 0
    },
    newEventButton: {
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '6px 12px',
      fontSize: '12px',
      cursor: 'pointer'
    },
    monthYear: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#374151',
      textAlign: 'center',
      marginBottom: '16px'
    },
    calendarGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '1px',
      backgroundColor: 'rgb(255 255 255)',
      borderRadius: '8px',
      overflow: 'hidden',
      width: '100%',
      minWidth: '300px'
    },
    dayHeader: {
      width: '40px',
      maxWidth: '40px',
      backgroundColor: '#f9fafb',
      padding: '8px 4px',
      fontSize: '12px',
      fontWeight: '500',
      color: '#6b7280',
      textAlign: 'center'
    },
    dayCell: {
      backgroundColor: 'white',
      padding: '8px',
      minHeight: '36px',
      width: '40px',
      maxWidth: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    currentMonthDay: {
      color: '#374151'
    },
    otherMonthDay: {
      color: '#d1d5db'
    },
    todayDay: {
      backgroundColor: '#3b82f6',
      color: 'white',
      fontWeight: '600'
    }
  };

  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarIcon}>
          <Grid3X3 size={isSmallMobile ? 20 : 24} color="white" />
        </div>
        <div 
          style={styles.sidebarIconHover}
          onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = '#2563eb'}
          onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
          onClick={() => handleNavigation('/teacher/courses')}
          title="Courses"
        >
          <BookOpen size={isSmallMobile ? 20 : 24} color="white" />
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <h1 style={styles.headerTitle}>
              Welcome, <span style={{color: '#000000ff'}} className="poppins-semibold">{user?.name || 'Teacher'}</span>
            </h1>
          </div>
          <div style={styles.headerRight}>
            <Bell size={isSmallMobile ? 20 : 24} color="#374151" />
            <div style={styles.userAvatar}>
              <User size={isSmallMobile ? 16 : 20} color="white" />
            </div>
            <div 
              style={{...styles.userAvatar, cursor: 'pointer', backgroundColor: '#ef4444'}}
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={isSmallMobile ? 16 : 20} color="white" />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div style={styles.content}>
          <h2 style={styles.pageTitle}>Teacher Dashboard</h2>
          
          <div style={styles.dashboardGrid}>
            {/* Left Section - Assignment */}
            <div style={styles.leftSection}>
              <div style={styles.assignmentCard}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>Assignment</h3>
                  <button style={styles.filterButton}>
                    {selectedFilter}
                  </button>
                </div>
                
                <div style={styles.searchContainer}>
                  <div style={styles.searchIcon}>
                    <Search size={16} />
                  </div>
                  <input
                    type="text"
                    placeholder="search by activity or type name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={styles.searchInput}
                  />
                </div>

                {isLoading ? (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '200px',
                    flexDirection: 'column',
                    gap: '16px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      border: '4px solid #e5e7eb',
                      borderTop: '4px solid #3b82f6',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    <p style={{ color: '#6b7280', margin: 0 }}>Loading courses...</p>
                  </div>
                ) : courses.length > 0 ? (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    {courses.slice(0, 3).map(course => (
                      <div key={course.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                      onClick={() => navigate('/teacher/courses')}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      >
                        <div>
                          <div style={{ fontWeight: '600', color: '#374151' }}>{course.grade}</div>
                          <div style={{ fontSize: '14px', color: '#6b7280' }}>{course.subject}</div>
                        </div>
                        <button style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#3b82f6',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}>
                          view course
                        </button>
                      </div>
                    ))}
                    
                    {courses.length > 3 && (
                      <div style={{
                        textAlign: 'center',
                        marginTop: '8px'
                      }}>
                        <button 
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#3b82f6',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500'
                          }}
                          onClick={() => navigate('/teacher/courses')}
                        >
                          View all courses
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>
                      <BookOpenCheck size={32} color="#9ca3af" />
                    </div>
                    <p style={styles.emptyText}>No courses yet</p>
                    <button 
                      style={{
                        marginTop: '16px',
                        padding: '8px 16px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                      onClick={() => navigate('/teacher/courses')}
                    >
                      Add your first course
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Section - Calendar */}
            <div style={styles.calendarCard}>
              <div style={styles.calendarHeader}>
                <h3 style={styles.calendarTitle}>Calendar</h3>
                <button style={styles.newEventButton}>
                  New event
                </button>
              </div>
              
              <div style={styles.monthYear}>
                {calendarData.monthYear}
              </div>
              
              <div style={styles.calendarGrid}>
                {dayHeaders.map((day) => (
                  <div key={day} style={styles.dayHeader}>
                    {day}
                  </div>
                ))}
                
                {calendarData.days.map((day, index) => (
                  <div
                    key={index}
                    style={{
                      ...styles.dayCell,
                      ...(day.isToday ? styles.todayDay : {}),
                      ...(day.isCurrentMonth ? styles.currentMonthDay : styles.otherMonthDay)
                    }}
                    onMouseEnter={(e) => {
                      if (!day.isToday) {
                        (e.currentTarget as HTMLElement).style.backgroundColor = '#f3f4f6';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!day.isToday) {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'white';
                      }
                    }}
                  >
                    {day.date}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CSS Animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default TeacherDashboard;