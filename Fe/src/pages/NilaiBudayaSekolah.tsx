import React, { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';
import { ShieldCheck, Clock, MessageSquare, Sparkles, Ban, CigaretteOff, Brush, Smile } from 'lucide-react';
import KegiatanImage from '../assets/Kegiatan/WhatsApp-Image-2025-07-21-at-3.25.06-PM-2048x1151.jpg';
import TeacherPhoto from '../assets/Kegiatan/DSC00053-scaled.jpg';

const NilaiBudayaSekolah: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const cintaValues: string[] = [
    'CINTA Kepada Tuhan',
    'CINTA Kepada Orang Tua',
    'CINTA dan Hormat Kepada Guru',
    'CINTA Ilmu Pengetahuan',
    'CINTA Bangsa dan Tanah Air',
    'CINTA Alam, Lingkungan dan Budaya',
    'CINTA Diri Sendiri',
  ];

  const prestasiValues: string[] = [
    'Percaya Diri yang Kuat',
    'Riang dan Selalu Optimis',
    'Empati',
    'Sehat Jiwa dan Raga',
    'Tidak Mudah Menyerah dan Putus Asa',
    'Amanah Sebagai Pemimpin',
    'Siap Menjadi Pribadi Mandiri',
    'Inovatif Dalam Karya yang Bermanfaat',
  ];

  // teacherValues no longer used; replaced by acrostic layout for METLAND | SCHOOL

  const goldenRules: string[] = [
    'Place Honesty in the priority above all.',
    'Should be present according to the timing of attendance and start lesson on-time in class.',
    'Should speak politely and behave well.',
    "Well groomed and dressed respectfully, neat, and clean according to the school’s guideline and regulation.",
    'No bullying and no sexual harassment.',
    'No smoking at the school area.',
    'Keep the school clean and beautiful.',
    'Smile and greet everyone you meet in the school area.',
  ];

  const styles: Record<string, CSSProperties> = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: 'Inter, sans-serif',
      color: '#0f172a',
    },
    container: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '0 1rem',
      paddingTop: isMobile ? 96 : 104, // account for fixed header + social bar
    },
    // Hero
    hero: {
      background: 'linear-gradient(180deg, #F1FAF9 0%, #FFFFFF 100%)',
      border: '1px solid #e5e7eb',
      borderRadius: 16,
      padding: isMobile ? '1rem' : '1.25rem',
      marginBottom: isMobile ? '1rem' : '1.25rem',
    },
    heroInner: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr',
      alignItems: 'center',
      gap: isMobile ? '0.75rem' : '1rem',
    },
    heroLeft: {
      padding: isMobile ? '0.25rem' : '0.5rem',
    },
    heroRight: {
      display: 'flex',
      justifyContent: 'center',
    },
    heroImage: {
      width: '100%',
      maxWidth: 460,
      height: isMobile ? 160 : 260,
      objectFit: 'cover',
      borderRadius: 14,
      border: '1px solid #d1fae5',
      boxShadow: '0 8px 24px rgba(3, 87, 87, 0.12)',
    },
    headerBlock: {
      marginBottom: isMobile ? '0.25rem' : '0.5rem',
    },
    title: {
      fontSize: isMobile ? 28 : 40,
      fontWeight: 800,
      color: '#035757',
      letterSpacing: '0.02em',
      margin: 0,
    },
    subtitle: {
      fontSize: isMobile ? 14 : 16,
      color: '#64748b',
      marginTop: 8,
      marginBottom: 0,
    },
    section: {
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: 14,
      padding: isMobile ? '0.9rem' : '1.2rem',
      marginBottom: '1.25rem',
      boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
    },
    imageCenterWrap: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: isMobile ? '0.75rem' : '1rem',
    },
    imageCenter: {
      width: isMobile ? 140 : 200,
      height: 'auto',
    },
    teacherImageWrap: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: isMobile ? '0.75rem' : '1rem',
    },
    teacherImage: {
      width: '100%',
      maxWidth: isMobile ? 360 : 780,
      height: 'auto',
      borderRadius: 12,
      border: '1px solid #e2e8f0',
      boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
    },
    panel: {
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: 12,
      padding: isMobile ? '0.8rem' : '1rem',
    },
    sectionTitleRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '0.75rem',
      marginBottom: isMobile ? '0.75rem' : '1rem',
    },
    sectionTitle: {
      fontSize: isMobile ? 20 : 24,
      fontWeight: 800,
      color: '#035757',
      letterSpacing: '0.01em',
      margin: 0,
    },
    grid2: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))',
      gap: isMobile ? '0.75rem' : '1rem',
    },
    grid3: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))',
      gap: isMobile ? '0.75rem' : '1rem',
    },
    card: {
      display: 'flex',
      flexDirection: 'column',
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: 12,
      overflow: 'hidden',
      boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
      transition: 'transform 200ms ease, box-shadow 200ms ease',
    },
    cardImage: {
      width: '100%',
      height: isMobile ? 120 : 140,
      objectFit: 'cover',
      display: 'block',
      background: '#f1f5f9',
    },
    cardBody: {
      padding: '0.75rem 0.9rem',
    },
    cardTitle: {
      margin: 0,
      color: '#0f172a',
      fontWeight: 700,
      fontSize: isMobile ? 14 : 15.5,
      lineHeight: 1.4,
    },
    // Acrostic styles for METLAND (left) and SCHOOL (right)
    acrostic: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr',
      gap: isMobile ? '0.5rem' : '0.6rem',
    },
    acrosticRow: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: isMobile ? '0.5rem' : '0.75rem',
    },
    acrosticItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.65rem',
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: 12,
      padding: '0.6rem 0.75rem',
      boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
    },
    initialBadge: {
      width: 44,
      height: 44,
      borderRadius: 9999,
      background: '#ecfdf5',
      border: '1px solid #bbf7d0',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#035757',
      fontWeight: 800,
      fontSize: isMobile ? 18 : 20,
      lineHeight: 1,
      flexShrink: 0,
    },
    valueText: {
      margin: 0,
      color: '#0f172a',
      fontWeight: 600,
      fontSize: isMobile ? 14 : 15,
    },
    valueTextInitial: {
      fontWeight: 800,
      color: '#009390',
      marginRight: 2,
    },
    // Prestasi acrostic list (P R E S T A S I)
    prestasiList: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: isMobile ? '0.6rem' : '0.75rem',
    },
    prestasiRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.65rem',
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: 12,
      padding: '0.6rem 0.75rem',
      boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
    },
    pills: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0,1fr))',
      gap: isMobile ? '0.5rem' : '0.6rem',
    },
    pill: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      background: '#F1FAF9',
      border: '1px solid #bbf7d0',
      color: '#065f46',
      padding: '0.5rem 0.7rem',
      borderRadius: 9999,
      fontWeight: 600,
    },
    ruleGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: isMobile ? '0.75rem' : '0.9rem',
    },
    ruleCard: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: 12,
      padding: '0.75rem',
    },
    ruleNum: {
      minWidth: 28,
      height: 28,
      borderRadius: 9999,
      background: '#035757',
      color: 'white',
      fontWeight: 800,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2,
    },
    ruleText: {
      margin: 0,
      color: '#0f172a',
      lineHeight: 1.55,
      fontSize: isMobile ? 14 : 15.5,
    },
    ruleIconWrap: {
      width: 36,
      height: 36,
      borderRadius: 9999,
      background: '#ecfdf5',
      border: '1px solid #bbf7d0',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      marginTop: 0,
    },
  };

  return (
    <div style={styles.page}>
      <SiteHeader />
      <main style={styles.container}>
        <section style={styles.hero}>
          <div style={styles.heroInner}>
            <div style={styles.heroLeft}>
        <div style={styles.headerBlock}>
          <h1 style={styles.title}>Nilai Budaya Sekolah</h1>
          <p style={styles.subtitle}>SMK Metland Cileungsi</p>
        </div>
              <p style={{ margin: 0, color: '#334155', lineHeight: 1.7, fontSize: isMobile ? 14 : 15.5 }}>
                Menumbuhkan karakter unggul, membentuk generasi yang percaya diri,
                sehat, tangguh, dan penuh karya.
              </p>
            </div>
            <div style={styles.heroRight}>
              <img
                style={styles.heroImage}
                alt="Nilai Budaya Sekolah"
                src={KegiatanImage}
              />
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.imageCenterWrap}>
            <img
              src="/Generasi-Cinta-Prestasi-300x300.png"
              alt="Generasi Cinta Prestasi"
              style={styles.imageCenter}
            />
          </div>
          <div style={styles.grid2}>
            {/* Left: CINTA */}
            <div style={styles.panel}>
              <div style={styles.sectionTitleRow}>
                <h3 style={styles.sectionTitle}>Cinta</h3>
              </div>
              <div style={styles.prestasiList}>
                {cintaValues.map((text) => (
                  <div key={text} style={styles.prestasiRow}>
                    <span style={styles.valueText as React.CSSProperties}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Right: Prestasi */}
            <div style={styles.panel}>
              <div style={styles.sectionTitleRow}>
                <h3 style={styles.sectionTitle}>Prestasi</h3>
              </div>
              <div style={styles.prestasiList}>
                {prestasiValues.map((text) => {
                  const t = text.trim();
                  const first = t.charAt(0).toUpperCase();
                  const rest = t.slice(1);
                  return (
                    <div key={text} style={styles.prestasiRow}>
                      <span style={styles.valueText as React.CSSProperties}>
                        <span style={styles.valueTextInitial as React.CSSProperties}>{first}</span>
                        {rest}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        

        <section style={styles.section}>
          <div style={styles.teacherImageWrap}>
            <img src={TeacherPhoto} alt="Guru SMK Metland" style={styles.teacherImage} />
          </div>
          <div style={{ ...styles.sectionTitleRow, justifyContent: 'center' }}>
            <h2 style={{ ...styles.sectionTitle, textAlign: 'center' }}>Metland School Teacher's Values</h2>
          </div>
          {(() => {
            // Left column spells METLAND; Right column spells SCHOOL
            const left = [
              { letter: 'M', text: 'Model in integrity' },
              { letter: 'E', text: 'Enthusiastic' },
              { letter: 'T', text: 'Team work' },
              { letter: 'L', text: 'Leadership' },
              { letter: 'A', text: 'Action make it real' },
              { letter: 'N', text: 'Notion' },
              { letter: 'D', text: 'Dedication to service quality' },
            ];
            const right = [
              { letter: 'S', text: 'Sincere' },
              { letter: 'C', text: 'Creative' },
              { letter: 'H', text: 'Helpfull' },
              { letter: 'O', text: 'Optimistic' },
              { letter: 'O', text: 'Ordinary teacher create extraordinary people' },
              { letter: 'L', text: 'Loving' },
            ];
            return (
              <div style={styles.acrostic}>
                {left.map((l, i) => {
                  const lt = l.text.trim();
                  const lFirst = lt.charAt(0).toUpperCase();
                  const lRest = lt.slice(1);
                  const r = right[i];
                  const rt = r ? r.text.trim() : '';
                  const rFirst = rt ? rt.charAt(0).toUpperCase() : '';
                  const rRest = rt ? rt.slice(1) : '';
                  return (
                    <div key={`row-${l.letter}-${i}`} style={styles.acrosticRow}>
                      {/* Left side: METLAND */}
                      <div style={styles.acrosticItem}>
                        <span style={styles.valueText as React.CSSProperties}>
                          <span style={styles.valueTextInitial as React.CSSProperties}>{lFirst}</span>
                          {lRest}
                        </span>
                      </div>
                      {/* Right side: SCHOOL (may be empty on last row) */}
                      {r ? (
                        <div style={styles.acrosticItem}>
                          <span style={styles.valueText as React.CSSProperties}>
                            <span style={styles.valueTextInitial as React.CSSProperties}>{rFirst}</span>
                            {rRest}
                          </span>
                        </div>
                      ) : isMobile ? null : <div />}
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </section>

        <section style={styles.section}>
          <div style={styles.sectionTitleRow}>
          <h2 style={styles.sectionTitle}>8 Golden Rules for Teacher and Student</h2>
          </div>
          <div style={styles.ruleGrid}>
            {goldenRules.map((item, idx) => {
              const icons = [
                ShieldCheck,
                Clock,
                MessageSquare,
                Sparkles,
                Ban,
                CigaretteOff,
                Brush,
                Smile,
              ];
              const Icon = icons[idx % icons.length];
              return (
                <div key={idx} style={styles.ruleCard}>
                  <span style={styles.ruleNum}>{idx + 1}</span>
                  <span style={styles.ruleIconWrap as React.CSSProperties}>
                    <Icon size={18} color="#059669" />
                  </span>
                  <p style={styles.ruleText}>{item}</p>
                </div>
              );
            })}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default NilaiBudayaSekolah;


