import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Grid3X3, BookOpen, User, Bell, Play, Calendar, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { CSSProperties } from 'react';

const HomePage = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  const learningActivities = [
    {
      id: 1,
      status: 'Being studied',
      subject: 'Mathematics / Integral material forum',
      action: 'Continue'
    },
    {
      id: 2,
      status: 'Being studied',
      subject: 'Mathematics / Quiz - Integral',
      action: 'Continue'
    },
    {
      id: 3,
      status: 'Being worked on',
      subject: 'Mathematics / Forum Exam',
      action: 'Continue'
    }
  ];

  // Responsive breakpoints (same as Dashboard)
  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth <= 1024;
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
    activitiesSection: {
      display: 'grid',
      gridTemplateColumns: isSmallMobile ? '1fr' : isMobile ? '1fr' : isTablet ? '1fr 1fr' : '1fr 1fr',
      gap: isSmallMobile ? '16px' : isMobile ? '20px' : '32px',
      maxWidth: '1200px'
    },
    activityCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: isSmallMobile ? '16px' : isMobile ? '20px' : '24px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb'
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '20px'
    },
    cardIcon: {
      padding: '8px',
      backgroundColor: '#1f2937',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    cardTitle: {
      fontSize: isSmallMobile ? '16px' : '18px',
      fontWeight: '600',
      color: '#374151',
      margin: 0
    },
    activityList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    activityItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: isSmallMobile ? '12px' : '16px',
      backgroundColor: '#f9fafb',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      flexDirection: isSmallMobile ? 'column' : 'row',
      gap: isSmallMobile ? '8px' : '0'
    },
    activityInfo: {
      flex: 1
    },
    activityStatus: {
      fontSize: isSmallMobile ? '13px' : '14px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '4px',
      margin: 0
    },
    activitySubject: {
      fontSize: isSmallMobile ? '12px' : '13px',
      color: '#6b7280',
      margin: 0
    },
    continueButton: {
      backgroundColor: 'transparent',
      color: '#3b82f6',
      border: 'none',
      fontSize: isSmallMobile ? '13px' : '14px',
      fontWeight: '500',
      cursor: 'pointer',
      textDecoration: 'underline',
      padding: isSmallMobile ? '2px 4px' : '4px 8px'
    },
    viewAllButton: {
      display: 'block',
      margin: isSmallMobile ? '16px auto 0' : '20px auto 0',
      backgroundColor: 'transparent',
      color: '#6b7280',
      border: 'none',
      fontSize: isSmallMobile ? '13px' : '14px',
      cursor: 'pointer',
      textDecoration: 'underline'
    },
    noActivity: {
      textAlign: 'center',
      color: '#9ca3af',
      fontSize: isSmallMobile ? '13px' : '14px',
      padding: isSmallMobile ? '20px 16px' : '40px 20px'
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
          onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = '#2563eb'}
          onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
          onClick={() => handleNavigation('/grid')}
          title="Grid View"
        >
          <Grid3X3 size={isSmallMobile ? 20 : 24} color="white" />
        </div>
        <div 
          style={styles.sidebarIconHover}
          onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = '#2563eb'}
          onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
          onClick={() => handleNavigation('/dashboard')}
          title="Dashboard"
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
              Welcome, <span style={{color: '#000000ff'}} className="poppins-semibold">{user?.name || 'Student'}</span>
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
          <h2 style={styles.pageTitle}>Home</h2>
          
          <div style={styles.activitiesSection}>
            {/* Learning Activities */}
            <div style={styles.activityCard}>
              <div style={styles.cardHeader}>
                <div style={styles.cardIcon}>
                  <Play size={16} color="white" />
                </div>
                <h3 style={styles.cardTitle}>learning activities</h3>
              </div>
              
              <div style={styles.activityList}>
                {learningActivities.map((activity) => (
                  <div key={activity.id} style={styles.activityItem}>
                    <div style={styles.activityInfo}>
                      <p style={styles.activityStatus}>{activity.status}</p>
                      <p style={styles.activitySubject}>{activity.subject}</p>
                    </div>
                    <button 
                      style={styles.continueButton}
                      onMouseEnter={(e) => (e.target as HTMLButtonElement).style.color = '#1d4ed8'}
                      onMouseLeave={(e) => (e.target as HTMLButtonElement).style.color = '#3b82f6'}
                    >
                      {activity.action}
                    </button>
                  </div>
                ))}
              </div>
              
              <button style={styles.viewAllButton}>
                in full
              </button>
            </div>

            {/* Other Activities */}
            <div style={styles.activityCard}>
              <div style={styles.cardHeader}>
                <div style={styles.cardIcon}>
                  <Calendar size={16} color="white" />
                </div>
                <h3 style={styles.cardTitle}>other activities</h3>
              </div>
              
              <div style={styles.noActivity}>
                No activity yet
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;