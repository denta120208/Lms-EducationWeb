import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import WhatsAppIcon from '../assets/WhatsApp.svg';
import InstagramIcon from '../assets/InstaGram.svg';
import FacebookIcon from '../assets/FaceBook.svg';
import YouTubeIcon from '../assets/YouTube.svg';
import TikTokIcon from '../assets/TikTok.svg';
import EnFlag from '../assets/en.png';
import IdFlag from '../assets/id 1.png';

type Props = { fixed?: boolean; scrollTargetSelector?: string };

const SiteHeader: React.FC<Props> = ({ fixed = true, scrollTargetSelector }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredDropdown, setHoveredDropdown] = useState('');
  const [hoveredSubDropdown, setHoveredSubDropdown] = useState('');
  // Social bar always visible per request

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Removed auto-hide on scroll – keep bar visible

  const styles: Record<string, React.CSSProperties> = {
    socialBar: {
      backgroundColor: '#2d5e5e',
      padding: isMobile ? '0.3rem 0' : '0.5rem 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft: isMobile ? '1rem' : '2rem',
      paddingRight: isMobile ? '1rem' : '2rem',
      fontSize: isMobile ? '0.8rem' : '1rem',
      position: fixed ? 'fixed' as const : 'relative',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1001,
      height: isMobile ? '32px' : '40px',
      transform: 'translateY(0)',
      transition: 'none',
    },
    socialLinks: { display: 'flex', gap: isMobile ? '0.5rem' : '1rem', alignItems: 'center' },
    socialLink: { color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' },
    socialIconImage: { width: 16, height: 16, filter: 'brightness(0) invert(1)' },
    flagButton: {
      width: isMobile ? 16 : 24,
      height: isMobile ? 12 : 16,
      padding: 0,
      border: 'none',
      cursor: 'pointer',
      borderRadius: 2,
      overflow: 'hidden',
      transition: 'transform 0.2s',
      minWidth: isMobile ? 16 : 24,
      minHeight: isMobile ? 12 : 16,
      maxWidth: isMobile ? 24 : 24,
      maxHeight: isMobile ? 12 : 16,
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
      maxWidth: isMobile ? 16 : 24,
      maxHeight: isMobile ? 12 : 16,
      minWidth: isMobile ? 16 : 24,
      minHeight: isMobile ? 12 : 16,
      boxSizing: 'border-box',
      display: 'block',
      margin: 0,
      padding: 0,
    },
    header: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', backgroundColor: '#ffffff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)', position: fixed ? 'fixed' as const : 'relative',
      top: isMobile ? 32 : 40, left: 0, right: 0, zIndex: 1000, height: 64, transition: 'none'
    },
    logoImage: { height: 50, width: 'auto', cursor: 'pointer' },
    nav: { display: isMobile ? 'none' : 'flex', gap: '2rem', alignItems: 'center' },
    navItem: { position: 'relative' },
    navLink: { color: '#035757', fontWeight: 500, textDecoration: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.5rem 0', position: 'relative' },
    dropdown: {
      position: 'absolute', top: '100%', left: 0, backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: 6,
      minWidth: 220, zIndex: 1000, padding: '0.5rem 0', transition: 'all 0.3s ease', transform: 'translateY(10px)', opacity: 0, pointerEvents: 'none'
    },
    dropdownVisible: {
      position: 'absolute', top: '100%', left: 0, backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: 6,
      minWidth: 220, zIndex: 1000, padding: '0.5rem 0', transition: 'all 0.3s ease', transform: 'translateY(0)', opacity: 1, pointerEvents: 'auto'
    },
    dropdownItem: { padding: '0.75rem 1rem', color: '#035757', textDecoration: 'none', display: 'block', cursor: 'pointer', position: 'relative', transition: 'all 0.2s ease' },
    dropdownItemHover: { background: '#f0f9f9', color: '#00bcd4' },
    subDropdown: {
      position: 'absolute', left: '100%', top: 0, backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: 6,
      minWidth: 280, zIndex: 1001, padding: '0.5rem 0', transition: 'all 0.3s ease', transform: 'translateX(10px)', opacity: 0, pointerEvents: 'none'
    },
    subDropdownVisible: {
      position: 'absolute', left: '100%', top: 0, backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: 6,
      minWidth: 280, zIndex: 1001, padding: '0.5rem 0', transition: 'all 0.3s ease', transform: 'translateX(0)', opacity: 1, pointerEvents: 'auto'
    },
    mobileMenuButton: { background: 'none', border: 'none', cursor: 'pointer', color: '#035757', padding: '0.5rem', display: isMobile ? 'block' : 'none' },
    mobileMenu: {
      position: 'fixed', top: 0, right: 0, height: '100vh', width: 280, backgroundColor: 'white', boxShadow: '-4px 0 6px rgba(0,0,0,0.1)',
      zIndex: 1000, padding: '2rem 1rem', transform: isMenuOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.3s ease', display: 'flex', flexDirection: 'column', gap: '1rem'
    },
    button: { backgroundColor: '#035757', color: 'white', border: 'none', borderRadius: 6, padding: '0.75rem 1.5rem', fontWeight: 600, cursor: 'pointer' },
  };

  const baseColor = '#035757';
  const hoverColor = '#00bcd4';

  const NavItemLink: React.FC<{ onClick?: () => void; children: React.ReactNode }> = ({ onClick, children }) => {
    const [hovered, setHovered] = useState(false);
    return (
      <a
        style={{ ...styles.navLink, color: hovered ? hoverColor : baseColor }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onClick}
      >
        {children}
        <span
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            height: 2,
            width: hovered ? '100%' : 0,
            background: hoverColor,
            transition: 'width 200ms ease',
          }}
        />
      </a>
    );
  };

  const DropdownItemLink: React.FC<{ onClick?: () => void; children: React.ReactNode }> = ({ onClick, children }) => {
    const [hovered, setHovered] = useState(false);
    return (
      <a
        style={{
          ...styles.dropdownItem,
          ...(hovered ? styles.dropdownItemHover : {}),
          paddingLeft: hovered ? '1.25rem' : '1rem',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onClick}
      >
        <span
          style={{
            position: 'absolute',
            left: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            width: hovered ? 6 : 0,
            height: 6,
            borderRadius: 9999,
            background: hoverColor,
            transition: 'width 200ms ease',
          }}
        />
        <span>{children}</span>
      </a>
    );
  };

  return (
    <>
      {/* Top social bar */}
      <div style={styles.socialBar}>
        <div style={styles.socialLinks}>
          <a href="https://api.whatsapp.com/send/?phone=6281293395500&text&type=phone_number&app_absent=0" style={styles.socialLink}><img src={WhatsAppIcon} alt="WhatsApp" style={styles.socialIconImage} />{!isMobile && 'Whatsapp'}</a>
          <a href="https://www.instagram.com/smkmetland/" style={styles.socialLink}><img src={InstagramIcon} alt="Instagram" style={styles.socialIconImage} />{!isMobile && 'Instagram'}</a>
          <a href="https://www.facebook.com/SMKMetland/" style={styles.socialLink}><img src={FacebookIcon} alt="Facebook" style={styles.socialIconImage} />{!isMobile && 'Facebook'}</a>
          <a href="https://www.youtube.com/channel/UCrxrH9tASSF3FNez-fTMKZA" style={styles.socialLink}><img src={YouTubeIcon} alt="YouTube" style={styles.socialIconImage} />{!isMobile && 'Youtube'}</a>
          <a href="https://www.tiktok.com/@smkmetland" style={styles.socialLink}><img src={TikTokIcon} alt="TikTok" style={styles.socialIconImage} />{!isMobile && 'Tiktok'}</a>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button style={styles.flagButton}><img src={IdFlag} alt="Bahasa Indonesia" style={styles.flagIcon} /></button>
          <button style={styles.flagButton}><img src={EnFlag} alt="English" style={styles.flagIcon} /></button>
        </div>
      </div>

      {/* Header */}
      <header style={styles.header}>
        <img src="/SMKMetland.png" alt="SMK Metland" style={styles.logoImage} onClick={() => navigate('/')} />
        <nav style={styles.nav}>
          <div style={styles.navItem}><NavItemLink onClick={() => navigate('/')}>BERANDA</NavItemLink></div>
          <div style={styles.navItem}
               onMouseEnter={() => setHoveredDropdown('tentang')}
               onMouseLeave={() => setHoveredDropdown('')}
          >
            <NavItemLink>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>TENTANG SEKOLAH <ChevronDown size={16} /></span>
            </NavItemLink>
            <div style={hoveredDropdown === 'tentang' ? styles.dropdownVisible : styles.dropdown}>
              <DropdownItemLink>Sejarah Sekolah</DropdownItemLink>
              <DropdownItemLink onClick={() => navigate('/visi-misi')}>VISI & MISI</DropdownItemLink>
              <DropdownItemLink onClick={() => navigate('/nilai-budaya-sekolah')}>Nilai Budaya Sekolah</DropdownItemLink>
              <DropdownItemLink onClick={() => window.location.href = 'https://smkmetlandcibitung.net/'}>Kampus Cibitung</DropdownItemLink>
            </div>
          </div>
          <div style={styles.navItem}
               onMouseEnter={() => setHoveredDropdown('program')}
               onMouseLeave={() => setHoveredDropdown('')}
          >
            <NavItemLink>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>PROGRAM KEAHLIAN <ChevronDown size={16} /></span>
            </NavItemLink>
            <div style={hoveredDropdown === 'program' ? styles.dropdownVisible : styles.dropdown}>
              <DropdownItemLink onClick={() => navigate('/program/akuntansi')}>Akuntansi Bisnis</DropdownItemLink>
              <DropdownItemLink onClick={() => navigate('/program/kuliner')}>Kuliner</DropdownItemLink>
              <DropdownItemLink onClick={() => navigate('/program/perhotelan')}>Perhotelan</DropdownItemLink>
              <DropdownItemLink onClick={() => navigate('/program/ti')}>Teknologi Informasi</DropdownItemLink>
              <DropdownItemLink onClick={() => navigate('/program/dkv')}>Desain Komunikasi Visual</DropdownItemLink>
            </div>
          </div>
          <div style={styles.navItem}
               onMouseEnter={() => setHoveredDropdown('kurikulum')}
               onMouseLeave={() => setHoveredDropdown('')}
          >
            <NavItemLink>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>KURIKULUM <ChevronDown size={16} /></span>
            </NavItemLink>
            <div style={hoveredDropdown === 'kurikulum' ? styles.dropdownVisible : styles.dropdown}>
              <DropdownItemLink onClick={() => (window.location.href = 'https://kurikulum.kemdikbud.go.id/wp-content/uploads/2022/06/Panduan-Pengembangan-Kurikulum-Operasional-di-Satuan-Pendidikan.pdf')}>Kurikulum Operasional Sekolah</DropdownItemLink>
              <div
                style={{
                  ...styles.dropdownItem,
                  ...(hoveredSubDropdown === 'sarana' ? styles.dropdownItemHover : {}),
                }}
                onMouseEnter={() => setHoveredSubDropdown('sarana')}
                onMouseLeave={() => setHoveredSubDropdown('')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Sarana Praktik Siswa</span>
                  <ChevronDown size={16} style={{ transform: 'rotate(-90deg)' }} />
                </div>
                <div style={hoveredSubDropdown === 'sarana' ? styles.subDropdownVisible : styles.subDropdown}>
                  <DropdownItemLink>ARTISAN BEVERAGES STUDIO</DropdownItemLink>
                  <DropdownItemLink>METSCHOO DELI</DropdownItemLink>
                  <DropdownItemLink>PILLO @KALIANA APARTMENT</DropdownItemLink>
                </div>
              </div>
              <DropdownItemLink onClick={() => navigate('/organisasi')}>Organisasi</DropdownItemLink>
              <DropdownItemLink onClick={() => navigate('/ekstrakulikuler')}>Ekstrakulikuler</DropdownItemLink>
            </div>
          </div>
          <div style={styles.navItem}><NavItemLink>BERITA SEKOLAH</NavItemLink></div>
          <div style={styles.navItem}><NavItemLink onClick={() => (window.location.href = 'https://metlandcollege.com/')}>COLLEGE</NavItemLink></div>
          <div style={styles.navItem}><NavItemLink>E-BOOK</NavItemLink></div>
          <div style={styles.navItem}><NavItemLink>BKK</NavItemLink></div>
          <button style={styles.button} onClick={() => navigate('/login')}>MS Learn</button>
        </nav>

        {/* Mobile */}
        <button style={styles.mobileMenuButton} onClick={() => setIsMenuOpen((v) => !v)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        {isMenuOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }} onClick={() => setIsMenuOpen(false)} />
        )}
        <div style={styles.mobileMenu}>
          <a style={styles.navLink} onClick={() => navigate('/')}>BERANDA</a>
          <a style={styles.navLink} onClick={() => navigate('/visi-misi')}>VISI & MISI</a>
          <a style={styles.navLink} onClick={() => navigate('/nilai-budaya-sekolah')}>NILAI BUDAYA SEKOLAH</a>
          <a style={styles.navLink}>TENTANG SEKOLAH</a>
          <a style={styles.navLink} onClick={() => window.location.href = 'https://smkmetlandcibitung.net/'}>KAMPUS CIBITUNG</a>
          <a style={styles.navLink} onClick={() => navigate('/organisasi')}>ORGANISASI</a>
          <a style={styles.navLink} onClick={() => navigate('/program/akuntansi')}>AKUNTANSI BISNIS</a>
          <a style={styles.navLink} onClick={() => navigate('/program/kuliner')}>KULINER</a>
          <a style={styles.navLink} onClick={() => navigate('/program/perhotelan')}>PERHOTELAN</a>
          <a style={styles.navLink} onClick={() => navigate('/program/ti')}>TEKNOLOGI INFORMASI</a>
          <a style={styles.navLink} onClick={() => navigate('/program/dkv')}>DESAIN KOMUNIKASI VISUAL</a>
          <a style={styles.navLink}>KURIKULUM</a>
          <a style={styles.navLink} onClick={() => navigate('/ekstrakulikuler')}>EKSTRAKULIKULER</a>
          <a style={styles.navLink}>BERITA SEKOLAH</a>
          <a style={styles.navLink} onClick={() => (window.location.href = 'https://metlandcollege.com/')}>COLLEGE</a>
          <a style={styles.navLink}>E-BOOK</a>
          <a style={styles.navLink}>BKK</a>
          <button style={{ ...styles.button, width: '100%', marginTop: '1rem' }} onClick={() => navigate('/login')}>MS Learn</button>
        </div>
      </header>
    </>
  );
};

export default SiteHeader;

