import React, { useEffect, useState } from 'react';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';

// Import timeline images
import Img2014 from '../assets/sejarahsekolah/2014.jpg';
import Img2015 from '../assets/sejarahsekolah/2015.jpg';
import Img2016 from '../assets/sejarahsekolah/2016.jpg';
import Img2017 from '../assets/sejarahsekolah/2017.jpg';
import Img2018 from '../assets/sejarahsekolah/2018.jpg';
import Img2019 from '../assets/sejarahsekolah/2019.jpg';
import Img2020 from '../assets/sejarahsekolah/2020.jpg';
import Img2021 from '../assets/sejarahsekolah/2021.jpg';
import Img2022 from '../assets/sejarahsekolah/2022.jpg';
import Img2023 from '../assets/sejarahsekolah/2023.jpg';
import Img2024 from '../assets/sejarahsekolah/2024.jpg';

const SejarahSekolah: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const styles: Record<string, React.CSSProperties> = {
    container: {
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      paddingTop: isMobile ? 96 : 104,
    },
    hero: {
      backgroundImage: 'url(/sekolah.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      height: 400,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      textAlign: 'center',
    },
    heroOverlay: {
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.29)'
    },
    heroTitle: {
      position: 'relative', zIndex: 1,
      fontSize: isMobile ? '1.6rem' : '2.4rem',
      fontWeight: 800,
      textShadow: '2px 2px 4px rgba(0,0,0,0.6)'
    },
    section: {
      padding: isMobile ? '1.5rem 1rem' : '2.5rem 2rem',
      backgroundColor: '#ffffff',
    },
    content: {
      maxWidth: 1100,
      margin: '0 auto',
      color: '#0f172a',
      lineHeight: 1.7,
      fontSize: isMobile ? '1rem' : '1.05rem',
    },
    fullBleed: {
      width: '100vw',
      marginLeft: 'calc(-50vw + 50%)',
      marginRight: 'calc(-50vw + 50%)',
    },
    lead: {
      fontSize: isMobile ? '1rem' : '1.1rem',
      marginBottom: '1rem',
    },
    gridTitle: {
      marginTop: isMobile ? '1.5rem' : '2rem',
      marginBottom: '1rem',
      color: '#035757',
      fontWeight: 800,
      letterSpacing: '0.02em',
      fontSize: isMobile ? '1.2rem' : '1.6rem',
      textTransform: 'uppercase',
      textAlign: 'center'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: isMobile ? '0' : '0',
      marginTop: isMobile ? '0.5rem' : '1rem'
    },
    card: {
      border: 'none',
      borderRadius: 0,
      backgroundColor: 'white',
      overflow: 'hidden'
    },
    cardImage: {
      width: '100%',
      height: 'auto',
      objectFit: 'contain' as const,
      display: 'block',
      backgroundColor: 'white',
      maxHeight: isMobile ? 'calc(100vh - 96px)' : 'calc(100vh - 104px)'
    },
    cardFooter: {
      display: 'none'
    },
    year: { display: 'none' },
  };

  const timeline: Array<{ year: number; src: string }> = [
    { year: 2014, src: Img2014 },
    { year: 2015, src: Img2015 },
    { year: 2016, src: Img2016 },
    { year: 2017, src: Img2017 },
    { year: 2018, src: Img2018 },
    { year: 2019, src: Img2019 },
    { year: 2020, src: Img2020 },
    { year: 2021, src: Img2021 },
    { year: 2022, src: Img2022 },
    { year: 2023, src: Img2023 },
    { year: 2024, src: Img2024 },
  ];

  return (
    <div style={styles.container}>
      <SiteHeader />

      <section style={styles.hero}>
        <div style={styles.heroOverlay} />
        <h1 style={styles.heroTitle}>Sejarah Sekolah</h1>
      </section>

      <section style={styles.section}>
        <div style={styles.content}>
          <p style={styles.lead}>
            SMK Metland berdiri pada 1 April 2014, oleh Yayasan Pendidikan Metland di kawasan perumahan Metland Transyogi, bermula dari 12 siswa pada tahun pertama dengan program studi Perhotelan.
          </p>
          <p style={styles.lead}>
            Pada tahun 2015 bertambah menjadi 185 siswa, SMK Metland mengembangkan program studi Akuntansi, Multimedia dan Tata Boga, dengan fasilitas gedung sekolah berlantai lima. SMK Metland mengalami kemajuan yang signifikan pada bulan Juli 2020, dengan jumlah siswa mencapai 659 yang terbagi dalam empat program studi. Berbagai macam penghargaan dan prestasi telah diraih baik tingkat Nasional maupun ASEAN.
          </p>
          <p style={styles.lead}>
            Berbekal dengan akreditasi A (unggul) yang diperoleh pada tahun 2017, untuk seluruh program studi dan institusi, SMK Metland dengan penuh rasa percaya diri mengembangkan jaringan kerjasama dengan lembaga pendidikan dan industri di kawasan ASEAN dan Nasional. Pada tahun 2019 SMK Metland berhasil mendapatkan sertifikat ISO 9001:2015 dalam pengelolaan sekolah. Hal ini membuktikan bahwa SMK Metland dikelola oleh sebuah manajemen yang profesional.
          </p>
          <p style={styles.lead}>
            Pada April 2020 BNSP (Badan Nasional Sertifikasi Profesi) telah menerbitkan sertifikat lisensi LSP-P1 yang diberikan kepada SMK Metland untuk menjadi penyelenggaraan uji kompetensi dengan standar BNSP dan industri untuk bidang Perhotelan, Tata Boga, Multimedia, Desain Grafis dan Akuntansi.
          </p>

          <h2 style={styles.gridTitle}>Sejarah 2014–2024</h2>
        </div>
        <div style={{ ...styles.fullBleed }}>
          <div style={styles.grid}>
            {timeline.map(({ year, src }) => (
              <div key={year} style={styles.card}>
                <img loading="lazy" src={src} alt={`Sejarah SMK Metland ${year}`} style={styles.cardImage} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SejarahSekolah;


