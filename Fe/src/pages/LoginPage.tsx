import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { CSSProperties } from 'react';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, teacherLogin, isAuthenticated, isTeacher, error, clearError } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberPassword, setRememberPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{email?: string, password?: string}>({});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (isTeacher) {
        navigate('/teacher/dashboard', { replace: true });
      } else {
        const from = location.state?.from?.pathname || '/home';
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, isTeacher, navigate, location]);

  // Clear errors when component mounts or inputs change
  useEffect(() => {
    clearError();
    setValidationErrors({});
  }, [email, password, clearError]);

  // Handle window resize for responsiveness
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const validateForm = () => {
    const errors: {email?: string, password?: string} = {};
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Check if this is a teacher email (guru@gmail.com)
      if (email === 'guru@gmail.com' || email === 'ms.aurel@gmail.com') {
        // Teacher login using AuthContext
        await teacherLogin(email, password);
        // Navigation will be handled by useEffect above
      } else {
        // Regular student login
        await login(email, password);
        // Navigation will be handled by useEffect above
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setValidationErrors({ password: error.toString() });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  const styles: Record<string, CSSProperties> = {
    container: {
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 0,
      padding: '16px',
      boxSizing: 'border-box',
      overflowX: 'hidden',
      overflowY: 'auto'
    },
    loginCard: {
      backgroundColor: '#799EFF',
      borderRadius: '16px',
      padding: '40px',
      width: '100%',
      maxWidth: '400px',
      minWidth: '280px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      margin: '0 auto',
      boxSizing: 'border-box'
    },
    loginTitle: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#000000ff',
      textAlign: 'center',
      marginBottom: '32px',
      marginTop: 0,
      marginLeft: 0,
      marginRight: 0
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    inputGroup: {
      position: 'relative'
    },
    inputIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af',
      zIndex: 1
    },
    input: {
      width: '100%',
      padding: '12px 16px 12px 48px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      backgroundColor: 'white',
      color: '#374151',
      outline: 'none',
      boxSizing: 'border-box',
      transition: 'box-shadow 0.2s'
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginTop: '8px'
    },
    checkbox: {
      width: '12px',
      height: '12px',
      accentColor: '#fbbf24'
    },
    checkboxLabel: {
      fontSize: '12px',
      color: 'white',
      cursor: 'pointer'
    },
    loginButton: {
      backgroundColor: '#FFDE63',
      color: '#1f2937',
      border: 'none',
      borderRadius: '8px',
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      marginTop: '8px'
    },
    signupText: {
      fontSize: '14px',
      color: 'white',
      textAlign: 'center',
      marginTop: '16px',
      margin: 0
    },
    signupLink: {
      color: '#fbbf24',
      textDecoration: 'underline',
      cursor: 'pointer'
    },
    errorContainer: {
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    errorText: {
      color: '#dc2626',
      fontSize: '14px',
      margin: 0
    },
    fieldError: {
      color: '#dc2626',
      fontSize: '12px',
      marginTop: '4px',
      marginLeft: '4px'
    },
    loadingButton: {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed'
    }
  };

  // Dynamic styles based on screen size
  const getResponsiveStyles = () => {
    const isMobile = windowWidth <= 480;
    const isTablet = windowWidth <= 768;
    const isSmallMobile = windowWidth <= 360;
    
    return {
      ...styles,
      container: {
        ...styles.container,
        padding: isSmallMobile ? '8px' : isMobile ? '12px' : isTablet ? '16px' : '20px',
        minHeight: '100vh'
      },
      loginCard: {
        ...styles.loginCard,
        padding: isSmallMobile ? '16px' : isMobile ? '20px' : isTablet ? '28px' : '40px',
        maxWidth: isSmallMobile ? '95%' : isMobile ? '90%' : isTablet ? '350px' : '400px',
        minWidth: isSmallMobile ? '280px' : '300px'
      },
      loginTitle: {
        ...styles.loginTitle,
        fontSize: isSmallMobile ? '20px' : isMobile ? '22px' : '24px'
      },
      input: {
        ...styles.input,
        fontSize: isSmallMobile ? '16px' : isMobile ? '16px' : '14px',
        padding: isSmallMobile ? '10px 14px 10px 44px' : '12px 16px 12px 48px'
      },
      loginButton: {
        ...styles.loginButton,
        fontSize: isSmallMobile ? '14px' : '16px',
        padding: isSmallMobile ? '10px 20px' : '12px 24px'
      },
      checkbox: {
        ...styles.checkbox,
        width: isSmallMobile ? '14px' : isMobile ? '16px' : '18px',
        height: isSmallMobile ? '14px' : isMobile ? '16px' : '18px',
        transform: isSmallMobile ? 'scale(1)' : isMobile ? 'scale(1.1)' : 'scale(1.3)'
      },
      checkboxLabel: {
        ...styles.checkboxLabel,
        fontSize: isSmallMobile ? '11px' : isMobile ? '12px' : '14px'
      }
    };
  };

  const responsiveStyles = getResponsiveStyles();

  return (
    <div style={responsiveStyles.container}>
      {/* Lomba Image */}
      <div style={{
        marginBottom: windowWidth <= 480 ? '32px' : '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 16px'
      }}>
        <img 
          src="/lomba.png" 
          alt="Lomba" 
          style={{
            width: windowWidth <= 360 ? '280px' : 
                   windowWidth <= 480 ? '350px' : 
                   windowWidth <= 768 ? '500px' : 
                   windowWidth <= 1024 ? '600px' : '700px',
            height: 'auto',
            maxWidth: '95%',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* Login Card */}
      <div style={responsiveStyles.loginCard}>
        <h2 style={responsiveStyles.loginTitle} className="poppins-bold">Login</h2>
        
        {/* Error Display */}
        {error && (
          <div style={styles.errorContainer}>
            <AlertCircle size={16} color="#dc2626" />
            <p style={styles.errorText}>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Email Input */}
          <div style={styles.inputGroup}>
            <User size={20} style={styles.inputIcon} />
            <input
              type="email"
              placeholder="enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={responsiveStyles.input}
              onFocus={(e) => (e.target as HTMLInputElement).style.boxShadow = '0 0 0 2px rgba(251, 191, 36, 0.5)'}
              onBlur={(e) => (e.target as HTMLInputElement).style.boxShadow = 'none'}
              disabled={isSubmitting}
            />
            {validationErrors.email && (
              <div style={styles.fieldError}>{validationErrors.email}</div>
            )}
          </div>

          {/* Password Input */}
          <div style={styles.inputGroup}>
            <Lock size={20} style={styles.inputIcon} />
            <input
              type="password"
              placeholder="enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={responsiveStyles.input}
              onFocus={(e) => (e.target as HTMLInputElement).style.boxShadow = '0 0 0 2px rgba(251, 191, 36, 0.5)'}
              onBlur={(e) => (e.target as HTMLInputElement).style.boxShadow = 'none'}
              disabled={isSubmitting}
            />
            {validationErrors.password && (
              <div style={styles.fieldError}>{validationErrors.password}</div>
            )}
          </div>

          {/* Remember Password Checkbox */}
          <div style={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="rememberPassword"
              checked={rememberPassword}
              onChange={(e) => setRememberPassword(e.target.checked)}
              style={responsiveStyles.checkbox}
            />
            <label htmlFor="rememberPassword" style={responsiveStyles.checkboxLabel}>
              Save Password
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              ...responsiveStyles.loginButton,
              ...(isSubmitting ? styles.loadingButton : {})
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
                (e.target as HTMLButtonElement).style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                (e.target as HTMLButtonElement).style.transform = 'translateY(0px)';
                (e.target as HTMLButtonElement).style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
              }
            }}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>

          {/* Signup Link */}
          <p style={styles.signupText}>
            Don't Have an account yet? {' '}
            <span style={styles.signupLink} onClick={handleSignUpClick}>Sign Up</span>
          </p>
          

        </form>
      </div>
    </div>
  );
};

export default LoginPage;