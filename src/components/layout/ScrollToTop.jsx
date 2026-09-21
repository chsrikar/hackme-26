import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Ensures the browser scrolls to top upon route transition
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
