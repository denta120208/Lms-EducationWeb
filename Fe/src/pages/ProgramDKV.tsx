import React, { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';

const ProgramDKV: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const competencies = [
    'Ruang lingkup desain komunikasi visual',
    'Unsur-unsur desain komunikasi visual',
    'Jenis dan karakter media menurut penempatannya (indoor dan outdoor)',
    'Jenis dan karakter media menurut temanya (sosial dan komersial)',
    'Jenis dan karakter media menurut bentuknya (2 dan 3 dimensi)',
    'Tata letak unsur-unsur desain komunikasi visual',
    'Prosedur pembuatan media 2 dan 3 dimensi',
  ];

  const careers = [
    'Graphic Designer',
    'Ilustrator',
    'Artist',
    'Videographer',
    'Photographer',
    'Event Organizer (EO)',
    'Advertising',
    'Percetakan & Penerbitan',
    'Web Designer, Manager, dan Director',
    'DLL',
  ];

  const styles: Record<string, CSSProperties> = {
    page: { minHeight: '100vh', background: '#fff', color: '#0f172a', fontFamily: 'Inter, sans-serif' },
    container: { maxWidth: 1200, margin: '0 auto', padding: '0 1rem', paddingTop: isMobile ? 96 : 104 },
    hero: { background: 'linear-gradient(180deg, #F1FAF9 0%, #FFFFFF 100%)', border: '1px solid #e5e7eb', borderRadius: 16, padding: isMobile ? '1rem' : '1.25rem', marginBottom: isMobile ? '1rem' : '1.25rem' },
    title: { fontSize: isMobile ? 28 : 40, fontWeight: 800, color: '#035757', margin: 0, textAlign: 'center' },
    subtitle: { fontSize: isMobile ? 14 : 16, color: '#64748b', marginTop: 8, marginBottom: 0, textAlign: 'center' },
    section: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: isMobile ? '1rem' : '1.25rem', marginBottom: '1rem' },
    list: { margin: '0.5rem 0 0 1rem' },
    paragraph: { margin: 0, lineHeight: 1.7, fontSize: isMobile ? 14 : 15.5, color: '#334155' },
  };

  return (
    <div style={styles.page}>
      <SiteHeader />
      <main style={styles.container}>
        <section style={styles.hero}>
          <h1 style={styles.title}>Desain Komunikasi Visual</h1>
        </section>
        <section style={styles.section}>
          <p style={styles.paragraph}>
            Desain Komunikasi Visual mempelajari ruang lingkup dan unsur-unsur DKV, tata letak, serta karakter media berdasarkan
            penempatan, tema, dan bentuk (2D dan 3D), berikut prosedur pembuatan media 2 dan 3 dimensi. Program ini bertujuan untuk
            membentuk karakter siswa yang bersyukur, berpikir saintifik dalam berkarya, serta ramah lingkungan dan berbasis sosial-budaya bangsa.
          </p>
        </section>
        <section style={styles.section}>
          <h3 style={{ margin: 0, color: '#035757', fontWeight: 800 }}>Kompetensi / Materi</h3>
          <ol style={styles.list}>{competencies.map((c) => (<li key={c}>{c}</li>))}</ol>
        </section>
        <section style={styles.section}>
          <h3 style={{ margin: 0, color: '#035757', fontWeight: 800 }}>Profesi / Bidang Pekerjaan</h3>
          <ol style={styles.list}>{careers.map((c) => (<li key={c}>{c}</li>))}</ol>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProgramDKV;
