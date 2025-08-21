import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Users, BookOpen, Megaphone } from 'lucide-react';
import type { CSSProperties } from 'react';
import CountUp from 'react-countup';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import SiteHeader from '../components/SiteHeader';
// Social bar removed
import Footer from '../components/Footer';
import { siteAPI, type NewsItem } from '../services/api';

// Import partnership images
// Top row images
import SilaTea from '../assets/Partnership/Top/Sila_Tea-removebg-preview-150x150.png';
import SekolahanId from '../assets/Partnership/Top/Sekolahan.id-removebg-preview-150x150.png';
import RaSuites from '../assets/Partnership/Top/Ra_Suites-removebg-preview-150x150.png';
import Pullman from '../assets/Partnership/Top/Pullman-removebg-preview-150x150.png';
import PTMetland from '../assets/Partnership/Top/PT_Metland-removebg-preview-e1704943421395-150x150.png';
import MetropolitanMall from '../assets/Partnership/Top/Metropolitan_Mall_Cibubur-removebg-preview-150x150.png';
import Kempinski from '../assets/Partnership/Top/Kempinski-removebg-preview-150x150.png';
import KalianaApartment from '../assets/Partnership/Top/Kaliana_Apartment-removebg-preview-150x150.png';
import Indesso from '../assets/Partnership/Top/Indesso-removebg-preview-150x150.png';
import HotelCiputra from '../assets/Partnership/Top/Hotel_Ciputra_Cibubur-removebg-preview-150x150.png';
import HorisonHotels from '../assets/Partnership/Top/Horison_Hotels_Group__1_-removebg-preview-150x150.png';
import HarrisHotel from '../assets/Partnership/Top/Harris_Hotel-removebg-preview-150x150.png';
import GrandMetropolitan from '../assets/Partnership/Top/Grand_Metropolitan-removebg-preview-150x150.png';
import Ayana from '../assets/Partnership/Top/Ayana-removebg-preview-1-150x150.png';

// Bottom row images
import Virtalus from '../assets/Partnership/Bottom/virtalus-150x150.png';
import Unesco from '../assets/Partnership/Bottom/unesco-150x150.png';
import Trskt from '../assets/Partnership/Bottom/trskt-150x150.png';
import ThailangIjo from '../assets/Partnership/Bottom/thailang-ijo-150x150.png';
import Tgroup from '../assets/Partnership/Bottom/tgroup-150x150.png';
import Teii from '../assets/Partnership/Bottom/teii-e1705024305638-150x150.png';
import Stada from '../assets/Partnership/Bottom/stada-1-150x150.png';
import Shangri from '../assets/Partnership/Bottom/shangri-150x150.png';
import RitzCalton from '../assets/Partnership/Bottom/ritz-calton-150x150.png';
import Puket from '../assets/Partnership/Bottom/puket-1-150x150.png';
import Phucket from '../assets/Partnership/Bottom/phucket.png';
import PhilipinUniversity from '../assets/Partnership/Bottom/philipin-university-150x150.png';
import LongBeach from '../assets/Partnership/Bottom/long-beach-150x150.png';
import Dt153037286 from '../assets/Partnership/Bottom/dt_153037286-150x90.png';
import Biru from '../assets/Partnership/Bottom/biru-150x150.png';
import Accor from '../assets/Partnership/Bottom/accor-e1705022947913-150x150.png';
import PhitsanulokLogo from '../assets/Partnership/Bottom/Phitsanulok_Logo-1-150x150.jpg';
import Img20230612 from '../assets/Partnership/Bottom/IMG-20230612-WA0015-1-150x150.jpg';
import Img14 from '../assets/Partnership/Bottom/14-150x150.jpg';
// News assets from sementara
import ImgCybersecurity from '../assets/sementara/cybersecurity.jpg';

