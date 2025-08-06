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
      // Try teacher login first
      await teacherLogin(email, password);
    } catch (error) {
      try {
        // If teacher login fails, try student login
        await login(email, password);
      } catch (loginError: any) {
        console.error('Login error:', loginError);
        setValidationErrors({ password: loginError.toString() });
      }
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
      backgroundImage: 'url(/SMKMetland.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 0,
      padding: '120px 16px 16px 16px',
      boxSizing: 'border-box',
      overflowX: 'hidden',
      overflowY: 'auto',
      position: 'relative'
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      zIndex: 0
    },
    sponsorLogos: {
      position: 'absolute',
      top: '40px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '30px',
      alignItems: 'center',
      zIndex: 2,
      flexWrap: 'wrap',
      justifyContent: 'center',
      padding: '0 20px'
    },
    logoImage: {
      height: '80px',
      width: 'auto',
      objectFit: 'contain'
    },
    loginCard: {
      backgroundColor: 'rgba(45, 125, 122, 0.80)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '50px',
      width: '100%',
      maxWidth: '650px',
      minWidth: '480px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'relative',
      margin: '0 auto',
      boxSizing: 'border-box',
      zIndex: 1
    },
    loginTitle: {
      fontSize: '32px',
      fontWeight: '700',
      color: 'white',
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
      padding: '18px 20px 18px 52px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
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
      width: '16px',
      height: '16px',
      accentColor: '#22c55e'
    },
    checkboxLabel: {
      fontSize: '14px',
      color: 'white',
      cursor: 'pointer'
    },
    loginButton: {
      backgroundColor: '#799EFF',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '14px 24px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
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
      color: '#22c55e',
      textDecoration: 'underline',
      cursor: 'pointer',
      fontWeight: '600'
    },
    errorContainer: {
      backgroundColor: 'rgba(254, 242, 242, 0.95)',
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
      color: '#fecaca',
      fontSize: '12px',
      marginTop: '4px',
      marginLeft: '4px'
    },
    loadingButton: {
      backgroundColor: '#6b7280',
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
        padding: isSmallMobile ? '120px 8px 8px 8px' : isMobile ? '140px 12px 12px 12px' : isTablet ? '150px 16px 16px 16px' : '160px 16px 16px 16px',
        minHeight: '100vh'
      },
      sponsorLogos: {
        ...styles.sponsorLogos,
        top: isSmallMobile ? '20px' : isMobile ? '30px' : '40px',
        gap: isSmallMobile ? '15px' : isMobile ? '20px' : '30px'
      },
      logoImage: {
        ...styles.logoImage,
        height: isSmallMobile ? '60px' : isMobile ? '70px' : '80px'
      },
      loginCard: {
        ...styles.loginCard,
        padding: isSmallMobile ? '30px' : isMobile ? '40px' : isTablet ? '45px' : '50px',
        maxWidth: isSmallMobile ? '95%' : isMobile ? '90%' : isTablet ? '550px' : '600px',
        minWidth: isSmallMobile ? '320px' : '450px'
      },
      loginTitle: {
        ...styles.loginTitle,
        fontSize: isSmallMobile ? '24px' : isMobile ? '28px' : '32px'
      },
      input: {
        ...styles.input,
        fontSize: isSmallMobile ? '16px' : isMobile ? '16px' : '16px',
        padding: isSmallMobile ? '16px 18px 16px 48px' : isMobile ? '17px 19px 17px 50px' : '18px 20px 18px 52px'
      },
      loginButton: {
        ...styles.loginButton,
        fontSize: isSmallMobile ? '14px' : '16px',
        padding: isSmallMobile ? '12px 20px' : '14px 24px'
      },
      checkbox: {
        ...styles.checkbox,
        width: isSmallMobile ? '14px' : '16px',
        height: isSmallMobile ? '14px' : '16px'
      },
      checkboxLabel: {
        ...styles.checkboxLabel,
        fontSize: isSmallMobile ? '12px' : '14px'
      }
    };
  };

  const responsiveStyles = getResponsiveStyles();

  return (
    <div style={responsiveStyles.container}>
      <div style={styles.overlay}></div>
      
      {/* Sponsor Logos */}
      <div style={responsiveStyles.sponsorLogos}>
        <img src="/lomba.png" alt="INFRA Competition" style={responsiveStyles.logoImage} />
        {/* Add other sponsor logos as needed */}
      </div>

      {/* Login Card */}
      <div style={responsiveStyles.loginCard}>
        <h2 style={responsiveStyles.loginTitle}>Login</h2>
        
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
              placeholder="Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={responsiveStyles.input}
              onFocus={(e) => (e.target as HTMLInputElement).style.boxShadow = '0 0 0 2px rgba(34, 197, 94, 0.5)'}
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
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={responsiveStyles.input}
              onFocus={(e) => (e.target as HTMLInputElement).style.boxShadow = '0 0 0 2px rgba(34, 197, 94, 0.5)'}
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
              Show Password
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
                (e.target as HTMLButtonElement).style.backgroundColor = '#6B8EFF';
                (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
                (e.target as HTMLButtonElement).style.boxShadow = '0 8px 25px rgba(121, 158, 255, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                (e.target as HTMLButtonElement).style.backgroundColor = '#799EFF';
                (e.target as HTMLButtonElement).style.transform = 'translateY(0px)';
                (e.target as HTMLButtonElement).style.boxShadow = 'none';
              }
            }}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>

          {/* Signup Link */}
          <p style={styles.signupText}>
            Don't Have an account yet?{' '}
            <span style={styles.signupLink} onClick={handleSignUpClick}>Sign Up</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;