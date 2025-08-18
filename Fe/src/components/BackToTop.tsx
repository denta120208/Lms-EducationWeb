import React, { useEffect, useMemo, useState } from 'react';

const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0); // 0..1

  const size = 46;
  const strokeWidth = 2;
  const radius = 20; // matches provided example
  const center = useMemo(() => size / 2, [size]);
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
      const scrollHeight = (document.documentElement.scrollHeight || 0) - window.innerHeight;
      const percentage = scrollHeight > 0 ? Math.min(scrollTop / scrollHeight, 1) : 0;
      setScrollProgress(percentage);
      setIsVisible(scrollTop > 100);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const styles: Record<string, React.CSSProperties> = {
    button: {
      position: 'fixed',
      bottom: 30,
      right: 30,
      width: size,
      height: size,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: '#FF8C00',
      border: 'none',
      borderRadius: '50%',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: isVisible ? 1 : 0,
      visibility: isVisible ? 'visible' : 'hidden',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(5px)',
      WebkitBackdropFilter: 'blur(5px)',
      zIndex: 999,
      transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
    },
    arrow: {
      fontSize: 24,
      lineHeight: 1,
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: '#FF8C00'
    },
    svg: {
      position: 'absolute' as const,
      top: 0,
      left: 0
    },
    circle: {
      transition: 'stroke-dashoffset 0.1s',
      transform: 'rotate(-90deg)',
      transformOrigin: '50% 50%'
    }
  };

  const dashOffset = useMemo(() => circumference - (scrollProgress * circumference), [circumference, scrollProgress]);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      aria-label="Kembali ke atas halaman"
      onClick={handleClick}
      style={styles.button}
      onMouseDown={(e) => {
        // small press feedback
        (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.95)';
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = isVisible ? 'translateY(0)' : 'translateY(20px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = isVisible ? 'translateY(0)' : 'translateY(20px)';
      }}
    >
      <svg width={size} height={size} style={styles.svg} className="progress-ring" aria-hidden>
        <circle
          className="progress-ring-circle"
          style={styles.circle}
          stroke="#FF8C00"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={center}
          cy={center}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <span style={styles.arrow} aria-hidden>↑</span>
    </button>
  );
};

export default BackToTop;


