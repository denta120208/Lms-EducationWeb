import { CSSProperties } from 'react';
import { GraduationCap, Users, BookOpen } from 'lucide-react';
import CountUp from 'react-countup';

type InfographicsSectionProps = {
  isMobile: boolean;
};

const InfographicsSection = ({ isMobile }: InfographicsSectionProps) => {
  const styles: Record<string, CSSProperties> = {
    infographicsGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
      gap: isMobile ? '2rem' : '3rem',
      maxWidth: isMobile ? '1200px' : '700px',
      margin: '0 auto',
    },
    infographicCard: {
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    },
    iconContainer: {
      width: '100px',
      height: '100px',
      marginBottom: '1rem',
      borderRadius: '50%',
      backgroundColor: '#f8f9fa',
      padding: '1.2rem',
      border: '2px solid #69727d',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    number: {
      fontSize: '2.5rem',
      fontWeight: 800,
      color: '#009390',
      marginBottom: '0.5rem',
    },
    label: {
      fontSize: '1rem',
      color: 'black',
      fontWeight: 600,
    },
  };

  return (
    <div style={styles.infographicsGrid}>
      <div style={styles.infographicCard}>
        <div style={styles.iconContainer}>
          <Users size={64} color="#69727d" />
        </div>
        <CountUp end={683} duration={1.4} style={styles.number} />
        <div style={styles.label}>Siswa</div>
      </div>

      <div style={styles.infographicCard}>
        <div style={styles.iconContainer}>
          <BookOpen size={64} color="#69727d" />
        </div>
        <CountUp end={75} duration={1.4} style={styles.number} />
        <div style={styles.label}>Guru</div>
      </div>

      <div style={styles.infographicCard}>
        <div style={styles.iconContainer}>
          <GraduationCap size={64} color="#69727d" />
        </div>
        <CountUp end={28} duration={1.4} style={styles.number} />
        <div style={styles.label}>Tendik</div>
      </div>
    </div>
  );
};

export default InfographicsSection;

