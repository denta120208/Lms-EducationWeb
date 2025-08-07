import React from 'react';
import WhatsAppIcon from '../assets/WhatsApp.svg';
import InstagramIcon from '../assets/InstaGram.svg';
import FacebookIcon from '../assets/FaceBook.svg';
import YouTubeIcon from '../assets/YouTube.svg';
import TikTokIcon from '../assets/TikTok.svg';

const Footer: React.FC = () => {
  const styles = {
    footer: {
      backgroundColor: '#004E4E',
      color: 'white',
      padding: '2rem 2rem 1rem',
    },
    footerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    footerGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '2rem',
      marginBottom: '2rem',
    },
    footerSection: {
      display: 'flex',
      flexDirection: 'column',
    },
    footerTitle: {
      fontSize: '1rem',
      fontWeight: 600,
      marginBottom: '0.5rem',
      color: 'white',
    },
    footerText: {
      fontSize: '0.8rem',
      lineHeight: '1.3',
      color: '#b0c4c4',
      marginBottom: '0.3rem',
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
    widgetBlock: {
      marginBottom: '1rem',
    },
    mapIframe: {
      border: '0',
      width: '600px',
      height: '250px',
      maxWidth: '100%',
    },
    youtubeIframe: {
      border: '0',
      width: '450px',
      height: '250px',
      maxWidth: '100%',
    },
  };

  return (
    <>
      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerGrid}>
            {/* Left Column - Logo and Social Media */}
            <div style={styles.footerSection}>
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <img src="/SMK LOGO.png" alt="SMK Metland Logo" style={{ height: '200px', marginBottom: '1rem' }} />
              </div>
              <div style={{ ...styles.footerSocial, justifyContent: 'center' }}>
                <a href="#" style={styles.socialIcon}>
                  <img src={WhatsAppIcon} alt="WhatsApp" style={{ width: '20px', height: '20px', filter: 'brightness(0) invert(1)' }} />
                </a>
                <a href="#" style={styles.socialIcon}>
                  <img src={InstagramIcon} alt="Instagram" style={{ width: '20px', height: '20px', filter: 'brightness(0) invert(1)' }} />
                </a>
                <a href="#" style={styles.socialIcon}>
                  <img src={FacebookIcon} alt="Facebook" style={{ width: '20px', height: '20px', filter: 'brightness(0) invert(1)' }} />
                </a>
                <a href="#" style={styles.socialIcon}>
                  <img src={YouTubeIcon} alt="YouTube" style={{ width: '20px', height: '20px', filter: 'brightness(0) invert(1)' }} />
                </a>
                <a href="#" style={styles.socialIcon}>
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