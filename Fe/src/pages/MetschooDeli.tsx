import React, { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const MetschooDeli: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Load all media under sementara, try to find images for Metschoo Deli if available
  const allMedia = import.meta.glob('../assets/sementara/**/*', { eager: true, as: 'url' }) as Record<string, string>;
  const targetDir = '/Metschoo Deli/';
  const galleryImages = Object.entries(allMedia)
    .filter(([path]) => path.toLowerCase().includes(targetDir.toLowerCase()))
    .filter(([path]) => /\.(png|jpe?g|webp)$/i.test(path))
    .map(([path, url]) => ({ url, name: (path.split('/')?.pop() || '').replace(/[-_]/g, ' ') }));

  const styles: Record<string, CSSProperties> = {
    page: { minHeight: '100vh', background: '#fff', color: '#0f172a', fontFamily: 'Inter, sans-serif' },
    container: { maxWidth: 1200, margin: '0 auto', padding: '0 1rem', paddingTop: isMobile ? 96 : 104 },
    hero: { background: 'linear-gradient(180deg, #F1FAF9 0%, #FFFFFF 100%)', border: '1px solid #e5e7eb', borderRadius: 16, padding: isMobile ? '1rem' : '1.25rem', marginBottom: isMobile ? '1rem' : '1.25rem' },
    title: { fontSize: isMobile ? 28 : 40, fontWeight: 800, color: '#035757', margin: 0, textAlign: 'center' },
    subtitle: { fontSize: isMobile ? 14 : 16, color: '#64748b', marginTop: 8, marginBottom: 0, textAlign: 'center' },
    section: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: isMobile ? '1rem' : '1.25rem', marginBottom: '1rem' },
    paragraph: { margin: 0, lineHeight: 1.7, fontSize: isMobile ? 14 : 15.5, color: '#334155' },
    galleryGrid: { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: isMobile ? '0.5rem' : '0.75rem' },
    galleryCard: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    galleryImg: { width: '100%', height: isMobile ? 160 : 220, objectFit: 'cover', borderRadius: 8 },
    sliderWrap: { maxWidth: 1200, margin: '0 auto' },
  };

  return (
    <div style={styles.page}>
      <SiteHeader />
      <main style={styles.container}>
        <section style={styles.hero}>
          <h1 style={styles.title}>Metschoo Deli</h1>
          <p style={styles.subtitle}>Sarana Praktik Siswa</p>
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
          <p style={styles.paragraph}>Metschoo Deli merupakan fasilitas pembelajaran praktik bagi siswa Metland School dalam bidang wirausaha kuliner.</p>
          <br />
          <p style={styles.paragraph}>Melalui pendekatan Teaching Factory (TeFa), siswa mengembangkan kompetensi produksi, layanan pelanggan, serta manajemen usaha secara nyata.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MetschooDeli;





