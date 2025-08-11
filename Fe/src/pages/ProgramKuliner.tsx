import React, { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';

const ProgramKuliner: React.FC = () => {
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
    subtitle: { fontSize: isMobile ? 14 : 16, color: '#64748b', marginTop: 8, marginBottom: 0, textAlign: 'center' },
    section: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: isMobile ? '1rem' : '1.25rem', marginBottom: '1rem' },
    paragraph: { margin: 0, lineHeight: 1.7, fontSize: isMobile ? 14 : 15.5, color: '#334155' },
    list: { margin: '0.5rem 0 0 1.25rem' },
  };

  return (
    <div style={styles.page}>
      <SiteHeader />
      <main style={styles.container}>
        <section style={styles.hero}>
          <h1 style={styles.title}>Kulineri</h1>
        </section>
        <section style={styles.section}>
          <p style={styles.paragraph}>
            Jasa Boga adalah Kompetensi Keahlian yang berada di bawah Program Studi Keahlian Tata Boga, Bidang Studi Keahlian Pariwisata.
            Kompetensi Keahlian Jasa Boga memberikan pengetahuan dan keterampilan kepada peserta didik di bidang pengolahan, penyajian
            dan pelayanan makanan dan minuman. Kompetensi keahlian jasa boga menyiapkan peserta didik untuk bekerja pada bidang pekerjaan
            yang dikelola oleh badan atau instansi pariwisata, hotel, restoran, catering serta rumah sakit, serta menyiapkan peserta didik
            untuk menjadi entrepreneur di bidang usaha penyediaan makanan.
          </p>
        </section>
        <section style={styles.section}>
          <p style={styles.paragraph}>
            Program Keahlian Jasa Boga merupakan program keahlian yang paling terbaru di SMK Metland yang mulai berdiri sejak tahun angkatan
            2014/ 2020 bidang keahlian jasa boga ini bertujuan untuk membekali peserta didik dengan keterampilan, pengetahuan dan sikap agar
            berkopeten dalam :
          </p>
          <ol style={styles.list as React.CSSProperties}>
            <li> Mengolah dan menyajikan makanan kontinental dan Indonesia, baik dari makanan pembuka sampai makanan penutup berdasarkan kebutuhan gizi dan dapat di komersilkan.</li>
            <li> Mengelola usaha boga yang terdiri dari usaha Paistry, Bakery, Cafetaria dan Restaurant</li>
            <li> Serta mengorganisir makanan dan minuman baik di buffet, snack box, cafeteria, cake shop, restoran maupun acara-acara yang membutuhkan hidangan dalam jumlah besar.</li>
          </ol>
          <br />
          <p style={styles.paragraph}>
            Teknik pengajaran lebih ditekankan pada kegiatan praktek setiap hari, yang lebih mengutamakan teknik pengolahan produk makanan
            berstandart internasional, dengan harapan Program Keahlian Jasa Boga mampu menghasilkan lulusan yang memiliki ketrampilan di bidang
            kuliner dan profesionalisme dalam bekerja dibidangnya serta memiliki sikap yang baik.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProgramKuliner;
