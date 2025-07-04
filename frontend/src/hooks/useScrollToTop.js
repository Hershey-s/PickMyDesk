import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Custom hook to scroll to top when route changes
export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when pathname changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);
};

export default useScrollToTop;
