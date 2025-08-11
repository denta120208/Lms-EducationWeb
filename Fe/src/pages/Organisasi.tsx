import React, { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';

const organizations = [
  { key: 'osis', name: 'OSIS', desc: 'Organisasi Siswa Intra Sekolah sebagai wadah kepemimpinan dan pengembangan karakter siswa.' },
  { key: 'cims', name: 'CIMS', desc: 'Cinematography & Broadcasting Metland School, komunitas sineas dan penyiaran sekolah.' },
  { key: 'paskibra', name: 'Paskibra', desc: 'Pasukan pengibar bendera, melatih disiplin, fisik, dan nasionalisme.' },
  { key: 'mpk', name: 'Majelis Perwakilan Kelas', desc: 'Lembaga legislatif siswa sebagai mitra OSIS dalam pengawasan program.' },
  { key: 'rohis', name: 'Rohis – Rokhis', desc: 'Rohani Islam/Rohani Kristen, pembinaan keagamaan dan akhlak mulia.' },
  { key: 'pramuka', name: 'Pramuka', desc: 'Gerakan Pramuka yang menanamkan kemandirian, kebersamaan, dan kepemimpinan.' },
  { key: 'maheswara', name: 'Maheswara-Maheswari', desc: 'Komunitas seni dan budaya untuk menyalurkan bakat siswa.' },
  { key: 'kkr', name: 'KKR (Kader Kesehatan Remaja)', desc: 'Duta kesehatan remaja, edukasi PHBS dan layanan kesehatan dasar sekolah.' },
  { key: 'msp', name: 'MSP (Metland School Project)', desc: 'Project kolaboratif lintas jurusan untuk inovasi dan dampak sosial.' },
];

const Organisasi: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const styles: Record<string, CSSProperties> = {
    page: { minHeight: '100vh', background: '#ffffff', color: '#0f172a', fontFamily: 'Inter, sans-serif' },
    container: { maxWidth: 1200, margin: '0 auto', padding: '0 1rem', paddingTop: isMobile ? 96 : 104, paddingBottom: isMobile ? '3rem' : '4rem' },
    hero: {
      background: 'linear-gradient(180deg, #F1FAF9 0%, #FFFFFF 100%)', border: '1px solid #e5e7eb', borderRadius: 16,
      padding: isMobile ? '1rem' : '1.25rem', marginBottom: isMobile ? '1rem' : '1.25rem'
    },
    title: { fontSize: isMobile ? 28 : 40, fontWeight: 800, color: '#035757', margin: 0, textAlign: 'center' },
    section: { marginBottom: isMobile ? '1.5rem' : '2rem' },
    grid: { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: isMobile ? '0.75rem' : '1rem' },
    card: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1rem', boxShadow: '0 6px 16px rgba(0,0,0,0.06)' },
    cardTitle: { margin: 0, fontWeight: 800, color: '#035757', fontSize: isMobile ? 16 : 18 },
    cardDesc: { marginTop: 6, lineHeight: 1.6, fontSize: isMobile ? 14 : 15.5, color: '#334155' },
  };

  return (
    <div style={styles.page}>
      <SiteHeader />
      <main style={styles.container}>
        <section style={{ ...styles.hero, ...styles.section }}>
          <h1 style={styles.title}>Organisasi</h1>
        </section>
        <section style={styles.section}>
          <div style={styles.grid}>
            {organizations.map((org) => (
              <div key={org.key} style={styles.card}>
                <h3 style={styles.cardTitle}>{org.name}</h3>
                <p style={styles.cardDesc}>{org.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Organisasi;
