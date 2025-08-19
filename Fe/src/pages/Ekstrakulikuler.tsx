import React, { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';
import EskullImg1 from '../assets/sementara/Eskull/Rectangle 232.png';
import EskullImg2 from '../assets/sementara/Eskull/Rectangle 233.png';
import EskullImg3 from '../assets/sementara/Eskull/Rectangle 234.png';

type Activity = { name: string; description: string };

const activities: Activity[] = [
  {
    name: 'Basket',
    description:
      'Ekstrakurikuler Basket memberikan kesempatan kepada siswa untuk mengembangkan kemampuan olahraga sekaligus menumbuhkan kerjasama tim, strategi, serta sportivitas.',
  },
  {
    name: 'Futsal',
    description:
      'Melalui Ekstrakurikuler Futsal, siswa dilatih untuk meningkatkan keterampilan mengolah bola, kelincahan, serta membangun kebersamaan dalam suasana kompetitif yang sehat.',
  },
  {
    name: 'Voli',
    description:
      'Ekstrakurikuler Voli mengajarkan teknik dasar hingga lanjutan permainan bola voli serta menumbuhkan jiwa sportif, kekompakan, dan ketahanan fisik siswa.',
  },
  {
    name: 'Taekwondo',
    description:
      'Taekwondo sebagai seni bela diri tidak hanya melatih kekuatan fisik, tetapi juga membentuk kedisiplinan, ketangguhan, serta rasa percaya diri dalam diri siswa.',
  },
  {
    name: 'Flair Bartending',
    description:
      'Pelajari seni pertunjukan bartender, trik, dan keterampilan presentasi yang akan mengesankan setiap penonton!'
  },
  {
    name: 'Seni Lukis',
    description:
      'Ekstrakurikuler Seni Lukis menjadi wadah bagi siswa untuk mengekspresikan imajinasi dan ide melalui karya seni, serta memperdalam teknik melukis dengan berbagai media.'
  },
  {
    name: 'Ilustrasi Digital',
    description:
      'Kegiatan Ilustrasi Digital membekali siswa dengan keterampilan membuat karya seni modern menggunakan perangkat lunak desain, relevan dengan kebutuhan industri kreatif saat ini.'
  },
  {
    name: 'Paskibra',
    description:
      'Ekstrakurikuler Paskibra melatih kedisiplinan, kepemimpinan, serta nasionalisme siswa melalui latihan baris-berbaris dan kegiatan pengibaran bendera.'
  },
  {
    name: 'Badminton',
    description:
      'Dalam Ekstrakurikuler Badminton, siswa dilatih untuk meningkatkan teknik permainan bulu tangkis, stamina, serta menjunjung tinggi sportivitas di setiap pertandingan.'
  },
  {
    name: 'KKR (Kelompok Kesehatan Remaja)',
    description:
      'Melalui KKR, siswa diajak untuk memahami pentingnya kesehatan fisik dan mental, sekaligus berperan aktif dalam kegiatan penyuluhan, pertolongan pertama, dan edukasi kesehatan remaja.'
  },
  {
    name: 'Musik',
    description:
      'Ekstrakurikuler Musik memberikan ruang bagi siswa untuk mengembangkan bakat bermusik, baik dalam instrumen maupun vokal, serta mengasah kreativitas dalam berkarya.'
  },
  {
    name: 'Seni Tari',
    description:
      'Melalui Seni Tari, siswa mempelajari berbagai tarian tradisional maupun modern, sekaligus melestarikan budaya bangsa dan menumbuhkan rasa percaya diri dalam berekspresi.'
  },
  {
    name: 'Script Writing',
    description:
      'Ekstrakurikuler ini melatih kemampuan menulis naskah kreatif untuk film, drama, dan media lainnya. Siswa dibimbing untuk mengasah ide, alur cerita, dan teknik penulisan profesional.'
  },
  {
    name: 'Modelling',
    description:
      'Ekstrakurikuler Modelling membekali siswa dengan keterampilan tampil percaya diri di depan publik melalui pelatihan catwalk, pose, serta etika dalam dunia fashion.'
  },
];

const Ekstrakulikuler: React.FC = () => {
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
    bannerGrid: { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: isMobile ? '0.5rem' : '0.75rem', alignItems: 'center' },
    bannerImageWrap: { width: '100%', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    bannerImage: { width: '100%', height: isMobile ? 180 : 220, objectFit: 'contain', padding: isMobile ? 6 : 8 },
    grid: { display: 'flex', flexWrap: 'wrap', gap: isMobile ? '0.75rem' : '1rem', justifyContent: 'center' },
    card: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1rem', boxShadow: '0 6px 16px rgba(0,0,0,0.06)', width: isMobile ? '100%' : 'calc((100% - 2rem) / 3)' },
    cardTitle: { margin: 0, fontWeight: 800, color: '#035757', fontSize: isMobile ? 16 : 18 },
    cardDescription: { marginTop: 8, color: '#334155', fontSize: isMobile ? 13 : 14, lineHeight: 1.5 },
  };

  return (
    <div style={styles.page}>
      <SiteHeader />
      <main style={styles.container}>
        <section style={{ ...styles.hero, ...styles.section }}>
          <h1 style={styles.title}>EKSTRAKULIKULER</h1>
        </section>
        <section style={styles.section}>
          {isMobile ? (
            <Slider
              dots
              arrows={false}
              autoplay
              autoplaySpeed={3500}
              infinite
              speed={300}
              slidesToShow={1}
              slidesToScroll={1}
            >
              {[EskullImg1, EskullImg2, EskullImg3].map((src, idx) => (
                <div key={idx}>
                  <div style={{ ...styles.bannerImageWrap, height: styles.bannerImage.height as number }}>
                    <img src={src} alt={`Ekstrakurikuler ${idx + 1}`} style={styles.bannerImage} />
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <div style={styles.bannerGrid}>
              <div style={{ ...styles.bannerImageWrap, height: styles.bannerImage.height as number }}>
                <img src={EskullImg1} alt="Ekstrakurikuler 1" style={styles.bannerImage} />
              </div>
              <div style={{ ...styles.bannerImageWrap, height: styles.bannerImage.height as number }}>
                <img src={EskullImg2} alt="Ekstrakurikuler 2" style={styles.bannerImage} />
              </div>
              <div style={{ ...styles.bannerImageWrap, height: styles.bannerImage.height as number }}>
                <img src={EskullImg3} alt="Ekstrakurikuler 3" style={styles.bannerImage} />
              </div>
            </div>
          )}
        </section>
        <section style={styles.section}>
          <div style={styles.grid}>
            {activities.map((item) => (
              <div key={item.name} style={styles.card}>
                <h3 style={styles.cardTitle}>{item.name}</h3>
                <p style={styles.cardDescription}>{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Ekstrakulikuler;
