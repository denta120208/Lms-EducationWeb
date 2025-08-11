import React, { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import gsap from 'gsap';
import LogoScene from '../components/LogoScene';
import Footer from '../components/Footer';
import SiteHeader from '../components/SiteHeader';

type Target = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
};

// Sections are implicit in DOM; no static data array needed

const VisiMisiPage: React.FC = () => {
  const styles: Record<string, CSSProperties> = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: 'Inter, sans-serif',
      color: '#0f172a',
      position: 'relative',
    },
    overlay: {
      position: 'fixed',
      inset: 0,
      background:
        'radial-gradient(1200px 600px at 15% 15%, rgba(0,150,136,0.08), transparent), radial-gradient(900px 480px at 85% 85%, rgba(0,150,136,0.06), transparent)',
      zIndex: 0,
    },
    scrollContainer: {
      position: 'relative',
      zIndex: 1,
      height: '100vh',
      overflowY: 'scroll',
      scrollSnapType: 'y proximity',
      WebkitOverflowScrolling: 'touch',
      paddingTop: 64,
    },
    section: {
      minHeight: '100vh',
      scrollSnapAlign: 'start',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 24px',
        textAlign: 'center',
        position: 'relative',
    },
    sectionLeft: {
      justifyContent: 'flex-start',
    },
    sectionRight: {
      justifyContent: 'flex-end',
    },
    sectionBottom: {
      alignItems: 'flex-end',
      paddingBottom: '12vh',
    },
    sectionFooterSnap: {
      minHeight: '100vh',
      scrollSnapAlign: 'start',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      backgroundColor: '#F9FDFC',
      position: 'relative',
      zIndex: 1,
      paddingTop: 64,
    },
    textBlock: {
      maxWidth: 720,
      margin: '0 auto',
    },
    textLeft: { marginLeft: '8vw', marginRight: 'auto', textAlign: 'left' },
    textRight: { marginRight: '8vw', marginLeft: 'auto', textAlign: 'right' },
    // no footer snap; we will place footer outside snap container
    title: {
      fontSize: 'clamp(28px, 4vw, 56px)',
      fontWeight: 800,
      letterSpacing: '0.02em',
      color: '#035757',
  margin: 0,
  opacity: 0,
      transform: 'translateY(-20px)',
      textAlign: 'center',
    },
    paragraph: {
      fontSize: 'clamp(16px, 2.2vw, 20px)',
      lineHeight: 1.7,
      color: '#0f172a',
      marginTop: '16px',
      marginBottom: 0,
  opacity: 0,
      transform: 'translateY(10px)',
      textAlign: 'left',
    },
    navArrows: {
      position: 'absolute',
      bottom: 24,
      left: 0,
      right: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10,
    },
    upArrowContainer: {
      position: 'absolute',
      top: 120,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
      cursor: 'pointer',
    },
      downArrowContainer: {
        position: 'absolute',
        bottom: 64,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        cursor: 'pointer',
      },
      downArrowButton: {
        background: 'rgba(0,0,0,0.4)',
        border: '1px solid rgba(255,255,255,0.6)',
        borderRadius: 9999,
        padding: 10,
        boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
      },
  };

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [target, setTarget] = useState<Target>({ position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 });
  const currentIndexRef = useRef<number>(0);
  const revealTimeoutRef = useRef<number | null>(null);
  const arrowRef = useRef<HTMLDivElement | null>(null);
  const isSnappingRef = useRef<boolean>(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sectionsEls = Array.from(container.querySelectorAll('[data-section]')) as HTMLElement[];

    // Hide all texts initially
    sectionsEls.forEach((el) => {
      const title = el.querySelector('[data-animate="title"]');
      const para = el.querySelector('[data-animate="paragraph"]');
      if (title) gsap.set(title, { opacity: 0, y: -20 });
      if (para) gsap.set(para, { opacity: 0, y: 10 });
    });

    const animateTextsForIndex = (idx: number) => {
      const el = sectionsEls[idx];
      if (!el) return;
      const title = el.querySelector('[data-animate="title"]');
      const para = el.querySelector('[data-animate="paragraph"]');
      if (title) gsap.to(title, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
      if (para) gsap.to(para, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.1 });
    };

    const setLogoTargetForIndex = (index: number) => {
      switch (index) {
        case 0:
          setTarget({ position: [0, 0, 0], rotation: [0, 0, 0], scale: 1.1 });
          break;
        case 1:
          // Visi: logo kiri, teks kanan
          setTarget({ position: [-3.5, 0.2, 0], rotation: [0.05, 0.8, 0], scale: 0.95 });
          break;
        case 2:
          // Misi 1: logo kanan, teks kiri (kebalikan)
          setTarget({ position: [3.5, 0.0, 0], rotation: [0.0, -0.9, 0.08], scale: 0.95 });
          break;
        case 3:
          // Misi 2: logo kiri lagi, teks kanan
          setTarget({ position: [-3.4, 0.0, 0], rotation: [0.0, 0.9, 0.06], scale: 0.92 });
          break;
        case 4:
          // Misi 3: logo kanan, teks kiri
          setTarget({ position: [3.4, 0.0, 0], rotation: [0.0, -0.9, -0.04], scale: 0.92 });
          break;
        case 5:
          // Misi 4: logo kiri, teks kanan
          setTarget({ position: [-3.3, 0.1, 0], rotation: [0.0, 0.9, 0.04], scale: 0.9 });
          break;
        default:
          break;
      }
    };

    const triggerSectionChange = (index: number) => {
      // Hide all texts immediately
      sectionsEls.forEach((el) => {
        const title = el.querySelector('[data-animate="title"]');
        const para = el.querySelector('[data-animate="paragraph"]');
        if (title) gsap.set(title, { opacity: 0, y: -20 });
        if (para) gsap.set(para, { opacity: 0, y: 10 });
      });

      // Update logo target first
      setLogoTargetForIndex(index);

      // After logo animation completes (~0.8s), reveal texts
      if (revealTimeoutRef.current) window.clearTimeout(revealTimeoutRef.current);
      revealTimeoutRef.current = window.setTimeout(() => animateTextsForIndex(index), 800);
    };

    const onScroll = () => {
      const scrollTop = container.scrollTop;
      const vh = container.clientHeight;
      const index = Math.round(scrollTop / vh);
      if (index !== currentIndexRef.current) {
        currentIndexRef.current = index;
        triggerSectionChange(index);
      }
    };

    // Snap to section on wheel end with throttling to avoid multiple jumps
    let wheelTimeout: number | null = null;
    const onWheel = (e: WheelEvent) => {
      const rect = container.getBoundingClientRect();
      const fullyInView = rect.top >= 0 && rect.bottom <= window.innerHeight;
      if (!fullyInView) return;

      // Require a minimal delta to trigger
      if (Math.abs(e.deltaY) < 30) return;

      if (isSnappingRef.current) {
        e.preventDefault();
        return;
      }

      if (wheelTimeout) window.clearTimeout(wheelTimeout);

      const dir = e.deltaY > 0 ? 1 : -1;
      const vh = container.clientHeight;
      const current = currentIndexRef.current;
      const total = sectionsEls.length;
      const nextIndex = Math.max(0, Math.min(total - 1, current + dir));
      if (nextIndex !== current) {
        e.preventDefault();
        isSnappingRef.current = true;
        currentIndexRef.current = nextIndex;
        triggerSectionChange(nextIndex);
        wheelTimeout = window.setTimeout(() => {
          container.scrollTo({ top: nextIndex * vh, behavior: 'smooth' });
          // unlock after scroll likely completes
          window.setTimeout(() => {
            isSnappingRef.current = false;
          }, 900);
        }, 60);
      }
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    container.addEventListener('wheel', onWheel, { passive: false });
    onScroll();
    return () => {
      container.removeEventListener('scroll', onScroll);
      container.removeEventListener('wheel', onWheel);
    };
  }, []);

  // Animate down arrow hint
  useEffect(() => {
    if (!arrowRef.current) return;
    const tween = gsap.to(arrowRef.current, {
      y: 10,
      duration: 0.9,
      yoyo: true,
      repeat: -1,
      ease: 'power1.inOut',
    });
    return () => {
      tween.kill();
    };
  }, []);

  const scrollToSection = (index: number) => {
    const c = containerRef.current;
    if (!c) return;
    const vh = c.clientHeight;
    c.scrollTo({ top: index * vh, behavior: 'smooth' });
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay} />
      <SiteHeader scrollTargetSelector="#vm-scroll" />
      <LogoScene target={target} />

      <div id="vm-scroll" ref={containerRef} style={styles.scrollContainer}>
         {/* Section 1: Logo only */}
         <section data-section style={styles.section}>
           {/* scroll hint */}
           <div style={{ position: 'absolute', bottom: 140, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
             <div style={{
               background: 'rgba(0,0,0,0.35)', color: 'white', padding: '8px 14px', borderRadius: 9999,
               fontSize: 14, backdropFilter: 'blur(4px)'
             }}>
               Gulir ke bawah untuk melihat Visi & Misi
             </div>
           </div>
            <div ref={arrowRef} onClick={() => scrollToSection(1)} style={styles.downArrowContainer}>
              <div style={styles.downArrowButton}>
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M6 9l6 6 6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
             </div>
           </div>
         </section>

        {/* Section 2: VISI */}
        <section data-section style={{ ...styles.section, ...styles.sectionRight }}>
          <div style={{ ...styles.textBlock, ...styles.textRight }}>
            <h2 data-animate="title" style={styles.title}>VISI</h2>
            <p data-animate="paragraph" style={styles.paragraph}>
              Menjadi SMK Yang Lulusannya Memiliki Performa Karakter Unggul Dan Berkompetensi Berstandar Internasional
            </p>
              </div>
          <div onClick={() => scrollToSection(0)} style={styles.upArrowContainer as React.CSSProperties}>
            <div style={styles.downArrowButton as React.CSSProperties}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(180deg)' }}>
                <path d="M6 9l6 6 6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div onClick={() => scrollToSection(2)} style={styles.downArrowContainer}>
            <div style={styles.downArrowButton}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9l6 6 6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </section>

        {/* Section 3: MISI 1 */}
        <section data-section style={{ ...styles.section, ...styles.sectionLeft }}>
          <div style={{ ...styles.textBlock, ...styles.textLeft }}>
            <h2 data-animate="title" style={styles.title}>MISI ke 1</h2>
            <p data-animate="paragraph" style={styles.paragraph}>
              Memberikan layanan pendidikan bagi peserta didik yang berorientasi pada pengembangan knowledge, skill, dan attitude berbasis industri 4.0, serta menguatkan karakter GENERASI CINTA PRESTASI yang sesuai dengan tuntutan dunia industri
            </p>
            </div>
          <div onClick={() => scrollToSection(1)} style={styles.upArrowContainer as React.CSSProperties}>
            <div style={styles.downArrowButton as React.CSSProperties}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(180deg)' }}>
                <path d="M6 9l6 6 6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div onClick={() => scrollToSection(3)} style={styles.downArrowContainer}>
            <div style={styles.downArrowButton}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9l6 6 6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </section>

        {/* Section 4: MISI 2 */}
        <section data-section style={{ ...styles.section, ...styles.sectionRight }}>
          <div style={{ ...styles.textBlock, ...styles.textRight }}>
            <h2 data-animate="title" style={styles.title}>MISI ke 2</h2>
            <p data-animate="paragraph" style={styles.paragraph}>
              Mengembangkan profesionalisme guru berdasarkan nilai-nilai METLAND SCHOOL TEACHER’S VALUE dan mampu beradaptasi dengan tuntutan industri 4.0
            </p>
              </div>
          <div onClick={() => scrollToSection(2)} style={styles.upArrowContainer as React.CSSProperties}>
            <div style={styles.downArrowButton as React.CSSProperties}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(180deg)' }}>
                <path d="M6 9l6 6 6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div onClick={() => scrollToSection(4)} style={styles.downArrowContainer}>
            <div style={styles.downArrowButton}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9l6 6 6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </section>

        {/* Section 5: MISI 3 */}
        <section data-section style={{ ...styles.section, ...styles.sectionLeft }}>
          <div style={{ ...styles.textBlock, ...styles.textLeft }}>
            <h2 data-animate="title" style={styles.title}>MISI ke 3</h2>
            <p data-animate="paragraph" style={styles.paragraph}>
              Mengembangkan jaringan kerjasama kemitraan dengan DUDI dan perguruan tinggi vokasi baik di dalam maupun di luar negeri untuk pengembangan program akademik
            </p>
              </div>
          <div onClick={() => scrollToSection(3)} style={styles.upArrowContainer as React.CSSProperties}>
            <div style={styles.downArrowButton as React.CSSProperties}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(180deg)' }}>
                <path d="M6 9l6 6 6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div onClick={() => scrollToSection(5)} style={styles.downArrowContainer}>
            <div style={styles.downArrowButton}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9l6 6 6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </section>

        {/* Section 6: MISI 4 */}
        <section data-section style={{ ...styles.section, ...styles.sectionRight }}>
          <div style={{ ...styles.textBlock, ...styles.textRight }}>
            <h2 data-animate="title" style={styles.title}>MISI ke 4</h2>
            <p data-animate="paragraph" style={styles.paragraph}>
              Mengembangkan jaringan kerjasama dengan DUDI di dalam dan di luar negeri untuk mewujudkan zero unemployment lulusan
            </p>
              </div>
          <div onClick={() => scrollToSection(4)} style={styles.upArrowContainer as React.CSSProperties}>
            <div style={styles.downArrowButton as React.CSSProperties}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(180deg)' }}>
                <path d="M6 9l6 6 6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div onClick={() => scrollToSection(6)} style={styles.downArrowContainer}>
            <div style={styles.downArrowButton}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9l6 6 6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </section>

        {/* Section 7: Footer full-screen section (visual separation from canvas) */}
        <section data-section style={styles.sectionFooterSnap}>
          <div style={{ width: '100%' }}>
            <Footer />
          </div>
        </section>

      </div>
    </div>
  );
};

export default VisiMisiPage;

