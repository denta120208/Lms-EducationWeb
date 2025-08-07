import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, GraduationCap, Users, Trophy, MapPin, Phone, Mail, MessageCircle, BookOpen } from 'lucide-react';
import type { CSSProperties } from 'react';
// Import social media icons
import WhatsAppIcon from '../assets/WhatsApp.svg';
import InstagramIcon from '../assets/InstaGram.svg';
import FacebookIcon from '../assets/FaceBook.svg';
import YouTubeIcon from '../assets/YouTube.svg';
import TikTokIcon from '../assets/TikTok.svg';
// Import language flags
import EnFlag from '../assets/en.png';
import IdFlag from '../assets/id 1.png';

const Index = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredDropdown, setHoveredDropdown] = useState('');
  const [hoveredSubDropdown, setHoveredSubDropdown] = useState('');
  const [isSocialBarVisible, setIsSocialBarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px
        setIsSocialBarVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsSocialBarVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMouseEnter = (dropdown: string) => {
    setHoveredDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    setHoveredDropdown('');
  };

  const handleDropdownItemHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.backgroundColor = '#f0f9f9';
    e.currentTarget.style.color = '#00bcd4';
    e.currentTarget.style.paddingLeft = '1.25rem';
  };

  const handleDropdownItemLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.backgroundColor = '';
    e.currentTarget.style.color = '#035757';
    e.currentTarget.style.paddingLeft = '0.75rem';
  };

  const handleNavLinkHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.color = '#00bcd4';
  };

  const handleNavLinkLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.color = '#035757';
  };

  const handleSubDropdownHover = (subDropdown: string) => {
    setHoveredSubDropdown(subDropdown);
  };

  const handleSubDropdownLeave = () => {
    setHoveredSubDropdown('');
  };

  const handleDropdownItemWithSubmenuHover = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.backgroundColor = '#f0f9f9';
    e.currentTarget.style.color = '#00bcd4';
    // Change text color in the span
    const span = e.currentTarget.querySelector('span');
    if (span) {
      span.style.color = '#00bcd4';
    }
  };

  const handleDropdownItemWithSubmenuLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.backgroundColor = '';
    e.currentTarget.style.color = '#035757';
    // Reset text color in the span
    const span = e.currentTarget.querySelector('span');
    if (span) {
      span.style.color = '#035757';
    }
  };

  const styles: Record<string, CSSProperties> = {
    container: {
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      margin: 0,
      padding: 0,
      paddingTop: isSocialBarVisible ? (isMobile ? '96px' : '104px') : '64px', // Adjust based on social bar visibility
      boxSizing: 'border-box',
      fontFamily: '"Inter", sans-serif',
      overflowX: 'hidden',
    },
    // Top social bar
    socialBar: {
      backgroundColor: '#2d5e5e',
      padding: isMobile ? '0.3rem 0' : '0.5rem 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft: isMobile ? '1rem' : '2rem',
      paddingRight: isMobile ? '1rem' : '2rem',
      fontSize: isMobile ? '0.8rem' : '1rem',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1001,
      height: isMobile ? '32px' : '40px',
      transform: isSocialBarVisible ? 'translateY(0)' : 'translateY(-100%)',
      transition: 'transform 0.3s ease',
    },
    socialLinks: {
      display: 'flex',
      gap: isMobile ? '0.5rem' : '1rem',
      alignItems: 'center',
    },
    socialLink: {
      color: 'white',
      fontSize: '0.9rem',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '0.3rem',
      transition: 'opacity 0.2s',
    },
    socialIconImage: {
      width: '16px',
      height: '16px',
      filter: 'brightness(0) invert(1)',
    },
    langSwitch: {
      display: 'flex',
      gap: '0.5rem',
    },
    flagButton: {
      width: isMobile ? '16px' : '24px',
      height: isMobile ? '12px' : '16px',
      padding: 0,
      border: 'none',
      cursor: 'pointer',
      borderRadius: '2px',
      overflow: 'hidden',
      transition: 'transform 0.2s',
      minWidth: isMobile ? '16px' : '24px',
      minHeight: isMobile ? '12px' : '16px',
      maxWidth: isMobile ? '24px' : '24px',
      maxHeight: isMobile ? '12px' : '16px',
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 0,
    },
    flagIcon: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      maxWidth: isMobile ? '16px' : '24px',
      maxHeight: isMobile ? '12px' : '16px',
      minWidth: isMobile ? '16px' : '24px',
      minHeight: isMobile ? '12px' : '16px',
      boxSizing: 'border-box',
      display: 'block',
      margin: 0,
      padding: 0,
    },
    // Header
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      position: 'fixed',
      top: isSocialBarVisible ? (isMobile ? '32px' : '40px') : '0px', // Adjust based on social bar visibility
      left: 0,
      right: 0,
      zIndex: 1000,
      width: '100%',
      transition: 'all 0.3s ease',
      height: '64px',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      fontWeight: 700,
      fontSize: '1.5rem',
      color: '#035757',
    },
    logoImage: {
      height: '50px',
      width: 'auto',
    },
    nav: {
      display: 'flex',
      gap: '2rem',
      alignItems: 'center',
    },
    navItem: {
      position: 'relative',
    },
    navLink: {
      color: '#035757',
      fontWeight: 500,
      textDecoration: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '0.3rem',
      padding: '0.5rem 0',
    },
    dropdown: {
      position: 'absolute',
      top: '100%',
      left: 0,
      backgroundColor: 'white',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      borderRadius: '0.375rem',
      minWidth: '220px',
      zIndex: 1000,
      padding: '0.5rem 0',
      transition: 'all 0.3s ease',
      transform: 'translateY(10px)',
      opacity: 0,
      pointerEvents: 'none',
    },
    dropdownVisible: {
      position: 'absolute',
      top: '100%',
      left: 0,
      backgroundColor: 'white',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      borderRadius: '0.375rem',
      minWidth: '220px',
      zIndex: 1000,
      padding: '0.5rem 0',
      transition: 'all 0.3s ease',
      transform: 'translateY(0)',
      opacity: 1,
      pointerEvents: 'auto',
    },
    dropdownItem: {
      padding: '0.75rem 1rem',
      color: '#035757',
      textDecoration: 'none',
      display: 'block',
      transition: 'all 0.2s',
      cursor: 'pointer',
    },
    dropdownItemWithSubmenu: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem 1rem',
      color: '#035757',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textDecoration: 'none',
      width: '100%',
      position: 'relative',
    },
    subDropdown: {
      position: 'absolute',
      left: '100%',
      top: 0,
      backgroundColor: 'white',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      borderRadius: '0.375rem',
      minWidth: '280px',
      zIndex: 1001,
      padding: '0.5rem 0',
      transition: 'all 0.3s ease',
      transform: 'translateX(10px)',
      opacity: 0,
      pointerEvents: 'none',
    },
    subDropdownVisible: {
      position: 'absolute',
      left: '100%',
      top: 0,
      backgroundColor: 'white',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      borderRadius: '0.375rem',
      minWidth: '280px',
      zIndex: 1001,
      padding: '0.5rem 0',
      transition: 'all 0.3s ease',
      transform: 'translateX(0)',
      opacity: 1,
      pointerEvents: 'auto',
    },
    subDropdownItem: {
      padding: '0.75rem 1rem',
      color: '#035757',
      textDecoration: 'none',
      display: 'block',
      transition: 'all 0.2s',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontSize: '0.9rem',
    },
    mobileMenuButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#035757',
      padding: '0.5rem',
    },
    mobileMenu: {
      position: 'fixed',
      top: 0,
      right: 0,
      height: '100vh',
      width: '280px',
      backgroundColor: 'white',
      boxShadow: '-4px 0 6px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      padding: '2rem 1rem',
      transform: isMenuOpen ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    button: {
      backgroundColor: '#035757',
      color: 'white',
      border: 'none',
      borderRadius: '0.375rem',
      padding: '0.75rem 1.5rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s',
      fontSize: '1rem',
      textDecoration: 'none',
      display: 'inline-block',
    },
    // Hero Section
    hero: {
      backgroundImage: 'url("/sekolah.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      position: 'relative',
      height: `calc(100vh - ${isMobile ? '96px' : '104px'})`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-end',
      textAlign: 'center',
      padding: '4rem 2rem',
    },
    heroOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      zIndex: 1,
    },
    heroContent: {
      position: 'relative',
      zIndex: 2,
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-end',
      height: '100%',
      width: '100%',
      paddingBottom: '2rem',
    },
    heroTitle: {
      fontSize: isMobile ? '1.5rem' : '2.5rem',
      fontWeight: 800,
      color: 'white',
      marginBottom: '1rem',
      width: 'auto',
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
      lineHeight: 1.2,
      whiteSpace: isMobile ? 'normal' : 'nowrap',
    },
    heroSubtitle: {
      fontSize: isMobile ? '1.1rem' : '1.5rem',
      color: 'white',
      marginBottom: '0',
      maxWidth: '600px',
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)',
      textAlign: 'center',
      margin: '0 auto',
    },
    heroButton: {
      backgroundColor: '#ff6b35',
      color: 'white',
      border: 'none',
      borderRadius: '0.375rem',
      padding: '1rem 2rem',
      fontWeight: 700,
      cursor: 'pointer',
      fontSize: '1.1rem',
      textTransform: 'uppercase',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
      transition: 'all 0.2s',
      marginTop: '1rem',
    },
    // About Section
    aboutSection: {
      backgroundColor: '#2d5e5e',
      color: 'white',
      padding: isMobile ? '1rem 1rem' : '2rem 2rem',
      marginTop: '-2rem',
    },
    aboutContent: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    aboutTitle: {
      fontSize: isMobile ? '1.5rem' : '2rem',
      fontWeight: 700,
      marginBottom: '0.5rem',
      color: 'white',
    },
    aboutText: {
      fontSize: '1.1rem',
      lineHeight: 1.6,
      color: 'white',
    },
    // Trending Section
    trendingSection: {
      backgroundColor: '#004E4E',
      color: 'white',
      padding: isMobile ? '1rem' : '1rem 2rem',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100vw',
      marginLeft: 'calc(-50vw + 50%)',
      marginRight: 'calc(-50vw + 50%)',
      gap: isMobile ? '1rem' : '0',
    },
    trendingLabel: {
      backgroundColor: '#000000',
      color: 'white',
      padding: '0.5rem 1rem',
      fontSize: '0.9rem',
      fontWeight: 600,
      borderRadius: '0.25rem',
      whiteSpace: 'nowrap',
    },
    trendingContent: {
      flex: 1,
      margin: isMobile ? '0' : '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: isMobile ? '100%' : 'auto',
    },
    trendingText: {
      color: '#ffff00',
      fontSize: isMobile ? '0.9rem' : '1rem',
      fontWeight: 500,
      textAlign: 'center',
      whiteSpace: isMobile ? 'normal' : 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      lineHeight: isMobile ? '1.3' : '1',
    },
    trendingNav: {
      display: 'flex',
      gap: '0.5rem',
    },
    trendingNavButton: {
      backgroundColor: 'transparent',
      border: 'none',
      color: 'white',
      fontSize: '1.2rem',
      cursor: 'pointer',
      padding: '0.5rem',
      borderRadius: '0.25rem',
      transition: 'background-color 0.2s',
    },
    // News Section
    newsSection: {
      padding: '4rem 2rem',
      backgroundColor: '#ffffff',
    },
    newsContent: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    newsTitle: {
      fontSize: isMobile ? '1.8rem' : '2.5rem',
      fontWeight: 700,
      color: '#035757',
      textAlign: 'center',
      marginBottom: '3rem',
    },
    newsGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '2rem',
    },
    newsCard: {
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      padding: '2rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e0e0e0',
      transition: 'transform 0.3s ease',
    },
    newsCardTitle: {
      fontSize: '1.2rem',
      fontWeight: 600,
      color: '#035757',
      marginBottom: '1rem',
    },
    newsCardText: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#64748b',
    },
    // Infographics Section
    infographicsSection: {
      padding: '4rem 2rem',
      backgroundColor: '#EEEEEE',
    },
    infographicsContent: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    infographicsTitle: {
      fontSize: isMobile ? '1.8rem' : '2.5rem',
      fontWeight: 700,
      color: '#035757',
      textAlign: 'center',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      backgroundColor: 'white',
      padding: '1rem 0',
      width: '100vw',
      marginLeft: 'calc(-50vw + 50%)',
      marginRight: 'calc(-50vw + 50%)',
      marginTop: '-4rem',
      marginBottom: '4rem',
    },
    infographicsGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
      gap: isMobile ? '2rem' : '3rem',
      maxWidth: isMobile ? '1200px' : '700px',
      margin: '0 auto',
    },
    infographicCard: {
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    infographicNumber: {
      fontSize: '3.5rem',
      fontWeight: 800,
      color: '#009390',
      marginBottom: '0.5rem',
    },
    infographicLabel: {
      fontSize: '1.2rem',
      color: 'black',
      fontWeight: 600,
    },
    // Programs Section
    programsSection: {
      padding: '4rem 2rem',
      backgroundColor: '#EEEEEE',
    },
    programsTitle: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#035757',
      textAlign: 'center',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      backgroundColor: 'white',
      padding: '1rem 0',
      width: '100vw',
      marginLeft: 'calc(-50vw + 50%)',
      marginRight: 'calc(-50vw + 50%)',
      marginTop: '-4rem',
      marginBottom: '4rem',
    },
    programsGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(5, 1fr)',
      gap: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      alignItems: 'start',
    },
    programCard: {
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      width: '200px',
      height: '220px',
      minHeight: '220px',
    },
    programIconContainer: {
      width: '120px',
      height: '120px',
      marginBottom: '1rem',
      borderRadius: '50%',
      backgroundColor: '#f8f9fa',
      padding: '1.5rem',
      border: '2px solid #69727d',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    programIcon: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
    },
    programTitle: {
      fontSize: '0.9rem',
      fontWeight: 600,
      color: 'black',
      marginTop: '1rem',
      textAlign: 'center',
      lineHeight: '1.3',
      whiteSpace: 'normal',
      overflow: 'visible',
      maxWidth: '100%',
      wordWrap: 'break-word',
    },

    // Partnership Section
    partnershipSection: {
      padding: '4rem 2rem',
      backgroundColor: '#f8f9fa',
    },
    partnershipTitle: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#035757',
      textAlign: 'center',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      backgroundColor: 'white',
      padding: '1rem 0',
      width: '100vw',
      marginLeft: 'calc(-50vw + 50%)',
      marginRight: 'calc(-50vw + 50%)',
      marginTop: '-4rem',
      marginBottom: '4rem',
    },
    partnershipGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      alignItems: 'center',
    },
    partnerLogo: {
      width: '100%',
      height: '80px',
      objectFit: 'contain',
      filter: 'grayscale(1)',
      transition: 'filter 0.3s ease',
    },
    // Footer
    footer: {
      backgroundColor: '#023535',
      color: 'white',
      padding: '3rem 2rem 1rem',
    },
    footerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    footerGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '2rem',
      marginBottom: '2rem',
    },
    footerSection: {
      display: 'flex',
      flexDirection: 'column',
    },
    footerTitle: {
      fontSize: '1.2rem',
      fontWeight: 600,
      marginBottom: '1rem',
      color: 'white',
    },
    footerText: {
      fontSize: '0.9rem',
      lineHeight: 1.6,
      color: '#b0c4c4',
      marginBottom: '0.5rem',
    },
    footerSocial: {
      display: 'flex',
      gap: '1rem',
      marginTop: '1rem',
    },
    socialIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#035757',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      textDecoration: 'none',
      transition: 'background-color 0.3s ease',
    },
    footerBottom: {
      borderTop: '1px solid #035757',
      paddingTop: '1rem',
      textAlign: 'center',
      color: '#b0c4c4',
      fontSize: '0.9rem',
    },
  };

  return (
    <div style={styles.container}>
      {/* Top Social Bar - Fixed */}
      <div style={styles.socialBar}>
        <div style={styles.socialLinks}>
          <a href="#" style={styles.socialLink}>
            <img src={WhatsAppIcon} alt="WhatsApp" style={styles.socialIconImage} />
            {!isMobile && 'Whatsapp'}
          </a>
          <a href="#" style={styles.socialLink}>
            <img src={InstagramIcon} alt="Instagram" style={styles.socialIconImage} />
            {!isMobile && 'Instagram'}
          </a>
          <a href="#" style={styles.socialLink}>
            <img src={FacebookIcon} alt="Facebook" style={styles.socialIconImage} />
            {!isMobile && 'Facebook'}
          </a>
          <a href="#" style={styles.socialLink}>
            <img src={YouTubeIcon} alt="YouTube" style={styles.socialIconImage} />
            {!isMobile && 'Youtube'}
          </a>
          <a href="#" style={styles.socialLink}>
            <img src={TikTokIcon} alt="TikTok" style={styles.socialIconImage} />
            {!isMobile && 'Tiktok'}
          </a>
        </div>
        <div style={styles.langSwitch}>
          <button style={styles.flagButton}>
            <img src={IdFlag} alt="Bahasa Indonesia" style={styles.flagIcon} />
          </button>
          <button style={styles.flagButton}>
            <img src={EnFlag} alt="English" style={styles.flagIcon} />
          </button>
        </div>
      </div>

      {/* Header - Fixed */}
      <header style={styles.header}>
        <div style={styles.logo}>
          <img src="/SMKMetland.png" alt="SMK Metland" style={styles.logoImage} />
        </div>
        
        {/* Desktop Navigation */}
        {!isMobile && (
        <nav style={styles.nav}>
            <div style={styles.navItem}>
              <a 
                href="#" 
                style={styles.navLink}
                onMouseEnter={handleNavLinkHover}
                onMouseLeave={handleNavLinkLeave}
              >
                BERANDA
              </a>
            </div>
            
            <div 
              style={styles.navItem}
              onMouseEnter={() => handleMouseEnter('tentang')}
              onMouseLeave={handleMouseLeave}
            >
              <a 
                href="#" 
                style={styles.navLink}
                onMouseEnter={handleNavLinkHover}
                onMouseLeave={handleNavLinkLeave}
              >
                TENTANG SEKOLAH <ChevronDown size={16} />
              </a>
              <div style={hoveredDropdown === 'tentang' ? styles.dropdownVisible : styles.dropdown}>
                <a 
                  href="#" 
                  style={styles.dropdownItem}
                  onMouseEnter={handleDropdownItemHover}
                  onMouseLeave={handleDropdownItemLeave}
                >
                  Sejarah Sekolah
                </a>
                <a 
                  href="#" 
                  style={styles.dropdownItem}
                  onMouseEnter={handleDropdownItemHover}
                  onMouseLeave={handleDropdownItemLeave}
                >
                  VISI & MISI
                </a>
                <a 
                  href="#" 
                  style={styles.dropdownItem}
                  onMouseEnter={handleDropdownItemHover}
                  onMouseLeave={handleDropdownItemLeave}
                >
                  Nilai Budaya Sekolah
                </a>
                <a 
                  href="#" 
                  style={styles.dropdownItem}
                  onMouseEnter={handleDropdownItemHover}
                  onMouseLeave={handleDropdownItemLeave}
                >
                  Kampus Cibitung
                </a>
              </div>
            </div>
            
            <div 
              style={styles.navItem}
              onMouseEnter={() => handleMouseEnter('kurikulum')}
              onMouseLeave={handleMouseLeave}
            >
              <a 
                href="#" 
                style={styles.navLink}
                onMouseEnter={handleNavLinkHover}
                onMouseLeave={handleNavLinkLeave}
              >
                KURIKULUM <ChevronDown size={16} />
              </a>
              <div style={hoveredDropdown === 'kurikulum' ? styles.dropdownVisible : styles.dropdown}>
                <a 
                  href="#" 
                  style={styles.dropdownItem}
                  onMouseEnter={handleDropdownItemHover}
                  onMouseLeave={handleDropdownItemLeave}
                >
                  Kurikulum Operasional Sekolah
                </a>
                <div 
                  style={styles.dropdownItem}
                  onMouseEnter={(e) => {
                    handleSubDropdownHover('sarana');
                    handleDropdownItemWithSubmenuHover(e);
                  }}
                  onMouseLeave={(e) => {
                    handleSubDropdownLeave();
                    handleDropdownItemWithSubmenuLeave(e);
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <span>Sarana Praktik Siswa</span>
                    <ChevronDown size={16} style={{ transform: 'rotate(-90deg)' }} />
                  </div>
                  <div style={hoveredSubDropdown === 'sarana' ? styles.subDropdownVisible : styles.subDropdown}>
                    <a 
                      href="#" 
                      style={styles.subDropdownItem}
                      onMouseEnter={handleDropdownItemHover}
                      onMouseLeave={handleDropdownItemLeave}
                    >
                      ARTISAN BEVERAGES STUDIO
                    </a>
                    <a 
                      href="#" 
                      style={styles.subDropdownItem}
                      onMouseEnter={handleDropdownItemHover}
                      onMouseLeave={handleDropdownItemLeave}
                    >
                      METSCHOO DELI
                    </a>
                    <a 
                      href="#" 
                      style={styles.subDropdownItem}
                      onMouseEnter={handleDropdownItemHover}
                      onMouseLeave={handleDropdownItemLeave}
                    >
                      PILLO @KALIANA APARTMENT
                    </a>
                  </div>
                </div>
                <a 
                  href="#" 
                  style={styles.dropdownItem}
                  onMouseEnter={handleDropdownItemHover}
                  onMouseLeave={handleDropdownItemLeave}
                >
                  Organisasi
                </a>
                <a 
                  href="#" 
                  style={styles.dropdownItem}
                  onMouseEnter={handleDropdownItemHover}
                  onMouseLeave={handleDropdownItemLeave}
                >
                  Ekstrakulikuler
                </a>
              </div>
            </div>
            
            <div 
              style={styles.navItem}
              onMouseEnter={() => handleMouseEnter('program')}
              onMouseLeave={handleMouseLeave}
            >
              <a 
                href="#" 
                style={styles.navLink}
                onMouseEnter={handleNavLinkHover}
                onMouseLeave={handleNavLinkLeave}
              >
                PROGRAM KEAHLIAN <ChevronDown size={16} />
              </a>
              <div style={hoveredDropdown === 'program' ? styles.dropdownVisible : styles.dropdown}>
                <a 
                  href="#" 
                  style={styles.dropdownItem}
                  onMouseEnter={handleDropdownItemHover}
                  onMouseLeave={handleDropdownItemLeave}
                >
                  Akuntansi Bisnis
                </a>
                <a 
                  href="#" 
                  style={styles.dropdownItem}
                  onMouseEnter={handleDropdownItemHover}
                  onMouseLeave={handleDropdownItemLeave}
                >
                  Kuliner
                </a>
                <a 
                  href="#" 
                  style={styles.dropdownItem}
                  onMouseEnter={handleDropdownItemHover}
                  onMouseLeave={handleDropdownItemLeave}
                >
                  Perhotelan
                </a>
                <a 
                  href="#" 
                  style={styles.dropdownItem}
                  onMouseEnter={handleDropdownItemHover}
                  onMouseLeave={handleDropdownItemLeave}
                >
                  Teknologi Informasi
                </a>
                <a 
                  href="#" 
                  style={styles.dropdownItem}
                  onMouseEnter={handleDropdownItemHover}
                  onMouseLeave={handleDropdownItemLeave}
                >
                  Desain Komunikasi Visual
                </a>
              </div>
            </div>
            
            <div style={styles.navItem}>
              <a 
                href="#" 
                style={styles.navLink}
                onMouseEnter={handleNavLinkHover}
                onMouseLeave={handleNavLinkLeave}
              >
                BERITA SEKOLAH
              </a>
            </div>
            
            <div style={styles.navItem}>
              <a 
                href="#" 
                style={styles.navLink}
                onMouseEnter={handleNavLinkHover}
                onMouseLeave={handleNavLinkLeave}
              >
                COLLEGE
              </a>
            </div>
            
            <div style={styles.navItem}>
              <a 
                href="#" 
                style={styles.navLink}
                onMouseEnter={handleNavLinkHover}
                onMouseLeave={handleNavLinkLeave}
              >
                E-BOOK
              </a>
            </div>
            
            <div style={styles.navItem}>
              <a 
                href="#" 
                style={styles.navLink}
                onMouseEnter={handleNavLinkHover}
                onMouseLeave={handleNavLinkLeave}
              >
                BKK
              </a>
            </div>
            
            <button style={styles.button}>MS-LEARN</button>
          </nav>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <button 
            style={styles.mobileMenuButton}
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}

        {/* Mobile Menu Backdrop */}
        {isMenuOpen && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999,
            }}
            onClick={toggleMenu}
          />
        )}
        
        {/* Mobile Menu */}
        <div style={styles.mobileMenu}>
          <a style={styles.navLink}>BERANDA</a>
          <a style={styles.navLink}>TENTANG SEKOLAH</a>
          <a style={styles.navLink}>PROGRAM KEAHLIAN</a>
          <a style={styles.navLink}>KURIKULUM</a>
          <a style={styles.navLink}>BERITA SEKOLAH</a>
          <a style={styles.navLink}>COLLEGE</a>
          <a style={styles.navLink}>E-BOOK</a>
          <a style={styles.navLink}>BKK</a>
          <button style={{...styles.button, width: '100%', marginTop: '1rem'}}>PPDB</button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
        <h1 style={styles.heroTitle}>
          {isMobile ? (
            <>
              PPDB SMK METLAND CILEUNGSI<br />
              TA 2025/2026
            </>
          ) : (
            'PPDB SMK METLAND CILEUNGSI TA 2025/2026'
          )}
        </h1>
        <p style={styles.heroSubtitle}>
          The High Standard in Vocational Education
        </p>
          <button 
            style={styles.heroButton}
            onClick={handleSignUpClick}
          >
          MS-LEARN
          </button>
        </div>
      </section>

      {/* About Section */}
      <section style={styles.aboutSection}>
        <div style={styles.aboutContent}>
          <h2 style={styles.aboutTitle}>SMK PARIWISATA METLAND SCHOOL</h2>
          <p style={styles.aboutText}>
            SMK Metland didirikan oleh Yayasan Pendidikan Metland (YPM), berada di bawah naungan PT Metropolitan Land, Tbk. 
            Keberhasilan pengembangan SMK Metland di kawasan Metland Transyogi Bogor (dalam kurun waktu 10 tahun) sebagai SMK 
            dengan standar internasional mendorong Yayasan Pendidikan Metland untuk mengembangkan SMK Metland di kawasan 
            Perumahan Metland Cibitung yang dimulai pada tahun 2021. Hal ini ditandai dengan didirikannya bangunan sekolah 
            dengan fasilitas lengkap pada tahun 2022 di lokasi yang strategis.
          </p>
        </div>
      </section>

      {/* Trending Section */}
      <section style={styles.trendingSection}>
        <div style={styles.trendingLabel}>TRENDING TODAY</div>
        <div style={styles.trendingContent}>
          <div style={styles.trendingText}>
            Metland School Selenggarakan Generasi Cinta Prestasi (GCP) Award: Apresiasi Gemilang Untuk Murid Berprestasi
          </div>
        </div>
        <div style={styles.trendingNav}>
          <button style={styles.trendingNavButton}>&lt;</button>
          <button style={styles.trendingNavButton}>&gt;</button>
        </div>
      </section>

      {/* News Section */}
      <section style={styles.newsSection}>
        <div style={styles.newsContent}>
          <h2 style={styles.newsTitle}>BERITA</h2>
          <div style={styles.newsGrid}>
            <div style={styles.newsCard}>
              <h3 style={styles.newsCardTitle}>SMK Metland Gelar "A Tribute of Love to Honorable Parents"</h3>
              <p style={styles.newsCardText}>
                Suasana haru dan kehangatan menyelimuti Ballroom Metropolitan Mall Cileungsi pada Sabtu, 4 Juli 2025 saat SMK Metland sukses menggelar acara "A Tribute of Love to Honorable Parents".
              </p>
            </div>
            <div style={styles.newsCard}>
              <h3 style={styles.newsCardTitle}>Metland School Selenggarakan Generasi Cinta Prestasi (GCP) Award</h3>
              <p style={styles.newsCardText}>
                Apresiasi Gemilang untuk Murid Berprestasi dalam berbagai bidang akademik dan non-akademik.
              </p>
            </div>
            <div style={styles.newsCard}>
              <h3 style={styles.newsCardTitle}>Pembelajaran Large Language Models (LLM)</h3>
              <p style={styles.newsCardText}>
                Implementasi teknologi AI dalam kurikulum Sekolah Menengah Kejuruan untuk mempersiapkan siswa menghadapi era digital.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Infographics Section */}
      <section style={styles.infographicsSection}>
        <div style={styles.infographicsContent}>
          <h2 style={styles.infographicsTitle}>INFOGRAFIS</h2>
          <div style={styles.infographicsGrid}>
            <div style={styles.infographicCard}>
              <div style={styles.programIconContainer}>
                <Users size={64} color="#69727d" />
              </div>
              <div style={styles.infographicNumber}>683</div>
              <div style={styles.infographicLabel}>Siswa</div>
            </div>
            <div style={styles.infographicCard}>
              <div style={styles.programIconContainer}>
                <BookOpen size={64} color="#69727d" />
              </div>
              <div style={styles.infographicNumber}>75</div>
              <div style={styles.infographicLabel}>Guru</div>
            </div>
            <div style={styles.infographicCard}>
              <div style={styles.programIconContainer}>
            <GraduationCap size={64} color="#69727d" />
              </div>
              <div style={styles.infographicNumber}>28</div>
              <div style={styles.infographicLabel}>Tendik</div>
            </div>
          </div>
        </div>
      </section>



      {/* Programs Section */}
      <section style={styles.programsSection}>
        <h2 style={styles.programsTitle}>PROGRAM KEAHLIAN</h2>
        <div style={styles.programsGrid}>
          <div style={styles.programCard}>
            <div style={styles.programIconContainer}>
              <img src="/Akutansi.svg" alt="Akuntansi Bisnis" style={styles.programIcon} />
            </div>
            <h3 style={styles.programTitle}>Akuntansi Bisnis</h3>
          </div>
          <div style={styles.programCard}>
            <div style={styles.programIconContainer}>
              <img src="/Kuliner.svg" alt="Kuliner" style={styles.programIcon} />
            </div>
            <h3 style={styles.programTitle}>Kuliner</h3>
          </div>
          <div style={styles.programCard}>
            <div style={styles.programIconContainer}>
              <img src="/Perhotelan.svg" alt="Perhotelan" style={styles.programIcon} />
            </div>
            <h3 style={styles.programTitle}>Perhotelan</h3>
          </div>
          <div style={styles.programCard}>
            <div style={styles.programIconContainer}>
              <img src="/Teknologi Informasi.svg" alt="Teknologi Informasi" style={styles.programIcon} />
            </div>
            <h3 style={styles.programTitle}>Teknologi Informasi</h3>
          </div>
          <div style={styles.programCard}>
            <div style={styles.programIconContainer}>
              <img src="/Desain Komunikasi Visual.svg" alt="Desain Komunikasi Visual" style={styles.programIcon} />
            </div>
            <h3 style={styles.programTitle}>Desain Komunikasi Visual</h3>
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section style={styles.partnershipSection}>
        <h2 style={styles.partnershipTitle}>KERJASAMA INDUSTRI</h2>
        <div style={styles.partnershipGrid}>
          {/* Placeholder for partner logos - these should be replaced with actual logos */}
          <img src="/logo.png" alt="Partner 1" style={styles.partnerLogo} />
          <img src="/logo.png" alt="Partner 2" style={styles.partnerLogo} />
          <img src="/logo.png" alt="Partner 3" style={styles.partnerLogo} />
          <img src="/logo.png" alt="Partner 4" style={styles.partnerLogo} />
          <img src="/logo.png" alt="Partner 5" style={styles.partnerLogo} />
          <img src="/logo.png" alt="Partner 6" style={styles.partnerLogo} />
          <img src="/logo.png" alt="Partner 7" style={styles.partnerLogo} />
          <img src="/logo.png" alt="Partner 8" style={styles.partnerLogo} />
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <img src="/SMKMetland.png" alt="SMK Metland Logo" style={{ height: '60px', marginBottom: '1rem' }} />
          </div>
          <div style={styles.footerGrid}>
            <div style={styles.footerSection}>
              <h4 style={styles.footerTitle}>PROGRAM KEAHLIAN</h4>
              <p style={styles.footerText}>Akuntansi Bisnis</p>
              <p style={styles.footerText}>Perhotelan</p>
              <p style={styles.footerText}>Kuliner</p>
              <p style={styles.footerText}>Desain Komunikasi Visual</p>
              <p style={styles.footerText}>Teknologi Informasi</p>
            </div>
            
            <div style={styles.footerSection}>
              <h4 style={styles.footerTitle}>HUBUNGI KAMI</h4>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <MapPin size={16} style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                <p style={styles.footerText}>
                  Jl. Kota Taman Metropolitan, Cileungsi Kidul, Kec. Cileungsi, Kabupaten Bogor, Jawa Barat 16820
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Phone size={16} />
                <p style={styles.footerText}>(021) 82496976</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <MessageCircle size={16} />
                <p style={styles.footerText}>+6281293395500</p>
            </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} />
                <p style={styles.footerText}>www.smkmetland.net</p>
            </div>
            </div>
          </div>
          
          <div style={styles.footerBottom}>
            <p>Copyright © 2023 SMK METLAND | Powered by SMK METLAND.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;