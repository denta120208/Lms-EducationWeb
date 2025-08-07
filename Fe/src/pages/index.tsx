import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, GraduationCap, Users, Trophy, MapPin, Phone, Mail, MessageCircle, BookOpen } from 'lucide-react';
import type { CSSProperties } from 'react';
import CountUp from 'react-countup';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
// Import social media icons
import WhatsAppIcon from '../assets/WhatsApp.svg';
import InstagramIcon from '../assets/InstaGram.svg';
import FacebookIcon from '../assets/FaceBook.svg';
import YouTubeIcon from '../assets/YouTube.svg';
import TikTokIcon from '../assets/TikTok.svg';
// Import language flags
import EnFlag from '../assets/en.png';
import IdFlag from '../assets/id 1.png';
import Footer from '../components/Footer';

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
      
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down and past 50px (reduced from 100px)
        setIsSocialBarVisible(false);
      } else if (currentScrollY < lastScrollY && currentScrollY < lastScrollY - 10) {
        // Scrolling up with minimum threshold
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
      transition: 'transform 0.15s ease',
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
      transition: 'all 0.15s ease',
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
    // Featured News
    featuredNews: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: '2rem',
      marginBottom: '3rem',
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      padding: '2rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e0e0e0',
      alignItems: 'flex-start',
    },
    featuredNewsImage: {
      width: isMobile ? '100%' : '569.7px',
      height: '356.63px',
      objectFit: 'cover',
      borderRadius: '0.5rem',
      backgroundColor: '#f0f0f0',
    },
    featuredNewsContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '356.63px',
    },
    featuredNewsDate: {
      fontSize: '0.9rem',
      color: '#64748b',
      marginBottom: '0.5rem',
    },
    featuredNewsTitle: {
      fontSize: '1.3rem',
      fontWeight: 700,
      color: '#000000',
      marginBottom: '1rem',
      lineHeight: 1.3,
    },
    featuredNewsDescription: {
      fontSize: '0.95rem',
      lineHeight: 1.5,
      color: '#000000',
      marginBottom: '1.5rem',
    },
    readMoreButton: {
      backgroundColor: '#f8f9fa',
      color: '#000000',
      border: '1px solid #e0e0e0',
      borderRadius: '0.375rem',
      padding: '0.5rem 1rem',
      fontSize: '0.85rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s',
      alignSelf: 'flex-start',
    },
    // News Grid
    newsGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
      gap: '1rem',
      marginBottom: '2rem',
    },
    newsCard: {
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e0e0e0',
      transition: 'transform 0.3s ease',
      cursor: 'pointer',
    },
    newsCardImage: {
      width: '268.2px',
      height: '155px',
      objectFit: 'cover',
      borderRadius: '0.375rem',
      marginBottom: '1rem',
      backgroundColor: '#f0f0f0',
    },
    newsCardTitle: {
      fontSize: '0.9rem',
      fontWeight: 600,
      color: '#000000',
      marginBottom: '0.5rem',
      lineHeight: 1.3,
    },
    newsIndexButton: {
      backgroundColor: '#6b46c1',
      color: 'white',
      border: 'none',
      borderRadius: '0.375rem',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    // Infographics Section
    infographicsSection: {
      padding: '4rem 2rem',
      backgroundColor: '#f8f9fa',
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
      fontSize: '2.5rem',
      fontWeight: 800,
      color: '#009390',
      marginBottom: '0.5rem',
    },
    infographicLabel: {
      fontSize: '1rem',
      color: 'black',
      fontWeight: 600,
    },
    // Programs Section
    programsSection: {
      padding: '4rem 2rem',
      backgroundColor: '#f8f9fa',
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
      width: '100px',
      height: '100px',
      marginBottom: '1rem',
      borderRadius: '50%',
      backgroundColor: '#f8f9fa',
      padding: '1.2rem',
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
      fontSize: '0.8rem',
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
    partnershipSlider: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    sliderRow: {
      marginBottom: '2rem',
    },
    partnerLogo: {
      width: '150px',
      height: '80px',
      objectFit: 'contain',
      filter: 'grayscale(1)',
      transition: 'filter 0.3s ease',
      margin: '0 1rem',
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
            
            <button style={styles.button}>PPDB</button>
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
            DAFTAR SEKARANG
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
          <h2 style={styles.newsTitle}>RILIS BERITA</h2>
          
          {/* Featured News */}
          <div style={styles.featuredNews}>
            <img 
              src="/sekolah.jpg" 
              alt="Featured News" 
              style={styles.featuredNewsImage}
            />
            <div style={styles.featuredNewsContent}>
              <div>
                <div style={styles.featuredNewsDate}>06, Agustus 2025</div>
                <h3 style={styles.featuredNewsTitle}>
                  Kuliah Umum Internasional FKIP Unpak & Jepang Bahas SDGs & ESD Global
                </h3>
                <p style={styles.featuredNewsDescription}>
                  Acara ini diadakan dalam rangka memperingati Hari Konservasi Alam Nasional (HKAN) 2025 dan diikuti oleh lebih dari 100 peserta.
                </p>
              </div>
              <button style={styles.readMoreButton}>Baca Selengkapnya</button>
            </div>
          </div>

          {/* News Grid */}
          <div style={styles.newsGrid}>
            <div style={styles.newsCard}>
              <img 
                src="/sekolah.jpg" 
                alt="News 1" 
                style={styles.newsCardImage}
              />
              <h3 style={styles.newsCardTitle}>
                Universitas Pakuan Latih Warga Bojong Olah Lele Jadi Sarden Kaleng Bernilai Ekonomi
              </h3>
            </div>
            <div style={styles.newsCard}>
              <img 
                src="/sekolah.jpg" 
                alt="News 2" 
                style={styles.newsCardImage}
              />
              <h3 style={styles.newsCardTitle}>
                Universitas Pakuan Wisuda 797 Lulusan, Cetak Prestasi dan Inovasi di Tahun 2025
              </h3>
            </div>
            <div style={styles.newsCard}>
              <img 
                src="/sekolah.jpg" 
                alt="News 3" 
                style={styles.newsCardImage}
              />
              <h3 style={styles.newsCardTitle}>
                Studi Lapangan Teknik Elektro Unpak di UPDL Cibogo Tambah Wawasan TM-TT
              </h3>
            </div>
            <div style={styles.newsCard}>
              <img 
                src="/sekolah.jpg" 
                alt="News 4" 
                style={styles.newsCardImage}
              />
              <h3 style={styles.newsCardTitle}>
                Pengembangan Karir dan Alumni Unpak Gelar Seminar Grooming for Success
              </h3>
          </div>
          </div>

          {/* News Index Button */}
          <button style={styles.newsIndexButton}>
            Indeks Berita →
          </button>
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
              <CountUp 
                end={683} 
                duration={2.5}
                style={styles.infographicNumber}
                enableScrollSpy={true}
                scrollSpyDelay={500}
                scrollSpyOnce={true}
              />
              <div style={styles.infographicLabel}>Siswa</div>
            </div>
            <div style={styles.infographicCard}>
              <div style={styles.programIconContainer}>
                <BookOpen size={64} color="#69727d" />
              </div>
              <CountUp 
                end={75} 
                duration={2.5}
                style={styles.infographicNumber}
                enableScrollSpy={true}
                scrollSpyDelay={500}
                scrollSpyOnce={true}
              />
              <div style={styles.infographicLabel}>Guru</div>
            </div>
            <div style={styles.infographicCard}>
              <div style={styles.programIconContainer}>
            <GraduationCap size={64} color="#69727d" />
              </div>
              <CountUp 
                end={28} 
                duration={2.5}
                style={styles.infographicNumber}
                enableScrollSpy={true}
                scrollSpyDelay={500}
                scrollSpyOnce={true}
              />
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
          <div style={styles.partnershipSlider}>
            {/* Top Row - Slides to the right */}
            <div style={styles.sliderRow}>
              <Slider
                dots={false}
                infinite={true}
                slidesToShow={6}
                slidesToScroll={1}
                autoplay={true}
                speed={1000}
                autoplaySpeed={5000}
                cssEase="ease"
                rtl={false}
              >
                <div><img src="/logo.png" alt="Partner 1" style={styles.partnerLogo} /></div>
                <div><img src="/logo.png" alt="Partner 2" style={styles.partnerLogo} /></div>
                <div><img src="/logo.png" alt="Partner 3" style={styles.partnerLogo} /></div>
                <div><img src="/logo.png" alt="Partner 4" style={styles.partnerLogo} /></div>
                <div><img src="/logo.png" alt="Partner 5" style={styles.partnerLogo} /></div>
                <div><img src="/logo.png" alt="Partner 6" style={styles.partnerLogo} /></div>
                <div><img src="/logo.png" alt="Partner 7" style={styles.partnerLogo} /></div>
                <div><img src="/logo.png" alt="Partner 8" style={styles.partnerLogo} /></div>
                <div><img src="/logo.png" alt="Partner 9" style={styles.partnerLogo} /></div>
                <div><img src="/logo.png" alt="Partner 10" style={styles.partnerLogo} /></div>
                <div><img src="/logo.png" alt="Partner 11" style={styles.partnerLogo} /></div>
                <div><img src="/logo.png" alt="Partner 12" style={styles.partnerLogo} /></div>
              </Slider>
        </div>
            
            {/* Bottom Row - Slides to the left */}
            <div style={styles.sliderRow}>
              <Slider
                dots={false}
                infinite={true}
                slidesToShow={6}
                slidesToScroll={1}
                autoplay={true}
                speed={1000}
                autoplaySpeed={5000}
                cssEase="ease"
                rtl={true}
              >
                <div><img src="/logo.png" alt="Partner 13" style={styles.partnerLogo} /></div>
                <div><img src="/logo.png" alt="Partner 14" style={styles.partnerLogo} /></div>
                <div><img src="/logo.png" alt="Partner 15" style={styles.partnerLogo} /></div>
                <div><img src="/logo.png" alt="Partner 16" style={styles.partnerLogo} /></div>
                <div><img src="/logo.png" alt="Partner 17" style={styles.partnerLogo} /></div>
                <div><img src="/logo.png" alt="Partner 18" style={styles.partnerLogo} /></div>
                <div><img src="/logo.png" alt="Partner 19" style={styles.partnerLogo} /></div>
                <div><img src="/logo.png" alt="Partner 20" style={styles.partnerLogo} /></div>
                <div><img src="/logo.png" alt="Partner 21" style={styles.partnerLogo} /></div>
                <div><img src="/logo.png" alt="Partner 22" style={styles.partnerLogo} /></div>
                <div><img src="/logo.png" alt="Partner 23" style={styles.partnerLogo} /></div>
                <div><img src="/logo.png" alt="Partner 24" style={styles.partnerLogo} /></div>
              </Slider>
          </div>
            </div>
        </section>

        <Footer />
    </div>
  );
};

export default Index;