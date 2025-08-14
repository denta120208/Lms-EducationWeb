import React, { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ProgramAkuntansi: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const competencies = [
    'Pengantar Ekonomi dan Bisnis',
    'Pengantar Administrasi Perkantoran',
    'Akuntansi Keuangan',
    'Akuntansi Perusahaan Dagang',
    'Akuntansi Manufaktur',
    'Komputer Akuntansi (MYOB, Zahir)',
    'Administrasi Pajak',
  ];

  const careers = [
    'Penata Buku Muda',
    'Kasir / Teller',
    'Juru Penggajian',
    'Operator Mesin Hitung',
    'Administrasi Gudang',
    'Menyusun Laporan Keuangan',
    'dan lain-lain',
  ];

  const rawGallery = import.meta.glob('../assets/sementara/Akutansi/*', { eager: true, as: 'url' }) as Record<string, string>;
  const galleryImages = Object.entries(rawGallery).map(([path, url]) => ({
    url,
    name: (path.split('/')?.pop() || '').replace(/[-_]/g, ' '),
  }));

  const styles: Record<string, CSSProperties> = {
    page: { minHeight: '100vh', background: '#fff', color: '#0f172a', fontFamily: 'Inter, sans-serif' },
    container: { maxWidth: 1200, margin: '0 auto', padding: '0 1rem', paddingTop: isMobile ? 96 : 104 },
    hero: {
      background: 'linear-gradient(180deg, #F1FAF9 0%, #FFFFFF 100%)', border: '1px solid #e5e7eb', borderRadius: 16,
      padding: isMobile ? '1rem' : '1.25rem', marginBottom: isMobile ? '1rem' : '1.25rem'
    },
    title: { fontSize: isMobile ? 28 : 40, fontWeight: 800, color: '#035757', margin: 0, textAlign: 'center' },
    subtitle: { fontSize: isMobile ? 14 : 16, color: '#64748b', marginTop: 8, marginBottom: 0, textAlign: 'center' },
    section: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: isMobile ? '1rem' : '1.25rem', marginBottom: '1rem' },
    grid2: { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0,1fr))', gap: isMobile ? '0.75rem' : '1rem' },
    card: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '0.9rem' },
    cardTitle: { margin: 0, fontWeight: 800, color: '#035757', fontSize: isMobile ? 18 : 20 },
    list: { margin: '0.5rem 0 0 1rem' },
    paragraph: { margin: 0, lineHeight: 1.7, fontSize: isMobile ? 14 : 15.5, color: '#334155' },
    galleryGrid: { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: isMobile ? '0.5rem' : '0.75rem' },
    galleryCard: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    galleryImg: { width: '100%', height: isMobile ? 160 : 200, objectFit: 'cover', borderRadius: 8 },
    sliderWrap: { maxWidth: 1200, margin: '0 auto' },
  };

  return (
    <div style={styles.page}>
      <SiteHeader />
      <main style={styles.container}>
        <section style={styles.hero}>
          <h1 style={styles.title}>Akuntansi Bisnis</h1>
        </section>

        {galleryImages.length > 0 ? (
          <section style={styles.section}>
            {isMobile ? (
              <div style={styles.sliderWrap}>
                <Slider dots={true} arrows={false} infinite={true} slidesToShow={1} slidesToScroll={1} speed={500} adaptiveHeight={true}>
                  {galleryImages.map((img) => (
                    <div key={img.url}>
                      <div style={styles.galleryCard}>
                        <img src={img.url} alt={img.name} style={styles.galleryImg as React.CSSProperties} />
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            ) : (
              <div style={styles.galleryGrid}>
                {galleryImages.map((img) => (
                  <div key={img.url} style={styles.galleryCard}>
                    <img src={img.url} alt={img.name} style={styles.galleryImg as React.CSSProperties} />
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : null}

        <section style={styles.section}>
          <p style={styles.paragraph}>
            Kompetensi keahlian akuntansi di SMK Metland meliputi pembelajaran Akuntansi Manual dan Akuntansi Komputer (MYOB, Zahir).
            Kompetensi Keahlian Akuntansi di SMK Metland bertujuan agar siswa dapat mengetahui Akuntansi baik untuk perusahaan jasa,
            perusahaan dagang, perusahaan manufaktur dan perhotelan. Siswa kompetensi Keahlian Akuntansi diharapkan dapat melakukan
            Siklus Akuntansi minimal bagi dirinya sendiri dan perusahaan pada umumnya dan sekaligus mampu menerapkan Sistem Perpajakan di Indonesia.
          </p>
          <br />
          <p style={styles.paragraph}>
            Lulusan Kompetensi Keahlian Akuntansi SMK Metland, ada yang kuliah, bekerja dan tidak sedikit yang melanjutkan kuliah sambil bekerja.
            Untuk Kompetensi Keahlian Akuntansi belajar mengenai Siklus Akuntansi, maka tidak ada karya yang bersifat riil atau produk nyata yang
            bisa di pamerkan. Tapi Laporan Keuangan merupakan produk jasa akuntansi.
          </p>
        </section>

        <section style={styles.section}>
          <div style={styles.grid2}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Kompetensi / Materi</h3>
              <ol style={styles.list}>
                {competencies.map((c) => (<li key={c}>{c}</li>))}
              </ol>
            </div>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Profesi / Bidang Pekerjaan</h3>
              <ol style={styles.list}>
                {careers.map((c) => (<li key={c}>{c}</li>))}
              </ol>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProgramAkuntansi;
