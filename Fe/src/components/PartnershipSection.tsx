import { CSSProperties } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Top row images
import SilaTea from '../assets/Partnership/Top/Sila_Tea-removebg-preview-150x150.png';
import SekolahanId from '../assets/Partnership/Top/Sekolahan.id-removebg-preview-150x150.png';
import RaSuites from '../assets/Partnership/Top/Ra_Suites-removebg-preview-150x150.png';
import Pullman from '../assets/Partnership/Top/Pullman-removebg-preview-150x150.png';
import PTMetland from '../assets/Partnership/Top/PT_Metland-removebg-preview-e1704943421395-150x150.png';
import MetropolitanMall from '../assets/Partnership/Top/Metropolitan_Mall_Cibubur-removebg-preview-150x150.png';
import Kempinski from '../assets/Partnership/Top/Kempinski-removebg-preview-150x150.png';
import KalianaApartment from '../assets/Partnership/Top/Kaliana_Apartment-removebg-preview-150x150.png';
import Indesso from '../assets/Partnership/Top/Indesso-removebg-preview-150x150.png';
import HotelCiputra from '../assets/Partnership/Top/Hotel_Ciputra_Cibubur-removebg-preview-150x150.png';
import HorisonHotels from '../assets/Partnership/Top/Horison_Hotels_Group__1_-removebg-preview-150x150.png';
import HarrisHotel from '../assets/Partnership/Top/Harris_Hotel-removebg-preview-150x150.png';
import GrandMetropolitan from '../assets/Partnership/Top/Grand_Metropolitan-removebg-preview-150x150.png';
import Ayana from '../assets/Partnership/Top/Ayana-removebg-preview-1-150x150.png';

// Bottom row images
import Virtalus from '../assets/Partnership/Bottom/virtalus-150x150.png';
import Unesco from '../assets/Partnership/Bottom/unesco-150x150.png';
import Trskt from '../assets/Partnership/Bottom/trskt-150x150.png';
import ThailangIjo from '../assets/Partnership/Bottom/thailang-ijo-150x150.png';
import Tgroup from '../assets/Partnership/Bottom/tgroup-150x150.png';
import Teii from '../assets/Partnership/Bottom/teii-e1705024305638-150x150.png';
import Stada from '../assets/Partnership/Bottom/stada-1-150x150.png';
import Shangri from '../assets/Partnership/Bottom/shangri-150x150.png';
import RitzCalton from '../assets/Partnership/Bottom/ritz-calton-150x150.png';
import Puket from '../assets/Partnership/Bottom/puket-1-150x150.png';
import Phucket from '../assets/Partnership/Bottom/phucket.png';
import PhilipinUniversity from '../assets/Partnership/Bottom/philipin-university-150x150.png';
import LongBeach from '../assets/Partnership/Bottom/long-beach-150x150.png';
import Dt153037286 from '../assets/Partnership/Bottom/dt_153037286-150x90.png';
import Biru from '../assets/Partnership/Bottom/biru-150x150.png';
import Accor from '../assets/Partnership/Bottom/accor-e1705022947913-150x150.png';
import PhitsanulokLogo from '../assets/Partnership/Bottom/Phitsanulok_Logo-1-150x150.jpg';
import Img20230612 from '../assets/Partnership/Bottom/IMG-20230612-WA0015-1-150x150.jpg';
import Img14 from '../assets/Partnership/Bottom/14-150x150.jpg';

type PartnershipSectionProps = {
  isMobile: boolean;
};

