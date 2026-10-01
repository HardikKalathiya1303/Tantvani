import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  // Synchronous scroll before browser paint
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Fallback: scroll again after lazy components finish rendering
  useEffect(() => {
    window.scrollTo(0, 0);

    // Extra safety: scroll after a short delay to handle async lazy-load rendering
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