const Index = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [hoveredProgram, setHoveredProgram] = useState<string | null>(null);
  const [infoSiswa, setInfoSiswa] = useState<number | null>(null);
  const [infoGuru, setInfoGuru] = useState<number | null>(null);
  const [infoTendik, setInfoTendik] = useState<number | null>(null);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  // Trending headlines and animation state
  const [trendingHeadlines] = useState<string[]>([
    'Cybersecurity Di Sekolah : Dimulai Dari Diri Sendiri',
    'JALIN KERJASAMA, METLAND SCHOOL DAN PARALLAXNET USUNG KURIKULUM TECHNOPRENEUR',
    'SMK Metland Cileungsi Bersama Huion Gelar Seminar dan Workshop Ilustrasi Digital',
    'Pembelajaran Large Language Models (LLM) dalam Kurikulum Sekolah Menengah Kejuruan',
    'Enhancing Digital Literacy through TVET Fostering Synergy and Collaboration between Indonesia and Thailand',
  ]);
  const [currentHeadlineIndex, setCurrentHeadlineIndex] = useState<number>(0);
  const [nextHeadlineIndex, setNextHeadlineIndex] = useState<number | null>(null);
  const [isTrendingAnimating, setIsTrendingAnimating] = useState<boolean>(false);
  const [trendingDirection, setTrendingDirection] = useState<'next' | 'prev'>('next');
  const [trendingRun, setTrendingRun] = useState<boolean>(false);

  const slideDurationMs = 320;
  const triggerTrending = (dir: 'next' | 'prev') => {
    if (isTrendingAnimating) return;
    const total = trendingHeadlines.length;
    const target = dir === 'next'
      ? (currentHeadlineIndex + 1) % total
      : (currentHeadlineIndex - 1 + total) % total;
    setTrendingDirection(dir);
    setNextHeadlineIndex(target);
    setIsTrendingAnimating(true);
    setTrendingRun(false);
    // Start animation next tick so incoming begins offscreen
    window.setTimeout(() => setTrendingRun(true), 20);
    // Finish animation
    window.setTimeout(() => {
      setCurrentHeadlineIndex(target);
      setNextHeadlineIndex(null);
      setIsTrendingAnimating(false);
      setTrendingRun(false);
    }, slideDurationMs);
  };

  // Auto-rotate trending headlines every 3 seconds
  useEffect(() => {
    const id = window.setInterval(() => {
      if (!isTrendingAnimating && nextHeadlineIndex === null) {
        triggerTrending('next');
      }
    }, 3000);
    return () => window.clearInterval(id);
  }, [isTrendingAnimating, nextHeadlineIndex, currentHeadlineIndex]);
  
  // Preload hover icons to eliminate first-hover delay on Program Keahlian
  useEffect(() => {
    const urls = [
      '/Akutansi Hover.svg',
      '/Kuliner Hover.svg',
      '/Perhotelan Hover.svg',
      '/Teknologi Informasi Hover.svg',
      '/Desain Komunikasi Visual Hover.svg',
    ];
    urls.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Fetch public infographics for animated counts
  useEffect(() => {
    fetch('http://localhost:8080/api/site/infographics')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d) return;
        setInfoSiswa(typeof d.siswa === 'number' && d.siswa >= 0 ? d.siswa : null);
        setInfoGuru(typeof d.guru === 'number' && d.guru >= 0 ? d.guru : null);
        setInfoTendik(typeof d.tendik === 'number' && d.tendik >= 0 ? d.tendik : null);
      })
      .catch(() => {
        // keep nulls → shows '?'
      });
  }, []);

  // Fetch news from backend
  useEffect(() => {
    siteAPI.getNews()
      .then((news) => {
        setNewsList(news || []); // Ensure we always set an array even if API returns null
      })
      .catch((error) => {
        console.error('Failed to fetch news:', error);
        setNewsList([]);
      });
  }, []);


  useEffect(() => {
    const updateViewportFlags = () => {
      const mobileLike = window.innerWidth <= 768 || window.innerHeight <= 480;
      setIsMobile(mobileLike);
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    updateViewportFlags();
    window.addEventListener('resize', updateViewportFlags);
    window.addEventListener('orientationchange', updateViewportFlags);
    return () => {
      window.removeEventListener('resize', updateViewportFlags);
      window.removeEventListener('orientationchange', updateViewportFlags);
    };
  }, []);

  // Removed social bar/auto-hide logic

  const handleSignUpClick = () => {
    navigate('/ppdb');
  };

  // Removed dropdown/nav handlers

  // Removed submenu handlers

  const styles: Record<string, CSSProperties> = {
    adminLink: { color: '#035757', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' },
    container: {
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      margin: 0,
      padding: 0,
      paddingTop: isMobile ? '96px' : '104px',
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
      position: 'relative',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1001,
      height: isMobile ? '32px' : '40px',
      transform: 'translateY(-100%)',
      transition: 'none',
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
      position: 'relative',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      width: '100%',
      transition: 'top 0.05s ease',
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
      transform: 'translateX(100%)',
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
      padding: isMobile ? '2rem 1rem' : '4rem 2rem',
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
      fontSize: isMobile ? '1rem' : '1.5rem',
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
    trendingViewport: {
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
      // Allow multiple lines on mobile (approx up to 3 lines)
      minHeight: isMobile ? '3.9rem' : '1rem',
    },
    trendingSlide: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
    },
    trendingText: {
      color: '#ffff00',
      fontSize: isMobile ? '0.9rem' : '1rem',
      fontWeight: 500,
      textAlign: 'center',
      whiteSpace: isMobile ? 'normal' : 'nowrap',
      overflow: 'hidden',
      textOverflow: isMobile ? 'unset' : 'ellipsis',
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
    // MS Learn Bar (below Trending)
    msLearnSection: {
      backgroundColor: '#2d6f6f',
      padding: isMobile ? '0.75rem 1rem' : '1rem 2rem',
      width: '100vw',
      marginLeft: 'calc(-50vw + 50%)',
      marginRight: 'calc(-50vw + 50%)',
    },
    msLearnBox: {
      width: '100%',
      maxWidth: 'none',
      margin: 0,
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto',
      alignItems: 'center',
      gap: isMobile ? '0.75rem' : '1rem',
    },
    msLearnIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: isMobile ? '38px' : '44px',
      height: isMobile ? '38px' : '44px',
      borderRadius: '8px',
      backgroundColor: '#fbbf24',
      boxShadow: '0 1px 2px rgba(0,0,0,0.15) inset',
      flexShrink: 0,
    },
    msLearnContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      gap: '0.5rem',
    },
    msLearnTitle: {
      color: '#fde68a',
      fontSize: isMobile ? '0.8rem' : '0.95rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    msLearnButton: {
      backgroundColor: '#0f5f5f',
      color: '#ffffff',
      border: '1px solid #22d3ee',
      borderRadius: '0.5rem',
      padding: isMobile ? '0.35rem 0.85rem' : '0.5rem 1.1rem',
      fontSize: isMobile ? '0.8rem' : '0.95rem',
      fontWeight: 700,
      cursor: 'pointer',
    },
    msLearnSpacer: {
      width: isMobile ? '38px' : '44px',
      height: 0,
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
      gap: isMobile ? '1rem' : '2rem',
      marginBottom: isMobile ? '1rem' : '3rem',
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      padding: isMobile ? '1.5rem' : '2rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e0e0e0',
      alignItems: 'stretch',
    },
    featuredNewsImage: {
      width: isMobile ? (isLandscape ? '268.2px' : '100%') : '569.7px',
      height: isMobile ? (isLandscape ? '155px' : 'auto') : '356.63px',
      aspectRatio: isMobile ? (isLandscape ? undefined : '16 / 9') : undefined,
      objectFit: 'cover',
      borderRadius: '0.5rem',
      backgroundColor: '#f0f0f0',
      display: 'block',
      margin: isMobile ? '0' : '0',
    },
    featuredNewsContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: 'auto',
    },
    featuredNewsDate: {
      fontSize: '0.8rem',
      color: '#64748b',
      marginTop: isMobile ? '-0.25rem' : '0',
      marginBottom: '0.5rem',
      textAlign: 'left',
      display: isMobile ? 'block' : 'block',
    },
    featuredNewsTitle: {
      fontSize: isMobile ? '0.9rem' : '1.3rem',
      fontWeight: 700,
      color: '#000000',
      marginBottom: '1rem',
      lineHeight: 1.3,
      wordBreak: 'break-word',
      overflowWrap: 'anywhere',
    },
    featuredNewsDescription: {
      fontSize: '0.95rem',
      lineHeight: 1.5,
      color: '#000000',
      marginBottom: '1.5rem',
      display: isMobile ? 'none' : 'block',
      wordBreak: 'break-word',
      overflowWrap: 'anywhere',
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
      display: isMobile ? 'none' : 'inline-block',
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
    newsCardDate: {
      fontSize: '0.8rem',
      color: '#64748b',
      textAlign: 'left',
      display: isMobile ? 'block' : 'none',
    },
    newsIndexButton: {
      backgroundColor: '#035757',
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
        backgroundColor: 'white',
    },
    infographicsContent: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    infographicsTitle: {
      fontSize: isMobile ? '1.4rem' : '2.5rem',
      fontWeight: 700,
      color: '#035757',
      textAlign: 'center',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      backgroundColor: '#e9ecef',
      padding: '1rem 0',
      width: '100vw',
      marginLeft: 'calc(-50vw + 50%)',
      marginRight: 'calc(-50vw + 50%)',
      marginTop: '-4rem',
      marginBottom: '4rem',
    },
    infographicsGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? (isLandscape ? 'repeat(3, 1fr)' : '1fr') : 'repeat(3, 1fr)',
      gap: isMobile ? (isLandscape ? '1rem' : '2rem') : '3rem',
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
      backgroundColor: '#ffffff',
    },
    programsTitle: {
      fontSize: isMobile ? '1.4rem' : '2.5rem',
      fontWeight: 700,
      color: '#035757',
      textAlign: 'center',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      backgroundColor: '#e9ecef',
      padding: '1rem 0',
      width: '100vw',
      marginLeft: 'calc(-50vw + 50%)',
      marginRight: 'calc(-50vw + 50%)',
      marginTop: '-4rem',
      marginBottom: '4rem',
    },
    programsGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? (isLandscape ? 'repeat(5, 1fr)' : '1fr') : 'repeat(5, 1fr)',
      gap: '1rem',
      maxWidth: '1200px',
      margin: '0 auto',
      justifyItems: 'center',
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
      width: isMobile && isLandscape ? '100%' : '200px',
      height: 'auto',
      minHeight: '220px',
      cursor: 'pointer',
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
    // Hex styles for Program Keahlian icons
    programHexOuter: {
      width: '110px',
      height: '110px',
      marginBottom: '1rem',
      backgroundColor: '#69727d',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      clipPath: 'polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)',
    },
    programHexInner: {
      width: '100px',
      height: '100px',
      backgroundColor: '#f8f9fa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      clipPath: 'polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)',
    },
    programCardHover: {},
    programHexOuterHover: {
      backgroundColor: '#009390'
    },
    programHexInnerHover: {
      backgroundColor: '#ffffff'
    },
    programTitleHover: {
      color: '#009390'
    },
    programHexImage: {
      width: '70%',
      height: '70%',
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
      backgroundColor: '#ffffff',
    },
    partnershipTitle: {
      fontSize: isMobile ? '1.4rem' : '2.5rem',
      fontWeight: 700,
      color: '#035757',
      textAlign: 'center',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      backgroundColor: '#e9ecef',
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
      width: '100%',
      maxWidth: '200px',
      height: isMobile ? '80px' : '120px',
      objectFit: 'contain',
      transition: 'filter 0.3s ease',
      margin: isMobile ? '0 0.5rem' : '0 1rem',
    },

  };

  return (
    <div style={styles.container}>
      {/* Header with social bar */}
      <SiteHeader />

      {/* Header removed */}

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
          <div style={styles.trendingViewport}>
            {/* Current */}
            <div
              style={{
                ...styles.trendingSlide,
                transform:
                  isTrendingAnimating && trendingRun
                    ? `translateX(${trendingDirection === 'next' ? '-100%' : '100%'})`
                    : 'translateX(0)',
                transition: isTrendingAnimating && trendingRun ? `transform ${slideDurationMs}ms ease` : 'none',
              }}
            >
              <div style={styles.trendingText}>
                {trendingHeadlines[currentHeadlineIndex]}
              </div>
            </div>

            {/* Incoming */}
            {nextHeadlineIndex !== null && (
              <div
                style={{
                  ...styles.trendingSlide,
                  transform: trendingRun
                    ? 'translateX(0)'
                    : `translateX(${trendingDirection === 'next' ? '100%' : '-100%'})`,
                  transition: trendingRun ? `transform ${slideDurationMs}ms ease` : 'none',
                }}
              >
                <div style={styles.trendingText}>
                  {trendingHeadlines[nextHeadlineIndex]}
                </div>
              </div>
            )}
          </div>
        </div>
        <div style={styles.trendingNav}>
          <button style={styles.trendingNavButton} onClick={() => triggerTrending('prev')}>&lt;</button>
          <button style={styles.trendingNavButton} onClick={() => triggerTrending('next')}>&gt;</button>
        </div>
      </section>

      {/* MS Learn Bar below Trending */}
      <section style={styles.msLearnSection}>
        <div style={styles.msLearnBox}>
          <div style={styles.msLearnIcon}>
            <Megaphone size={isMobile ? 20 : 22} color="#000000" />
          </div>
          <div style={styles.msLearnContent}>
            <div id="ms_learn_title_text" style={styles.msLearnTitle}>SMK Metland kini memiliki portal pembelajaran! Belajar tanpa ribet, langsung dari MS Learn!</div>
            <button style={styles.msLearnButton} onClick={() => navigate('/login')}>MS Learn</button>
          </div>
          <div style={styles.msLearnSpacer} />
        </div>
      </section>

      {/* News Section */}
      <section style={styles.newsSection}>
        <div style={styles.newsContent}>
          <h2 style={styles.newsTitle}>RILIS BERITA</h2>
          
          {/* Featured News */}
          {newsList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              Berita sedang dimuat...
            </div>
          ) : (
            <>
              {/* Show featured news first if available */}
              {newsList.filter(news => news.is_featured === 1).length > 0 && (
                <div style={styles.featuredNews}>
                  {(() => {
                    const featured = newsList.find(news => news.is_featured === 1) || newsList[0];
                    return (
                      <>
                        <img
                          src={featured.image_url || ImgCybersecurity}
                          alt={featured.title}
                          style={styles.featuredNewsImage}
                          onError={(e) => {
                            e.currentTarget.src = ImgCybersecurity;
                          }}
                        />
                        <div style={styles.featuredNewsContent}>
                          <div>
                            {!isMobile && (
                              <div style={styles.featuredNewsDate}>{featured.date}</div>
                            )}
                            <h3 style={styles.featuredNewsTitle}>{featured.title}</h3>
                            {isMobile && (
                              <div style={styles.featuredNewsDate}>{featured.date}</div>
                            )}
                            <p style={styles.featuredNewsDescription}>
                              {featured.content.length > 200
                                ? featured.content.substring(0, 200) + '...'
                                : featured.content}
                            </p>
                          </div>
                          <button style={styles.readMoreButton}>Baca Selengkapnya</button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* News Grid - Exclude featured news */}
              <div style={styles.newsGrid}>
                {newsList.filter(news => news.is_featured !== 1).slice(0, 6).map((news) => (
                  <div key={news.id} style={styles.newsCard}>
                    <img
                      src={news.image_url || ImgCybersecurity}
                      alt={news.title}
                      style={styles.newsCardImage}
                      onError={(e) => {
                        e.currentTarget.src = ImgCybersecurity;
                      }}
                    />
                    <h3 style={styles.newsCardTitle}>{news.title}</h3>
                    <div style={styles.newsCardDate}>{news.date}</div>
                    {news.is_featured === 1 && (
                      <div style={{ background: '#fef3c7', color: '#92400e', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700, display: 'inline-block', marginTop: 4 }}>
                        Featured
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* News Index Button */}
          <button style={styles.newsIndexButton} onClick={() => navigate('/berita')}>
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
              {infoSiswa === null ? (
                <span style={styles.infographicNumber as any}>?</span>
              ) : (
                <CountUp end={infoSiswa} duration={2} style={styles.infographicNumber} enableScrollSpy scrollSpyOnce />
              )}
              <div style={styles.infographicLabel}>Siswa</div>
            </div>
            <div style={styles.infographicCard}>
              <div style={styles.programIconContainer}>
                <BookOpen size={64} color="#69727d" />
              </div>
              {infoGuru === null ? (
                <span style={styles.infographicNumber as any}>?</span>
              ) : (
                <CountUp end={infoGuru} duration={2} style={styles.infographicNumber} enableScrollSpy scrollSpyOnce />
              )}
              <div style={styles.infographicLabel}>Guru</div>
            </div>
            <div style={styles.infographicCard}>
              <div style={styles.programIconContainer}>
            <GraduationCap size={64} color="#69727d" />
              </div>
              {infoTendik === null ? (
                <span style={styles.infographicNumber as any}>?</span>
              ) : (
                <CountUp end={infoTendik} duration={2} style={styles.infographicNumber} enableScrollSpy scrollSpyOnce />
              )}
              <div style={styles.infographicLabel}>Tendik</div>
            </div>
          </div>
        </div>
      </section>



      {/* Programs Section */}
      <section style={styles.programsSection}>
        <h2 style={styles.programsTitle}>PROGRAM KEAHLIAN</h2>
          <div style={styles.programsGrid}>
            <div
              style={{
                ...styles.programCard,
                ...(hoveredProgram === 'akuntansi' ? styles.programCardHover : {})
              }}
              onMouseEnter={() => setHoveredProgram('akuntansi')}
              onMouseLeave={() => setHoveredProgram(null)}
              onClick={() => navigate('/program/akuntansi')}
            >
              <div style={{
                ...styles.programHexOuter,
                ...(hoveredProgram === 'akuntansi' ? styles.programHexOuterHover : {})
              }}>
                <div style={{
                  ...styles.programHexInner,
                  ...(hoveredProgram === 'akuntansi' ? styles.programHexInnerHover : {})
                }}>
                  <img src={hoveredProgram === 'akuntansi' ? '/Akutansi Hover.svg' : '/Akutansi.svg'} alt="Akuntansi Bisnis" style={styles.programHexImage} />
                </div>
              </div>
              <h3 style={{
                ...styles.programTitle,
                ...(hoveredProgram === 'akuntansi' ? styles.programTitleHover : {})
              }}>Akuntansi Bisnis</h3>
            </div>

            <div
              style={{
                ...styles.programCard,
                ...(hoveredProgram === 'kuliner' ? styles.programCardHover : {})
              }}
              onMouseEnter={() => setHoveredProgram('kuliner')}
              onMouseLeave={() => setHoveredProgram(null)}
              onClick={() => navigate('/program/kuliner')}
            >
              <div style={{
                ...styles.programHexOuter,
                ...(hoveredProgram === 'kuliner' ? styles.programHexOuterHover : {})
              }}>
                <div style={{
                  ...styles.programHexInner,
                  ...(hoveredProgram === 'kuliner' ? styles.programHexInnerHover : {})
                }}>
                  <img src={hoveredProgram === 'kuliner' ? '/Kuliner Hover.svg' : '/Kuliner.svg'} alt="Kuliner" style={styles.programHexImage} />
                </div>
              </div>
              <h3 style={{
                ...styles.programTitle,
                ...(hoveredProgram === 'kuliner' ? styles.programTitleHover : {})
              }}>Kuliner</h3>
            </div>

            <div
              style={{
                ...styles.programCard,
                ...(hoveredProgram === 'perhotelan' ? styles.programCardHover : {})
              }}
              onMouseEnter={() => setHoveredProgram('perhotelan')}
              onMouseLeave={() => setHoveredProgram(null)}
              onClick={() => navigate('/program/perhotelan')}
            >
              <div style={{
                ...styles.programHexOuter,
                ...(hoveredProgram === 'perhotelan' ? styles.programHexOuterHover : {})
              }}>
                <div style={{
                  ...styles.programHexInner,
                  ...(hoveredProgram === 'perhotelan' ? styles.programHexInnerHover : {})
                }}>
                  <img src={hoveredProgram === 'perhotelan' ? '/Perhotelan Hover.svg' : '/Perhotelan.svg'} alt="Perhotelan" style={styles.programHexImage} />
                </div>
              </div>
              <h3 style={{
                ...styles.programTitle,
                ...(hoveredProgram === 'perhotelan' ? styles.programTitleHover : {})
              }}>Perhotelan</h3>
            </div>

            <div
              style={{
                ...styles.programCard,
                ...(hoveredProgram === 'ti' ? styles.programCardHover : {})
              }}
              onMouseEnter={() => setHoveredProgram('ti')}
              onMouseLeave={() => setHoveredProgram(null)}
              onClick={() => navigate('/program/ti')}
            >
              <div style={{
                ...styles.programHexOuter,
                ...(hoveredProgram === 'ti' ? styles.programHexOuterHover : {})
              }}>
                <div style={{
                  ...styles.programHexInner,
                  ...(hoveredProgram === 'ti' ? styles.programHexInnerHover : {})
                }}>
                  <img src={hoveredProgram === 'ti' ? '/Teknologi Informasi Hover.svg' : '/Teknologi Informasi.svg'} alt="Teknologi Informasi" style={styles.programHexImage} />
                </div>
              </div>
              <h3 style={{
                ...styles.programTitle,
                ...(hoveredProgram === 'ti' ? styles.programTitleHover : {})
              }}>Teknologi Informasi</h3>
            </div>

            <div
              style={{
                ...styles.programCard,
                ...(hoveredProgram === 'dkv' ? styles.programCardHover : {})
              }}
              onMouseEnter={() => setHoveredProgram('dkv')}
              onMouseLeave={() => setHoveredProgram(null)}
              onClick={() => navigate('/program/dkv')}
            >
              <div style={{
                ...styles.programHexOuter,
                ...(hoveredProgram === 'dkv' ? styles.programHexOuterHover : {})
              }}>
                <div style={{
                  ...styles.programHexInner,
                  ...(hoveredProgram === 'dkv' ? styles.programHexInnerHover : {})
                }}>
                  <img src={hoveredProgram === 'dkv' ? '/Desain Komunikasi Visual Hover.svg' : '/Desain Komunikasi Visual.svg'} alt="Desain Komunikasi Visual" style={styles.programHexImage} />
                </div>
              </div>
              <h3 style={{
                ...styles.programTitle,
                ...(hoveredProgram === 'dkv' ? styles.programTitleHover : {})
              }}>Desain Komunikasi Visual</h3>
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
                arrows={false}
                infinite={true}
                slidesToShow={isMobile ? 3 : 6}
                slidesToScroll={1}
                autoplay={true}
                speed={1000}
                autoplaySpeed={5000}
                cssEase="ease"
                rtl={false}
              >
                <div><img src={SilaTea} alt="Sila Tea" style={styles.partnerLogo} /></div>
                <div><img src={SekolahanId} alt="Sekolahan.id" style={styles.partnerLogo} /></div>
                <div><img src={RaSuites} alt="Ra Suites" style={styles.partnerLogo} /></div>
                <div><img src={Pullman} alt="Pullman" style={styles.partnerLogo} /></div>
                <div><img src={PTMetland} alt="PT Metland" style={styles.partnerLogo} /></div>
                <div><img src={MetropolitanMall} alt="Metropolitan Mall Cibubur" style={styles.partnerLogo} /></div>
                <div><img src={Kempinski} alt="Kempinski" style={styles.partnerLogo} /></div>
                <div><img src={KalianaApartment} alt="Kaliana Apartment" style={styles.partnerLogo} /></div>
                <div><img src={Indesso} alt="Indesso" style={styles.partnerLogo} /></div>
                <div><img src={HotelCiputra} alt="Hotel Ciputra Cibubur" style={styles.partnerLogo} /></div>
                <div><img src={HorisonHotels} alt="Horison Hotels Group" style={styles.partnerLogo} /></div>
                <div><img src={HarrisHotel} alt="Harris Hotel" style={styles.partnerLogo} /></div>
                <div><img src={GrandMetropolitan} alt="Grand Metropolitan" style={styles.partnerLogo} /></div>
                <div><img src={Ayana} alt="Ayana" style={styles.partnerLogo} /></div>
              </Slider>
        </div>
            
            {/* Bottom Row - Slides to the left */}
            <div style={styles.sliderRow}>
              <Slider
                dots={false}
                arrows={false}
                infinite={true}
                slidesToShow={isMobile ? 3 : 6}
                slidesToScroll={1}
                autoplay={true}
                speed={1000}
                autoplaySpeed={5000}
                cssEase="ease"
                rtl={true}
              >
                <div><img src={Virtalus} alt="Virtalus" style={styles.partnerLogo} /></div>
                <div><img src={Unesco} alt="UNESCO" style={styles.partnerLogo} /></div>
                <div><img src={Trskt} alt="TRSKT" style={styles.partnerLogo} /></div>
                <div><img src={ThailangIjo} alt="Thailang Ijo" style={styles.partnerLogo} /></div>
                <div><img src={Tgroup} alt="T Group" style={styles.partnerLogo} /></div>
                <div><img src={Teii} alt="TEII" style={styles.partnerLogo} /></div>
                <div><img src={Stada} alt="STADA" style={styles.partnerLogo} /></div>
                <div><img src={Shangri} alt="Shangri-La" style={styles.partnerLogo} /></div>
                <div><img src={RitzCalton} alt="Ritz Carlton" style={styles.partnerLogo} /></div>
                <div><img src={Puket} alt="Puket" style={styles.partnerLogo} /></div>
                <div><img src={Phucket} alt="Phucket" style={styles.partnerLogo} /></div>
                <div><img src={PhilipinUniversity} alt="Philippine University" style={styles.partnerLogo} /></div>
                <div><img src={LongBeach} alt="Long Beach" style={styles.partnerLogo} /></div>
                <div><img src={Dt153037286} alt="DT 153037286" style={styles.partnerLogo} /></div>
                <div><img src={Biru} alt="Biru" style={styles.partnerLogo} /></div>
                <div><img src={Accor} alt="Accor" style={styles.partnerLogo} /></div>
                <div><img src={PhitsanulokLogo} alt="Phitsanulok Logo" style={styles.partnerLogo} /></div>
                <div><img src={Img20230612} alt="IMG 20230612" style={styles.partnerLogo} /></div>
                <div><img src={Img14} alt="IMG 14" style={styles.partnerLogo} /></div>
              </Slider>
          </div>
            </div>
        </section>

        <Footer />
    </div>
  );
};

export default Index;