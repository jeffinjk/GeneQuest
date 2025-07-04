// src/hooks/useConfirmNavigation.js
import { useEffect } from 'react';
import { useBlocker, useNavigate } from 'react-router-dom';

const useConfirmNavigation = (isEnabled, message) => {
  const navigate = useNavigate();
  const blocker = useBlocker(({ nextLocation }) => {
    // Block navigation if enabled and the user is trying to navigate away
    return isEnabled && nextLocation.pathname !== window.location.pathname;
  });

  useEffect(() => {
    if (blocker.state === 'blocked') {
      const confirmNavigation = window.confirm(message);
      if (confirmNavigation) {
        blocker.proceed(); // Allow navigation
      } else {
        blocker.reset(); // Cancel navigation
      }
    }
  }, [blocker, message]);

  // Handle direct navigation attempts (e.g., typing the URL)
  useEffect(() => {
    if (isEnabled) {
      const unlisten = window.addEventListener('popstate', (event) => {
        const confirmNavigation = window.confirm(message);
        if (!confirmNavigation) {
          navigate(window.location.pathname, { replace: true }); // Stay on the current page
        }
      });

      return () => {
        window.removeEventListener('popstate', unlisten);
      };
    }
  }, [isEnabled, message, navigate]);

  return blocker;
};

export default useConfirmNavigation;