import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Grid3X3, BookOpen, User, Bell, LogOut, AlertCircle, Settings, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load dashboard data
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        const data = await authAPI.getDashboard();
        setDashboardData(data);
      } catch (error: any) {
        setError(error.message || 'Failed to load dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // Handle window resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Auto close sidebar on desktop
      if (window.innerWidth > 768) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // Use courses from API or fallback to default
  const courses = dashboardData?.courses || [
    {
      id: 1,
      title: 'Mathematics',
      instructor: 'Mr. Agus',
      progress: 0,
    },
    {
      id: 2,
      title: 'Science',
      instructor: 'Mr. Agus',
      progress: 0,
    },
    {
      id: 3,
      title: 'Social Science',
      instructor: 'Mr. Agus',
      progress: 0,
    },
    {
      id: 4,
      title: 'English',
      instructor: 'Mr. Agus',
      progress: 0,
    }
  ];

  const filteredCourses = courses.filter((course: any) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Responsive breakpoints
  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth <= 1024;
  const isSmallMobile = windowWidth <= 480;

  const styles = {
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
      position: 'relative'
    },
    sidebar: {
      width: isMobile ? '100%' : '64px',
      height: isMobile ? 'auto' : '100vh',
      backgroundColor: '#3b82f6',
      display: 'flex',
      flexDirection: isMobile ? 'row' : 'column',
      alignItems: 'center',
      justifyContent: isMobile ? 'space-around' : 'flex-start',
      paddingTop: isMobile ? '12px' : '24px',
      paddingBottom: isMobile ? '12px' : '24px',
      gap: isMobile ? '16px' : '32px',
      position: isMobile ? 'fixed' : 'static',
      bottom: isMobile ? 0 : 'auto',
      left: isMobile ? 0 : 'auto',
      zIndex: isMobile ? 1000 : 'auto',
      boxShadow: isMobile ? '0 -2px 10px rgba(0,0,0,0.1)' : 'none'
    },
    sidebarIcon: {
      padding: isSmallMobile ? '6px' : '8px',
      backgroundColor: '#2563eb',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: isSmallMobile ? '36px' : '40px',
      minHeight: isSmallMobile ? '36px' : '40px'
    },
    sidebarIconHover: {
      padding: isSmallMobile ? '6px' : '8px',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.2s',
      minWidth: isSmallMobile ? '36px' : '40px',
      minHeight: isSmallMobile ? '36px' : '40px'
    },
    mainContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      width: isMobile ? '100%' : 'calc(100% - 64px)',
      height: isMobile ? 'calc(100vh - 60px)' : '100vh',
      overflow: 'auto',
      paddingBottom: isMobile ? '60px' : '0'
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
    headerTitle: {
      fontSize: isSmallMobile ? '16px' : isMobile ? '18px' : '20px',
      fontWeight: '500',
      color: '#374151',
      margin: 0,
      flex: 1,
      minWidth: '200px'
    },
    headerName: {
      fontWeight: '600'
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: isSmallMobile ? '8px' : '16px',
      flexShrink: 0
    },
    userAvatar: {
      width: isSmallMobile ? '28px' : '32px',
      height: isSmallMobile ? '28px' : '32px',
      backgroundColor: '#4b5563',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    },
    content: {
      padding: isSmallMobile ? '16px' : isMobile ? '20px' : '32px',
      flex: 1,
      overflowY: 'auto'
    },
    coursesTitle: {
      fontSize: isSmallMobile ? '18px' : '20px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: isSmallMobile ? '16px' : '24px',
      marginTop: 0,
      marginLeft: 0,
      marginRight: 0
    },
    courseOverview: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      padding: isSmallMobile ? '16px' : isMobile ? '20px' : '24px'
    },
    overviewTitle: {
      fontSize: isSmallMobile ? '16px' : '18px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: isSmallMobile ? '12px' : '16px',
      marginTop: 0,
      marginLeft: 0,
      marginRight: 0
    },
    filterSection: {
      display: 'flex',
      flexDirection: isSmallMobile ? 'column' : 'row',
      gap: isSmallMobile ? '12px' : '16px',
      marginBottom: isSmallMobile ? '16px' : '24px',
      marginTop: 0,
      marginLeft: 0,
      marginRight: 0
    },
    allButton: {
      padding: '8px 16px',
      backgroundColor: '#f3f4f6',
      color: '#374151',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'background-color 0.2s'
    },
    searchInput: {
      padding: '8px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s',
      flex: isSmallMobile ? 1 : 'none',
      minWidth: isSmallMobile ? '100%' : '200px'
    },
    courseGrid: {
      display: 'grid',
      gridTemplateColumns: isSmallMobile 
        ? '1fr' 
        : isMobile 
          ? 'repeat(auto-fit, minmax(250px, 1fr))' 
          : 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: isSmallMobile ? '16px' : isMobile ? '20px' : '24px'
    },
    courseCard: {
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      overflow: 'hidden',
      transition: 'box-shadow 0.2s',
      cursor: 'pointer'
    },
    courseImage: {
      height: isSmallMobile ? '120px' : isMobile ? '140px' : '160px',
      background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
      position: 'relative',
      overflow: 'hidden'
    },
    geometricPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 0.3
    },
    shape1: {
      position: 'absolute',
      top: '16px',
      left: '16px',
      width: '32px',
      height: '32px',
      backgroundColor: '#4b5563',
      transform: 'rotate(45deg)'
    },
    shape2: {
      position: 'absolute',
      top: '32px',
      right: '24px',
      width: '24px',
      height: '24px',
      backgroundColor: '#374151',
      transform: 'rotate(12deg)'
    },
    shape3: {
      position: 'absolute',
      bottom: '24px',
      left: '32px',
      width: '40px',
      height: '40px',
      backgroundColor: '#4b5563',
      transform: 'rotate(-12deg)'
    },
    shape4: {
      position: 'absolute',
      bottom: '16px',
      right: '16px',
      width: '48px',
      height: '48px',
      backgroundColor: '#374151',
      transform: 'rotate(45deg)'
    },
    courseInfo: {
      padding: isSmallMobile ? '12px' : '16px'
    },
    courseTitle: {
      fontSize: isSmallMobile ? '14px' : '16px',
      fontWeight: '500',
      color: '#2563eb',
      marginBottom: '4px',
      marginTop: 0,
      marginLeft: 0,
      marginRight: 0
    },
    courseInstructor: {
      fontSize: isSmallMobile ? '12px' : '14px',
      color: '#6b7280',
      marginBottom: '8px',
      marginTop: 0,
      marginLeft: 0,
      marginRight: 0
    },
    courseProgress: {
      fontSize: isSmallMobile ? '12px' : '14px',
      color: '#9ca3af',
      margin: 0
    }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarIcon}>
          <Home size={isSmallMobile ? 20 : 24} color="white" />
        </div>
        <div 
          style={styles.sidebarIconHover}
          onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#2563eb'}
          onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'transparent'}
        >
          <Grid3X3 size={isSmallMobile ? 20 : 24} color="white" />
        </div>
        <div 
          style={styles.sidebarIconHover}
          onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#2563eb'}
          onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'transparent'}
        >
          <Settings size={isSmallMobile ? 20 : 24} color="white" />
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>
            Welcome, <span style={styles.headerName} className="poppins-semibold">{user?.name || 'Student'}</span>
          </h1>
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
          {/* Error Display */}
          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} color="#dc2626" />
              <p style={{ color: '#dc2626', fontSize: '14px', margin: 0 }}>{error}</p>
            </div>
          )}

          <h2 style={styles.coursesTitle}>My Courses</h2>
          
          {/* Loading State */}
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
          ) : (
            <>
              {/* Course Overview Section */}
              <div style={styles.courseOverview}>
            <h3 style={styles.overviewTitle}>Course overview</h3>
            
            {/* Filter and Search */}
            <div style={styles.filterSection}>
              <button 
                style={styles.allButton}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              >
                All
              </button>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>

            {/* Course Grid */}
            <div style={styles.courseGrid}>
              {filteredCourses.map((course) => (
                <div 
                  key={course.id} 
                  style={styles.courseCard}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                >
                  {/* Course Image with Geometric Pattern */}
                  <div style={styles.courseImage}>
                    <div style={styles.geometricPattern}>
                      <div style={styles.shape1}></div>
                      <div style={styles.shape2}></div>
                      <div style={styles.shape3}></div>
                      <div style={styles.shape4}></div>
                    </div>
                  </div>
                  
                  {/* Course Info */}
                  <div style={styles.courseInfo}>
                    <h4 style={styles.courseTitle}>{course.title}</h4>
                    <p style={styles.courseInstructor}>{course.instructor || 'Mr. Agus'}</p>
                    <p style={styles.courseProgress}>
                      {typeof course.progress === 'number' ? `${course.progress}% Complete` : course.progress}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
            </>
          )}
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

export default DashboardPage;