const PartnershipSection = ({ isMobile }: PartnershipSectionProps) => {
  const styles: Record<string, CSSProperties> = {
    partnershipSlider: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    sliderRow: {
      marginBottom: '2rem',
    },
    partnerLogo: {
      width: '100%',
      maxWidth: '200px',
      height: isMobile ? '80px' : '120px',
      objectFit: 'contain',
      transition: 'filter 0.3s ease',
      margin: isMobile ? '0 0.5rem' : '0 1rem',
    },
  };

  return (
    <div style={styles.partnershipSlider}>
      <div style={styles.sliderRow}>
        <Slider
          dots={false}
          infinite
          slidesToShow={isMobile ? 3 : 6}
          slidesToScroll={1}
          autoplay
          speed={800}
          autoplaySpeed={3500}
          cssEase="ease"
          rtl={false}
          pauseOnHover
        >
          <div><img src={SilaTea} alt="Sila Tea" style={styles.partnerLogo} loading="lazy" decoding="async" /></div>
          <div><img src={SekolahanId} alt="Sekolahan.id" style={styles.partnerLogo} loading="lazy" decoding="async" /></div>
          <div><img src={RaSuites} alt="Ra Suites" style={styles.partnerLogo} loading="lazy" decoding="async" /></div>
          <div><img src={Pullman} alt="Pullman" style={styles.partnerLogo} loading="lazy" decoding="async" /></div>
          <div><img src={PTMetland} alt="PT Metland" style={styles.partnerLogo} loading="lazy" decoding="async" /></div>
          <div><img src={MetropolitanMall} alt="Metropolitan Mall Cibubur" style={styles.partnerLogo} loading="lazy" decoding="async" /></div>
          <div><img src={Kempinski} alt="Kempinski" style={styles.partnerLogo} loading="lazy" decoding="async" /></div>
          <div><img src={KalianaApartment} alt="Kaliana Apartment" style={styles.partnerLogo} loading="lazy" decoding="async" /></div>
          <div><img src={Indesso} alt="Indesso" style={styles.partnerLogo} loading="lazy" decoding="async" /></div>
          <div><img src={HotelCiputra} alt="Hotel Ciputra Cibubur" style={styles.partnerLogo} loading="lazy" decoding="async" /></div>
          <div><img src={HorisonHotels} alt="Horison Hotels Group" style={styles.partnerLogo} loading="lazy" decoding="async" /></div>
          <div><img src={HarrisHotel} alt="Harris Hotel" style={styles.partnerLogo} loading="lazy" decoding="async" /></div>
          <div><img src={GrandMetropolitan} alt="Grand Metropolitan" style={styles.partnerLogo} loading="lazy" decoding="async" /></div>
          <div><img src={Ayana} alt="Ayana" style={styles.partnerLogo} loading="lazy" decoding="async" /></div>
        </Slider>
      </div>

      <div style={styles.sliderRow}>
        <Slider
          dots={false}
          infinite
          slidesToShow={isMobile ? 3 : 6}
          slidesToScroll={1}
          autoplay
          speed={800}
          autoplaySpeed={3500}
          cssEase="ease"
          rtl
          pauseOnHover
        >
          <div><img src={Virtalus} alt="Virtalus" style={styles.partnerLogo} loading="lazy" decoding="async" /></div>
          <div><img src={Unesco} alt="UNESCO" style={styles.partnerLogo} loading="lazy" decoding="async" /></div>
          <div><img src={Trskt} alt="TRSKT" style={styles.partnerLogo} loading="lazy" decoding="async" /></div>
          <div><img src={ThailangIjo} alt="Thailang Ijo" style={styles.partnerLogo} loading="lazy" decoding="async" /></div>
          <div><img src={Tgroup} alt="T Group" style={styles.partnerLogo} loading="lazy" decoding="async" /></div>
          <div><img src={Teii} alt="TEII" style={styles.partnerLogo} loading="lazy" decoding="async" /></div>
          <div><img src={Stada} alt="STADA" style={styles.partnerLogo} loading="lazy" decoding="async" /></div>
          <div><img src={Shangri} alt="Shangri-La" style={styles.partnerLogo} loading="lazy" decoding="async" /></div>
          <div><img src={RitzCalton} alt="Ritz Carlton" style={styles.partnerLogo} loading="lazy" decoding="async" /></div>
          <div><img src={Puket} alt="Puket" style={styles.partnerLogo} loading="lazy" decoding="async" /></div>
          <div><img src={Phucket} alt="Phucket" style={styles.partnerLogo} loading="lazy" decoding="async" /></div>
          <div><img src={PhilipinUniversity} alt="Philippine University" style={styles.partnerLogo} loading="lazy" decoding="async" /></div>
          <div><img src={LongBeach} alt="Long Beach" style={styles.partnerLogo} loading="lazy" decoding="async" /></div>
          <div><img src={Dt153037286} alt="DT 153037286" style={styles.partnerLogo} loading="lazy" decoding="async" /></div>
          <div><img src={Biru} alt="Biru" style={styles.partnerLogo} loading="lazy" decoding="async" /></div>
          <div><img src={Accor} alt="Accor" style={styles.partnerLogo} loading="lazy" decoding="async" /></div>
          <div><img src={PhitsanulokLogo} alt="Phitsanulok Logo" style={styles.partnerLogo} loading="lazy" decoding="async" /></div>
          <div><img src={Img20230612} alt="IMG 20230612" style={styles.partnerLogo} loading="lazy" decoding="async" /></div>
          <div><img src={Img14} alt="IMG 14" style={styles.partnerLogo} loading="lazy" decoding="async" /></div>
        </Slider>
      </div>
    </div>
  );
};

export default PartnershipSection;

