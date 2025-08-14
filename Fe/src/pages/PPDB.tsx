import React, { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';
import WhatsAppIcon from '../assets/WhatsApp.svg';
import InstagramIcon from '../assets/InstaGram.svg';
import FacebookIcon from '../assets/FaceBook.svg';
import YouTubeIcon from '../assets/YouTube.svg';
import TikTokIcon from '../assets/TikTok.svg';
import WhatsAppIconHover from '../assets/WhatsApp Hover.svg';
import InstagramIconHover from '../assets/InstaGram Hover.svg';
import FacebookIconHover from '../assets/FaceBook Hover.svg';
import YouTubeIconHover from '../assets/YouTube Hover.svg';
import TikTokIconHover from '../assets/TikTok Hover.svg';

const PPDBPage: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const ppdbAssets = import.meta.glob('../assets/sementara/PPDB/*', { eager: true, as: 'url' }) as Record<string, string>;
  const getAsset = (name: string): string | undefined => {
    const entry = Object.entries(ppdbAssets).find(([path]) => path.toLowerCase().includes(name.toLowerCase()));
    return entry ? entry[1] : undefined;
  };

  const heroImage = getAsset('PPDB-WEB-1');
  const alurImage = getAsset('ALUR-PENDAFTARAN');
  const biayaTI = getAsset('RINCIAN-BIAYA-PENDIDIKAN-TI-DKV');
  const biayaAPKUL = getAsset('RINCIAN-BIAYA-PENDIDIKAN-KULINER-PERHOTELAN');
  const biayaAK = getAsset('RINCIAN-BIAYA-PENDIDIKAN-AKUNTANSI');
  const biayaDaftar = getAsset('biaya-PENDAFTARAN');
  const suratPernyataan = getAsset('SURAT') || getAsset('PERNYATAAN');

  const styles: Record<string, CSSProperties> = {
    page: { minHeight: '100vh', background: '#ffffff', color: '#0f172a', fontFamily: 'Inter, sans-serif' },
    container: { maxWidth: 1200, margin: '0 auto', padding: '0 1rem', paddingTop: isMobile ? 96 : 104, paddingBottom: isMobile ? '3rem' : '4rem' },
    hero: { background: 'linear-gradient(180deg, #F1FAF9 0%, #FFFFFF 100%)', border: '1px solid #e5e7eb', borderRadius: 16, padding: isMobile ? '1rem' : '1.25rem', marginBottom: isMobile ? '1rem' : '1.25rem', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr', gap: isMobile ? '0.75rem' : '1rem', alignItems: 'center' },
    heroLeft: {},
    heroTitle: { fontSize: isMobile ? 24 : 34, fontWeight: 900, color: '#035757', margin: 0 },
    heroSubtitle: { marginTop: 6, color: '#64748b', fontSize: isMobile ? 14 : 16 },
    ctas: { display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' },
    ctaPrimary: { background: '#035757', color: '#fff', border: '1px solid #035757', borderRadius: 10, padding: '0.7rem 1rem', fontWeight: 800, cursor: 'pointer' },
    ctaSecondary: { background: '#f1f5f9', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: 10, padding: '0.7rem 1rem', fontWeight: 700, cursor: 'pointer' },
    heroImageWrap: { width: '100%', display: 'flex', justifyContent: isMobile ? 'center' : 'flex-end' },
    heroImageEl: { width: '100%', maxWidth: 520, height: 'auto', borderRadius: 12, objectFit: 'cover', border: '1px solid #e5e7eb' },
    grid: { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: isMobile ? '0.75rem' : '1rem', marginTop: isMobile ? '1rem' : '1.25rem' },
    fullWidthSection: { marginTop: isMobile ? '1rem' : '1.25rem' },
    card: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: isMobile ? '0.75rem' : '1rem' },
    cardTitle: { margin: 0, color: '#035757', fontWeight: 900, fontSize: isMobile ? 16 : 18 },
    img: { width: '100%', height: 'auto', borderRadius: 10, marginTop: '0.5rem', border: '1px solid #e5e7eb' },
    list: { margin: '0.5rem 0 0 1rem' },
    centerBlock: { textAlign: 'center', marginTop: isMobile ? '1.25rem' : '1.75rem', minHeight: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
    centerLogo: { height: isMobile ? 96 : 128, width: 'auto', display: 'block', margin: '0 auto 0.75rem auto' },
    centerTitle: { fontSize: isMobile ? 28 : 36, fontWeight: 900, color: '#035757', margin: 0 },
    centerSubtitle: { fontSize: isMobile ? 20 : 22, fontWeight: 800, color: '#0f172a', marginTop: 6, marginBottom: isMobile ? 12 : 14 },
    socialRow: { display: 'flex', gap: isMobile ? '0.75rem' : '1rem', justifyContent: 'center', alignItems: 'center', marginTop: isMobile ? 10 : 12, marginBottom: isMobile ? 12 : 14, flexWrap: 'wrap' },
    socialCircle: { width: isMobile ? 52 : 56, height: isMobile ? 52 : 56, borderRadius: '50%', background: '#035757', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    socialIcon: { width: isMobile ? 24 : 26, height: isMobile ? 24 : 26, filter: 'brightness(0) invert(1)' },
    ctaRow: { display: 'flex', gap: '0.75rem', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginTop: isMobile ? 12 : 16 },
    ctaLg: { padding: isMobile ? '0.9rem 1.25rem' : '1rem 1.75rem', fontSize: isMobile ? 16 : 18, borderRadius: 12 },
  };

  const SocialIconLinkPPDB: React.FC<{ href: string; icon: string; iconHover: string; label: string }> = ({ href, icon, iconHover, label }) => {
    const [hovered, setHovered] = useState(false);
    return (
      <a href={href} aria-label={label} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ textDecoration: 'none' }}>
        <span style={{
          ...(styles.socialCircle as React.CSSProperties),
          background: hovered ? '#026b6b' : '#035757',
          boxShadow: hovered ? '0 4px 10px rgba(0,0,0,0.25)' : 'none',
          transition: 'background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
        }}>
          <img src={hovered ? iconHover : icon} alt={label} style={{ ...(styles.socialIcon as React.CSSProperties), filter: hovered ? 'none' : 'brightness(0) invert(1)' }} />
        </span>
      </a>
    );
  };

  return (
    <div style={styles.page}>
      <SiteHeader />
      <main style={styles.container}>
        <section style={styles.hero}>
          <div style={styles.heroLeft}>
            <h1 style={styles.heroTitle}>PPDB TA 2025/2026</h1>
            <p style={styles.heroSubtitle}>Penerimaan Peserta Didik Baru SMK Metland Cileungsi</p>
            
          </div>
          <div style={styles.heroImageWrap}>
            {heroImage ? <img src={heroImage} alt="PPDB SMK Metland" style={styles.heroImageEl} /> : null}
          </div>
        </section>

        <section style={styles.fullWidthSection}>
          <div style={styles.card}>
            {biayaDaftar ? <img src={biayaDaftar} alt="Biaya Pendaftaran" style={styles.img} /> : null}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
              {biayaAK ? <img src={biayaAK} alt="Biaya Akuntansi" style={styles.img} /> : null}
              {biayaAPKUL ? <img src={biayaAPKUL} alt="Biaya Kuliner & Perhotelan" style={styles.img} /> : null}
              {biayaTI ? <img src={biayaTI} alt="Biaya TI & DKV" style={styles.img} /> : null}
            </div>
          </div>
        </section>

        <section style={styles.fullWidthSection}>
          <div style={styles.card}>
            {alurImage ? <img src={alurImage} alt="Alur Pendaftaran" style={styles.img} /> : null}
          </div>
        </section>

        {/* Centered CTA block below biaya and above footer */}
        <section style={styles.fullWidthSection}>
          <div style={styles.centerBlock}>
            <img src="/SMK LOGO.png" alt="SMK Metland Logo" style={styles.centerLogo as React.CSSProperties} />
            <h2 style={styles.centerTitle}>PPDB TA 2025/2026</h2>
            <div style={styles.centerSubtitle}>Daftar Sekarang!</div>
            <div style={styles.socialRow}>
              <SocialIconLinkPPDB href="https://api.whatsapp.com/send/?phone=6281293395500&text&type=phone_number&app_absent=0" icon={WhatsAppIcon} iconHover={WhatsAppIconHover} label="WhatsApp" />
              <SocialIconLinkPPDB href="https://www.instagram.com/smkmetland/" icon={InstagramIcon} iconHover={InstagramIconHover} label="Instagram" />
              <SocialIconLinkPPDB href="https://www.facebook.com/SMKMetland/" icon={FacebookIcon} iconHover={FacebookIconHover} label="Facebook" />
              <SocialIconLinkPPDB href="https://www.youtube.com/channel/UCrxrH9tASSF3FNez-fTMKZA" icon={YouTubeIcon} iconHover={YouTubeIconHover} label="YouTube" />
              <SocialIconLinkPPDB href="https://www.tiktok.com/@smkmetland" icon={TikTokIcon} iconHover={TikTokIconHover} label="TikTok" />
            </div>
            <div style={styles.ctaRow}>
              <a href="https://drive.google.com/drive/folders/1tb_h5SPYDxlkkIYFzBxVL0sxyQgbxwCz" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                <button
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.backgroundColor = '#026b6b'; el.style.color = '#D4B800'; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.backgroundColor = '#035757'; el.style.color = '#ffffff'; }}
                  style={{ ...styles.ctaPrimary, ...styles.ctaLg as React.CSSProperties, transition: 'background-color 0.2s ease, color 0.2s ease' }}
                >
                  UNDUH SURAT PERNYATAAN
                </button>
              </a>
              <a href="https://ppdbsmkmetlandcileungsi.net/registration/registrations" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                <button
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.backgroundColor = '#026b6b'; el.style.color = '#D4B800'; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.backgroundColor = '#035757'; el.style.color = '#ffffff'; }}
                  style={{ ...styles.ctaPrimary, ...styles.ctaLg as React.CSSProperties, transition: 'background-color 0.2s ease, color 0.2s ease' }}
                >
                  DAFTAR SEKARANG
                </button>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PPDBPage;


