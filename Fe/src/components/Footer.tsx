import React, { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import WhatsAppIcon from '../assets/WhatsApp.svg';
import InstagramIcon from '../assets/InstaGram.svg';
import FacebookIcon from '../assets/FaceBook.svg';
import YouTubeIcon from '../assets/YouTube.svg';
import TikTokIcon from '../assets/TikTok.svg';

const Footer: React.FC = () => {
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const isMobile = windowWidth <= 768;

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const styles: Record<string, CSSProperties> = {
    footer: {
      backgroundColor: '#004E4E',
      backgroundImage: 'url(/footer.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      color: 'white',
      padding: isMobile ? '1.5rem 1rem 0.75rem' : '2rem 2rem 1rem',
      position: 'relative',
    },
    footerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    footerGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
      gap: isMobile ? '1.25rem' : '2rem',
      marginBottom: '2rem',
      alignItems: 'start',
    },
    footerSection: {
      display: 'flex',
      flexDirection: 'column',
    },
    footerTitle: {
      fontSize: isMobile ? '0.95rem' : '1rem',
      fontWeight: 600,
      marginBottom: '0.5rem',
      color: 'white',
    },
    footerText: {
      fontSize: isMobile ? '0.85rem' : '0.8rem',
      lineHeight: '1.3',
      color: '#b0c4c4',
      marginBottom: '0.3rem',
    },
    footerSocial: {
      display: 'flex',
      gap: isMobile ? '0.75rem' : '1rem',
      marginTop: isMobile ? '0.75rem' : '1rem',
      justifyContent: isMobile ? 'center' : 'flex-start',
      marginLeft: isMobile ? '0rem' : '-2rem',
    },
    socialIcon: {
      width: isMobile ? '36px' : '40px',
      height: isMobile ? '36px' : '40px',
      borderRadius: '50%',
      backgroundColor: '#035757',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      textDecoration: 'none',
      transition: 'background-color 0.3s ease',
    },
    widgetBlock: {
      marginBottom: '1rem',
    },
    mapIframe: {
      border: '0',
      width: '100%',
      height: isMobile ? '200px' : '250px',
      maxWidth: '100%',
    },
    youtubeIframe: {
      border: '0',
      width: '100%',
      height: isMobile ? '220px' : '250px',
      maxWidth: '100%',
    },
    logoContainer: {
      textAlign: isMobile ? 'center' : 'left',
      marginBottom: isMobile ? '0.75rem' : '1rem',
      marginTop: isMobile ? '1rem' : '5rem',
    },
    logoImage: {
      height: isMobile ? '120px' : '200px',
      marginBottom: '1rem',
    },
  };

  return (
    <>
      {/* Footer */}
      <footer style={styles.footer}>
        {/* Green overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 78, 78, 0.8)',
          zIndex: 1,
        }}></div>
        <div style={{ ...styles.footerContent, position: 'relative', zIndex: 2 }}>
          <div style={styles.footerGrid}>
            {/* Left Column - Logo and Social Media */}
            <div style={styles.footerSection}>
              <div style={styles.logoContainer}>
                <img src="/SMK LOGO.png" alt="SMK Metland Logo" style={styles.logoImage} />
              </div>
              <div style={{ ...styles.footerSocial, marginTop: isMobile ? '0.5rem' : '2rem' }}>
                <a href="https://api.whatsapp.com/send/?phone=6281293395500&text&type=phone_number&app_absent=0" style={styles.socialIcon}>
                  <img src={WhatsAppIcon} alt="WhatsApp" style={{ width: '20px', height: '20px', filter: 'brightness(0) invert(1)' }} />
                </a>
                <a href="https://www.instagram.com/smkmetland/" style={styles.socialIcon}>
                  <img src={InstagramIcon} alt="Instagram" style={{ width: '20px', height: '20px', filter: 'brightness(0) invert(1)' }} />
                </a>
                <a href="https://www.facebook.com/SMKMetland/" style={styles.socialIcon}>
                  <img src={FacebookIcon} alt="Facebook" style={{ width: '20px', height: '20px', filter: 'brightness(0) invert(1)' }} />
                </a>
                <a href="https://www.youtube.com/channel/UCrxrH9tASSF3FNez-fTMKZA" style={styles.socialIcon}>
                  <img src={YouTubeIcon} alt="YouTube" style={{ width: '20px', height: '20px', filter: 'brightness(0) invert(1)' }} />
                </a>
                <a href="https://www.tiktok.com/@smkmetland" style={styles.socialIcon}>
                  <img src={TikTokIcon} alt="TikTok" style={{ width: '20px', height: '20px', filter: 'brightness(0) invert(1)' }} />
                </a>
              </div>
            </div>
            
            {/* Center Column - Programs and YouTube */}
            <div style={styles.footerSection}>
              <h4 style={styles.footerTitle}>PROGRAM KEAHLIAN</h4>
              <p style={styles.footerText}>Akuntansi Bisnis</p>
              <p style={styles.footerText}>Perhotelan</p>
              <p style={styles.footerText}>Kuliner</p>
              <p style={styles.footerText}>Desain Komunikasi Visual</p>
              <p style={styles.footerText}>Teknologi Informasi</p>
              
              <div style={styles.widgetBlock}>
                <iframe 
                  src="https://www.youtube.com/embed/lAVuAJWvEmE?si=I8LyXg6jPtYRiao8" 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  allowFullScreen={true}
                  style={styles.youtubeIframe}
                ></iframe>
              </div>
            </div>
            
            {/* Right Column - Contact Info and Google Maps */}
            <div style={styles.footerSection}>
              <h4 style={styles.footerTitle}>HUBUNGI KAMI</h4>
              <p style={styles.footerText}>
                <strong>Lokasi:</strong><br />
                Jl. Kota Taman Metropolitan, Cileungsi Kidul, Kec. Cileungsi, Kabupaten Bogor, Jawa Barat 16820
              </p>
              <p style={styles.footerText}>
                <strong>Telepon:</strong> (021) 82496976
              </p>
              <p style={styles.footerText}>
                <strong>WhatsApp:</strong> +6281293395500
              </p>
              <p style={styles.footerText}>
                <strong>Website:</strong> www.smkmetland.net
              </p>
              
              <div style={styles.widgetBlock}>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.927652227007!2d106.97310707587015!3d-6.4033226626283035!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e699445f0d1c541%3A0x3c8a27a75eb76093!2sSMK%20Metland%20School!5e0!3m2!1sid!2sid!4v1745395085620!5m2!1sid!2sid" 
                  style={styles.mapIframe}
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Second Footer Layer */}
      <div style={{
        backgroundColor: '#004545',
        color: 'white',
        padding: '0.5rem 2rem',
        textAlign: 'center',
        fontSize: '0.9rem'
      }}>
        <p style={{ margin: 0 }}>Copyright © 2023 SMK METLAND | Powered by SMK METLAND.</p>
      </div>
    </>
  );
};

export default Footer; 