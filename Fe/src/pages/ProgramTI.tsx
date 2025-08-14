import React, { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import SiteHeader from '../components/SiteHeader';
import Footer from '../components/Footer';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ProgramTI: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const industryPartners = [
    'Hotel Horison Ultima Bekasi/Metland Hotel Division',
    'Forit Indonesia',
    'Metropolitan Mall Cileungsi',
    'Novotel Cikini Jakarta',
    'PT Kembang Griya Cahaya',
    'Pusdiklat DPR RI',
    'Suryaraya Rubberindo Industries',
    'Swiss-Belhotel Mangga Besar',
  ];

  const campusVisits = [
    'Universitas Telkom',
    'ITB',
    'Binus University',
    'UMN (Universitas Multimedia Nusantara)',
    'Universitas Komputer Bandung',
    'Indosiar',
    'Metro TV',
    'Trans7',
  ];

  const objectives = [
    'Menciptakan lulusan yang sesuai dengan kebutuhan industri khususnya industri teknologi informasi',
    'Memulai usaha rintisan (startup)',
    'Menciptakan peserta didik yang dapat memahami proses bisnis industri Pengembangan Perangkat Lunak dan Gim',
    'Menjadi Web Application Developer, UI/UX Desain, Developer Website untuk bidang Frontend dan Backend, Developer aplikasi mobile, Internet of Things.',
  ];

  const rawGallery = import.meta.glob('../assets/sementara/Teknologi Informasi/*', { eager: true, as: 'url' }) as Record<string, string>;
  const galleryImages = Object.entries(rawGallery).map(([path, url]) => ({
    url,
    name: (path.split('/')?.pop() || '').replace(/[-_]/g, ' '),
  }));

  const styles: Record<string, CSSProperties> = {
    page: { minHeight: '100vh', background: '#fff', color: '#0f172a', fontFamily: 'Inter, sans-serif' },
    container: { maxWidth: 1200, margin: '0 auto', padding: '0 1rem', paddingTop: isMobile ? 96 : 104 },
    hero: { background: 'linear-gradient(180deg, #F1FAF9 0%, #FFFFFF 100%)', border: '1px solid #e5e7eb', borderRadius: 16, padding: isMobile ? '1rem' : '1.25rem', marginBottom: isMobile ? '1rem' : '1.25rem' },
    title: { fontSize: isMobile ? 28 : 40, fontWeight: 800, color: '#035757', margin: 0, textAlign: 'center' },
    section: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: isMobile ? '1rem' : '1.25rem', marginBottom: '1rem' },
    paragraph: { margin: 0, lineHeight: 1.7, fontSize: isMobile ? 14 : 15.5, color: '#334155' },
    list: { margin: '0.5rem 0 0 1rem' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: 8 } as CSSProperties,
    thtd: { border: '1px solid #e5e7eb', padding: '8px 10px', fontSize: isMobile ? 13 : 14 } as CSSProperties,
    h3: { margin: 0, color: '#035757', fontWeight: 800 } as CSSProperties,
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
          <h1 style={styles.title}>Pengembangan Perangkat Lunak dan GIM</h1>
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
            Kurikulum Operasional SMK Pariwisata Metland School pada Program Keahlian Pengembangan Perangkat Lunak dan Gim dikembangkan untuk
            memenuhi kebutuhan dalam memecahkan masalah dalam peningkatan kualitas pendidikan dan pembelajaran untuk menjawab tantangan dan
            kebutuhan masyarakat dalam pengembangan perangkat lunak dan gim. Hal ini juga didasari oleh adanya perkembangan teknologi informasi
            dan komunikasi dalam implementasi proses interaksi pembelajaran melalui beragam metode dan media. Kebutuhan tenaga kerja bidang UI/UX
            Desain, Developer Website untuk bidang Frontend dan Backend, bahkan hingga kebutuhan Developer aplikasi mobile, Pengembangan perangkat
            berbasis Internet of Things (IoT).
          </p>
          <br />
          <p style={styles.paragraph}>
            Sebagai penguatan hardskill dan softskill dalam mata pelajaran kejuruan memberikan beberapa tambahan mata pelajaran yang spesifik
            berdasarkan tuntutan industri saat ini. Beberapa mata pelajaran yang dikembangkan adalah (1) Platform Komputasi Awan, (2) Internet of Things,
            dan (3) Pengembangan Gim. Ketiga mata pelajaran tersebut merupakan mata pelajaran yang akan mendukung kemampuan siswa dalam mempersiapkan diri
            menghadapi era industry 4.0 yang saat ini perkembangannya sangat pesat seiring dengan perkembangan dunia digital. Pembelajaran yang
            mengembangkan Hybrid Model Learning System untuk memanfaatkan kekuatan pembelajaran daring dengan pola synchronous-asynchronous dan tatap muka.
          </p>
          <br />
          <p style={styles.paragraph}>
            Penyusunan kurikulum Program Keahlian Pengembangan Perangkat Lunak dan Gim melibatkan unsur dunia Industri dikarenakan SMK Pariwisata Metland School
            berada dibawah naungan Management PT Metropolitan Land, Tbk. yang didalamnya memiliki industri komersil, properti, dan perhotelan, dimana semua industri
            tersebut membutuhkan dukungan penggunaan perangkat lunak khususnya berbasis digital dalam menghadapi persaingan bisnis kedepan yang di era industri 4.0.
            Disamping itu SMK Pariwisata Metland School juga membangun jaringan perguruan tinggi vokasi dalam bidang Kreatif. Kurikulum yang dikembangkan berpedoman
            pada profil lulusan yang memiliki kemampuan untuk bekerja, berkesempatan untuk melanjutkan pendidikan ke jenjang yang lebih tinggi (Diploma/Sarjana), dan
            memiliki kemampuan menangkap peluang wirausaha, sesuai dengan program Direktorat jenderal vokasi yaitu BMW (Bekerja, Melanjutkan, dan Wirausaha).
          </p>
          <br />
          <p style={styles.paragraph}>
            Guru produktif pada program keahlian Pengembangan Perangkat Lunak dan Gim terdiri dari 3 guru pendidikan minimal sarjana dan memiliki latar belakang industri
            khususnya industri teknologi informasi. Jumlah siswa Pengembangan Perangkat Lunak dan Gim Tahun Pelajaran 2021/2022 sebanyak 32 siswa pada kelas X (Merupakan
            konversi kompetensi keahlian Sistem Informasi dan Jaringan berdasarkan spektrum keahlian SMK PK).
          </p>
        </section>

        <section style={styles.section}>
          <p style={styles.paragraph}>Berikut adalah kerjasama industri untuk Prakerin dan penyerapan lulusan yang dilakukan SMK Pariwisata Metland School kompetensi keahlian Sistem Informasi dan Jaringan yang dikonversi pada program keahlian Pengembangan Perangkat Lunak dan Gim pada tahun 2021.</p>
          <ol style={styles.list as React.CSSProperties}>
            {industryPartners.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ol>
        </section>

        <section style={styles.section}>
          <p style={styles.paragraph}>Berikut adalah kerjasama dalam bidang pengembangan akademik dan profesi yang dilakukan SMK Pariwisata Metland School kompetensi keahlian Sistem Informasi dan Jaringan yang dikonversi pada program keahlian Pengembangan Perangkat Lunak dan Gim pada tahun 2021.</p>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.thtd}>No</th>
                <th style={styles.thtd}>Dalam Negeri</th>
                <th style={styles.thtd}>Asosiasi/Kelembagaan</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.thtd}>1</td>
                <td style={styles.thtd}>Politeknik Jakarta Internasional JIHS</td>
                <td style={styles.thtd}>Seamolec</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section style={styles.section}>
          <p style={styles.paragraph}>
            Sarana praktik dan belajar dirancang dengan standar industri kreatif, sehingga para lulusan SMK Pariwisata Metland School diharapkan mudah beradaptasi ketika
            melaksanakan program OJT/PKL di industri baik di Indonesia maupun di luar negeri, serta membentuk kepribadian, dan karakter kerja yang lebih kuat. Salah satu
            program praktik unggulan program keahlian Pengembangan Perangkat Lunak dan Gim adalah dalam bidang Internet of Things.
          </p>
          <br />
          <p style={styles.paragraph}>
            Kegiatan praktik di sekolah dan Praktik kerja lapangan dipersiapkan melalui program parenting bagi para orang tua, <em>job orientation</em>, dan <em>sharing knowledge</em> yang diberikan
            oleh praktisi dari dunia industri teknologi informasi, untuk menguatkan <em>passion</em> dan gambaran karir bekerja di Informatika.
          </p>
        </section>

        <section style={styles.section}>
          <p style={styles.paragraph}>Kegiatan kunjungan industri dan kunjungan ke perguruan tinggi  untuk menguatkan passion dan gambaran karir bekerja di industri. Berikut adalah daftar kunjungan Industri kompetensi keahlian Sistem Informasi dan Jaringan yang dikonversi pada program keahlian Pengembangan Perangkat Lunak dan Gim pada tahun 2021.</p>
          <ol style={styles.list as React.CSSProperties}>
            {campusVisits.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ol>
        </section>

        <section style={styles.section}>
          <h3 style={styles.h3}>TujuanProgram Keahlian Pengembangan Perangkat Lunak dan Gim</h3>
          <p style={styles.paragraph}>Berdasarkan visi dan misi di atas maka disusunlah tujuan yang akan menjadi landasan mencapai profil kompetensi lulusan Program keahlian Pengembangan Perangkat Lunak dan Gim melalui Pengembangan bersama mitra IDUKA. Tujuan Program keahlian Pengembangan Perangkat Lunak dan Gim dapat dijabarkan sebagai berikut.</p>
          <ol style={styles.list as React.CSSProperties}>
            {objectives.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ol>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProgramTI;
