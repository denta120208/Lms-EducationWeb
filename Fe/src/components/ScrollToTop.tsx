import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scrolls the window to the top on every route change with smooth behavior.
 * Works with React Router DOM v7+ by reacting to pathname/search changes.
 */
const ScrollToTop: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Use rAF to ensure the new route has rendered before scrolling
    const id = window.requestAnimationFrame(() => {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } catch {
        // Fallback for older browsers
        window.scrollTo(0, 0);
      }
    });
    return () => window.cancelAnimationFrame(id);
  }, [location.pathname, location.search]);

  return null;
};

export default ScrollToTop;


