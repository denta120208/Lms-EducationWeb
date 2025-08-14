import React, { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';

// Build a map of available organization images from src/assets/Organisasi
const rawImages = import.meta.glob('../assets/Organisasi/*.webp', { eager: true, as: 'url' });
const availableImages: Record<string, string> = {};
for (const filePath in rawImages) {
  const fileNameWithExt = filePath.split('/').pop() as string;
  const fileBaseName = fileNameWithExt.replace(/\.webp$/i, '');
  availableImages[fileBaseName] = rawImages[filePath];
}

// Desired order with abbreviation and full name, mapped to asset file base names
const desiredOrganizations: { file: string; abbr: string; full: string }[] = [
  { file: 'OSIS', abbr: 'OSIS', full: 'Organisasi Siswa Intra Sekolah' },
  { file: 'MPK', abbr: 'MPK', full: 'Majelis Perwakilan Kelas' },
  { file: 'MAHES', abbr: 'MAHES', full: 'Maheswara-Maheswari' },
  { file: 'CIVOK', abbr: 'CIVOK', full: 'Cileungsi Vokal' },
  { file: 'CIMS', abbr: 'CIMS', full: 'Cinematography Metland School' },
  { file: 'MSE', abbr: 'MSE', full: 'Metland School Entertainment' },
  { file: 'MSP', abbr: 'MSP', full: 'Metland School Projek' },
  { file: 'MCS', abbr: 'MCS', full: 'Metschoo Care & Share' },
  { file: 'MHEC', abbr: 'MHEC', full: 'Metschoo Hotelier Elite Club' },
  { file: 'CULINARY KINGDOM', abbr: 'CULINARY KINGDOM', full: '' },
  { file: 'ITEC', abbr: 'ITEC', full: 'Information Technology Engineering Club' },
  { file: 'GIFT', abbr: 'GIFT', full: 'Catholic Community Grow In Faith' },
  { file: 'ROHBUD', abbr: 'ROHBUD', full: 'Rohani Budha' },
  { file: 'ROHKRIS', abbr: 'ROHKRIS', full: 'Rohani Kristen' },
  { file: 'ROHIS', abbr: 'ROHIS', full: 'Rohani Islam' },
];

const organizations = desiredOrganizations
  .map((org) => ({ ...org, img: availableImages[org.file] as string | undefined }));

const organizationsWithImage = organizations.filter((org) => Boolean(org.img));
const organizationsWithoutImage = organizations.filter((org) => !org.img);

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
    card: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1rem', boxShadow: '0 6px 16px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    logoWrap: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10, height: isMobile ? 120 : 150 },
    logo: { width: '100%', maxWidth: 260, height: '100%', objectFit: 'contain' },
    textRow: { display: 'flex', alignItems: 'baseline', gap: 8, justifyContent: 'center', flexWrap: 'nowrap' },
    abbr: { margin: 0, fontWeight: 800, color: '#035757', fontSize: isMobile ? 15 : 16 },
    full: { margin: 0, color: '#334155', fontSize: isMobile ? 14 : 15.5 },
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
            {organizationsWithImage.map((org) => (
              <div key={org.file} style={styles.card}>
                <div style={styles.logoWrap}>
                  <img src={org.img as string} alt={org.abbr} title={org.abbr} style={styles.logo} />
                </div>
                <div style={styles.textRow}>
                  <h3 style={styles.abbr}>{org.abbr}</h3>
                  {org.full ? <p style={styles.full}>{org.full}</p> : null}
                </div>
              </div>
            ))}
          </div>
        </section>

        {organizationsWithoutImage.length > 0 ? (
          <section style={styles.section}>
            <div style={styles.grid}>
              {organizationsWithoutImage.map((org) => (
                <div key={org.file} style={styles.card}>
                  <div style={styles.textRow}>
                    <h3 style={styles.abbr}>{org.abbr}</h3>
                    {org.full ? <p style={styles.full}>{org.full}</p> : null}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </div>
  );
};

export default Organisasi;
