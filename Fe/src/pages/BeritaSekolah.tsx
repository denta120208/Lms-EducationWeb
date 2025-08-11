import React, { useMemo, useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';
import { Search, X as CloseIcon } from 'lucide-react';

// Reuse berita images from sementara
import ImgCybersecurity from '../assets/sementara/cybersecurity.jpg';
import ImgParallaxnet from '../assets/sementara/PARALLAXNET.jpg';
import ImgWorkshop from '../assets/sementara/Workshop Ilustrasi Digital.jpg';
import ImgLLM from '../assets/sementara/Project-LLM-Siswa.jpg';
import ImgCollab from '../assets/sementara/Collaboration between Indonesia and Thailand.jpg';

type NewsItem = {
  id: string;
  title: string;
  date: string;
  image: string;
};

const ALL_NEWS: NewsItem[] = [
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Di Sekolah : Dimulai Dari Diri Sendiri',
    date: '15 Januari 2025',
    image: ImgCybersecurity,
  },
  {
    id: 'parallaxnet',
    title: 'JALIN KERJASAMA, METLAND SCHOOL DAN PARALLAXNET USUNG KURIKULUM TECHNOPRENEUR',
    date: '06 Agustus 2025',
    image: ImgParallaxnet,
  },
  {
    id: 'workshop',
    title: 'SMK Metland Cileungsi Bersama Huion Gelar Seminar dan Workshop Ilustrasi Digital',
    date: '30 Juli 2025',
    image: ImgWorkshop,
  },
  {
    id: 'llm',
    title: 'Pembelajaran Large Language Models (LLM) dalam Kurikulum Sekolah Menengah Kejuruan',
    date: '23 Juli 2025',
    image: ImgLLM,
  },
  {
    id: 'collab',
    title:
      'Enhancing Digital Literacy through TVET Fostering Synergy and Collaboration between Indonesia and Thailand',
    date: '22 Juli 2025',
    image: ImgCollab,
  },
];

const BeritaSekolah: React.FC = () => {
  const [pendingQuery, setPendingQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filtered = useMemo(() => {
    const q = appliedQuery.trim().toLowerCase();
    if (!q) return ALL_NEWS;
    return ALL_NEWS.filter((n) => n.title.toLowerCase().includes(q));
  }, [appliedQuery]);

  const styles: Record<string, CSSProperties> = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      paddingTop: isMobile ? '96px' : '104px',
      fontFamily: 'Inter, sans-serif',
    },
    pageHeaderWrap: {
      background: 'linear-gradient(180deg, #f3fbfb 0%, #ffffff 100%)',
      borderBottom: '1px solid #e5e7eb',
    },
    pageHeader: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '2rem',
      display: 'flex',
      alignItems: isMobile ? 'stretch' : 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      flexDirection: isMobile ? 'column' : 'row',
    },
    titleBlock: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
    },
    title: {
      color: '#035757',
      fontSize: isMobile ? '1.6rem' : '2.2rem',
      fontWeight: 800,
      margin: 0,
      letterSpacing: '-0.01em',
    },
    subtitle: {
      color: '#475569',
      fontSize: isMobile ? '0.95rem' : '1rem',
      margin: 0,
    },
    searchWrap: {
      position: 'relative',
      flex: isMobile ? '1 1 auto' : '0 0 420px',
      width: isMobile ? '100%' : undefined,
    },
    searchControls: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    },
    searchIcon: {
      position: 'absolute',
      left: 12,
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#6b7280',
      pointerEvents: 'none',
    },
    searchInput: {
      width: '100%',
      padding: '0.75rem 1rem 0.75rem 2.5rem',
      borderRadius: 10,
      border: '1px solid #d1d5db',
      fontSize: '1rem',
      outline: 'none',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04) inset',
    },
    searchBtn: {
      backgroundColor: '#035757',
      color: 'white',
      border: 'none',
      borderRadius: 10,
      padding: '0.7rem 1rem',
      fontWeight: 700,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
    },
    clearBtn: {
      backgroundColor: '#f1f5f9',
      color: '#0f172a',
      border: '1px solid #e2e8f0',
      borderRadius: 10,
      padding: '0.65rem 0.8rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      maxWidth: 1200,
      width: '100%',
      margin: '0 auto',
      padding: '2rem',
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
      gap: '1.5rem',
    },
    card: {
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: 12,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    },
    image: {
      width: '100%',
      height: 200,
      objectFit: 'cover',
      backgroundColor: '#f3f4f6',
    },
    meta: {
      fontSize: '0.85rem',
      color: '#64748b',
      padding: '0.75rem 1rem 0 1rem',
    },
    cardTitle: {
      fontSize: '1.05rem',
      fontWeight: 750,
      color: '#111827',
      padding: '0.5rem 1rem 1rem 1rem',
      lineHeight: 1.35,
    },
    empty: {
      gridColumn: '1 / -1',
      textAlign: 'center',
      color: '#6b7280',
      padding: '2rem 0',
    },
  };

  return (
    <div style={styles.container}>
      <SiteHeader />
      <div style={styles.pageHeaderWrap}>
        <div style={styles.pageHeader}>
          <div style={styles.titleBlock}>
            <h1 style={styles.title}>Berita Sekolah</h1>
            <p style={styles.subtitle}>Kabar terbaru seputar aktivitas dan prestasi Metland School</p>
          </div>
          <div style={{ ...styles.searchWrap }}>
            <Search size={18} style={styles.searchIcon} />
            <div style={styles.searchControls}>
              <input
                aria-label="Cari berita"
                placeholder="Cari berita..."
                value={pendingQuery}
                onChange={(e) => setPendingQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setAppliedQuery(pendingQuery);
                  }
                }}
                style={{ ...styles.searchInput, flex: '1 1 auto' }}
              />
              {appliedQuery ? (
                <button
                  type="button"
                  aria-label="Bersihkan pencarian"
                  title="Bersihkan"
                  style={styles.clearBtn}
                  onClick={() => { setPendingQuery(''); setAppliedQuery(''); }}
                >
                  <CloseIcon size={18} />
                </button>
              ) : (
                <button
                  type="button"
                  style={styles.searchBtn}
                  onClick={() => setAppliedQuery(pendingQuery)}
                >
                  Search
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.content}>
        {filtered.length === 0 && (
          <div style={styles.empty}>Tidak ada berita yang cocok.</div>
        )}
        {filtered.map((n) => (
          <div key={n.id} style={styles.card}>
            <img src={n.image} alt={n.title} style={styles.image} />
            <div style={styles.meta}>{n.date}</div>
            <div style={styles.cardTitle}>{n.title}</div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default BeritaSekolah;


