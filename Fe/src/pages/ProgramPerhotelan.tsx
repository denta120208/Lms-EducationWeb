import React, { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';

const ProgramPerhotelan: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const styles: Record<string, CSSProperties> = {
    page: { minHeight: '100vh', background: '#fff', color: '#0f172a', fontFamily: 'Inter, sans-serif' },
    container: { maxWidth: 1200, margin: '0 auto', padding: '0 1rem', paddingTop: isMobile ? 96 : 104 },
    hero: { background: 'linear-gradient(180deg, #F1FAF9 0%, #FFFFFF 100%)', border: '1px solid #e5e7eb', borderRadius: 16, padding: isMobile ? '1rem' : '1.25rem', marginBottom: isMobile ? '1rem' : '1.25rem' },
    title: { fontSize: isMobile ? 28 : 40, fontWeight: 800, color: '#035757', margin: 0, textAlign: 'center' },
    section: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: isMobile ? '1rem' : '1.25rem', marginBottom: '1rem' },
    paragraph: { margin: 0, lineHeight: 1.7, fontSize: isMobile ? 14 : 15.5, color: '#334155' },
  };

  return (
    <div style={styles.page}>
      <SiteHeader />
      <main style={styles.container}>
        <section style={styles.hero}>
          <h1 style={styles.title}>Perhotelan</h1>
        </section>
        <section style={styles.section}>
          <p style={styles.paragraph}>
            Berdasarkan INPRES REVITALISASI SMK sebagai perekat stakeholder dan Peraturan Pemerintah No. 48 tahun 2008 Pendanaan Pendidikan
            dan No 17 Tentang Pengelolaan serta Penyelenggaraan Pendidikan dan perubahannya, disebutkan bahwa SMK Metland adalah Badan
            Layanan Umum Daerah (BLUD) Kementerian Pendidikan dan Kebudayaan pada bidang pengembangan dan pelatihan SMK yang berada dibawah
            tanggung jawab Direktorat Jenderal GTK. SMK Metland memiliki tugas melaksanakan pengembangan karakter dan mutu pendidikan
            masyarakat salah satunya dengan Program Pendidikan Perhotelan yang bertujuan melatih langsung tentang tanggung jawab praktik
            bidang Perhotelan secara profesional.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProgramPerhotelan;
