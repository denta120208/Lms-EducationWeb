import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, AlertCircle } from 'lucide-react';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { CSSProperties } from 'react';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when inputs change
  useEffect(() => {
    setError(null);
    setValidationErrors({});
  }, [fullName, email, password, confirmPassword]);

  // Handle window resize for responsiveness
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const validateForm = () => {
    const errors: {
      fullName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    
    if (!fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
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
    
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
    setError(null);
    setSuccess(null);
    
    try {
      await authAPI.register({
        name: fullName,
        email,
        password
      });
      
      setSuccess('Registration successful! Please login with your credentials.');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error: any) {
      setError(error.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
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
    logo: {
      width: '60px',
      height: '60px',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    logoShield: {
      width: '80px',
      height: '80px',
      position: 'relative',
      background: 'linear-gradient(135deg, #ef4444 0%, #ef4444 50%, #3b82f6 50%, #3b82f6 100%)',
      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
      borderRadius: '8px'
    },
    logoInner: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '40px',
      height: '40px',
      backgroundColor: 'white',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: 'bold',
      color: '#3b82f6'
    },
    loginCard: {
      backgroundColor: '#799EFF',
      borderRadius: '16px',
      padding: '40px',
      width: '100%',
      maxWidth: '400px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      position: 'relative'
    },
    loginTitle: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#000000ff',
      textAlign: 'center',
      marginBottom: '32px',
      margin: 0
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
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
    signupCard: {
      backgroundColor: '#799EFF',
      borderRadius: '16px',
      padding: '24px',
      width: '100%',
      maxWidth: '400px',
      minWidth: '280px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      margin: '0 auto',
      boxSizing: 'border-box'
    },
    signupTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#000000ff',
      textAlign: 'center',
      marginBottom: '24px',
      marginTop: 0,
      marginLeft: 0,
      marginRight: 0
    },
    signupButton: {
      backgroundColor: '#FFDE63',
      color: '#1f2937',
      border: 'none',
      borderRadius: '10px',
      padding: '16px 28px',
      fontSize: '18px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      marginTop: '12px'
    },
    loginText: {
      fontSize: '16px',
      color: 'white',
      textAlign: 'center',
      marginTop: '20px',
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0
    },
    loginLink: {
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
    successContainer: {
      backgroundColor: '#f0fdf4',
      border: '1px solid #bbf7d0',
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
    successText: {
      color: '#16a34a',
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
      signupCard: {
        ...styles.signupCard,
        padding: isSmallMobile ? '16px' : isMobile ? '20px' : isTablet ? '22px' : '24px',
        maxWidth: isSmallMobile ? '95%' : isMobile ? '90%' : isTablet ? '350px' : '400px',
        minWidth: isSmallMobile ? '280px' : '300px'
      },
      logo: {
        ...styles.logo,
        width: isSmallMobile ? '40px' : isMobile ? '50px' : '60px',
        height: isSmallMobile ? '40px' : isMobile ? '50px' : '60px',
        marginBottom: isSmallMobile ? '12px' : isMobile ? '16px' : '24px'
      },
      signupTitle: {
        ...styles.signupTitle,
        fontSize: isSmallMobile ? '18px' : isMobile ? '19px' : '20px'
      },
      input: {
        ...styles.input,
        fontSize: isSmallMobile ? '16px' : isMobile ? '16px' : '14px',
        padding: isSmallMobile ? '10px 14px 10px 44px' : '12px 16px 12px 48px'
      },
      signupButton: {
        ...styles.signupButton,
        fontSize: isSmallMobile ? '16px' : '18px',
        padding: isSmallMobile ? '14px 24px' : '16px 28px'
      },
      form: {
        ...styles.form,
        gap: isSmallMobile ? '14px' : '16px'
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
      {/* Logo */}
      <div style={responsiveStyles.logo}>
        <img 
          src="/logo.png" 
          alt="Arma Garage Logo" 
          style={{
            width: windowWidth <= 480 ? '50px' : '60px', 
            height: windowWidth <= 480 ? '50px' : '60px'
          }}
        />
      </div>

      {/* Sign Up Card */}
      <div style={responsiveStyles.signupCard}>
        <h2 style={responsiveStyles.signupTitle} className="poppins-bold">Sign Up</h2>
        
        {/* Error Display */}
        {error && (
          <div style={styles.errorContainer}>
            <AlertCircle size={16} color="#dc2626" />
            <p style={styles.errorText}>{error}</p>
          </div>
        )}
        
        {/* Success Display */}
        {success && (
          <div style={styles.successContainer}>
            <AlertCircle size={16} color="#16a34a" />
            <p style={styles.successText}>{success}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={responsiveStyles.form}>
          {/* Full Name Input */}
          <div style={styles.inputGroup}>
            <User size={20} style={styles.inputIcon} />
            <input
              type="text"
              placeholder="enter name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={responsiveStyles.input}
              onFocus={(e) => (e.target as HTMLInputElement).style.boxShadow = '0 0 0 2px rgba(251, 191, 36, 0.5)'}
              onBlur={(e) => (e.target as HTMLInputElement).style.boxShadow = 'none'}
              disabled={isSubmitting}
            />
            {validationErrors.fullName && (
              <div style={styles.fieldError}>{validationErrors.fullName}</div>
            )}
          </div>

          {/* Email Input */}
          <div style={styles.inputGroup}>
            <Mail size={20} style={styles.inputIcon} />
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
              type={showPassword ? "text" : "password"}
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

          {/* Confirm Password Input */}
          <div style={styles.inputGroup}>
            <Lock size={20} style={styles.inputIcon} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={responsiveStyles.input}
              onFocus={(e) => (e.target as HTMLInputElement).style.boxShadow = '0 0 0 2px rgba(251, 191, 36, 0.5)'}
              onBlur={(e) => (e.target as HTMLInputElement).style.boxShadow = 'none'}
              disabled={isSubmitting}
            />
            {validationErrors.confirmPassword && (
              <div style={styles.fieldError}>{validationErrors.confirmPassword}</div>
            )}
          </div>

          {/* Show Password Checkbox */}
          <div style={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              style={responsiveStyles.checkbox}
            />
            <label htmlFor="showPassword" style={responsiveStyles.checkboxLabel}>
              Show Password
            </label>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              ...responsiveStyles.signupButton,
              ...(isSubmitting ? styles.loadingButton : {})
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                (e.target as HTMLButtonElement).style.backgroundColor = '#f59e0b';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                (e.target as HTMLButtonElement).style.backgroundColor = '#FFDE63';
              }
            }}
          >
            {isSubmitting ? 'Signing Up...' : 'Sign Up'}
          </button>

          {/* Login Link */}
          <p style={styles.loginText}>
            already have an account? {' '}
            <span style={styles.loginLink} onClick={handleLoginClick}>Login</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;