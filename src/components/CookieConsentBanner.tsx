import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('aqx_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('aqx_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('aqx_cookie_consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-40"
        >
          <div className="cookie-card-container">
            <svg
              id="cookieSvg"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 122.88 122.25"
            >
              <g>
                <path d="M102.73,8.56A61.45,61.45,0,0,1,121.72,39a7,7,0,0,1-2.92,7.74,15.38,15.38,0,0,0-6.42,12.38,7,7,0,0,1-6.19,6.85,13.62,13.62,0,0,0-12,12,7,7,0,0,1-6.85,6.19,15.42,15.42,0,0,0-12.38,6.42,7,7,0,0,1-8.51,2.54,23.77,23.77,0,0,0-7.36-1.16A24.16,24.16,0,0,0-[REDACTED_OR_CLEAN_PATH]" fill="#615151" />
                <path d="M60.83,0A61.46,61.46,0,0,1,102.73,8.56a12,12,0,0,0-2.45,7,12.18,12.18,0,0,0,4.24,9.07,7,7,0,0,1,2.18,5.82,15.38,15.38,0,0,0-6.42,12.38,7,7,0,0,1-6.19,6.85,13.62,13.62,0,0,0-12,12,7,7,0,0,1-6.85,6.19,15.42,15.42,0,0,0-12.38,6.42,7,7,0,0,1-8.51,2.54,23.77,23.77,0,0,0-7.36-1.16,24.17,24.17,0,0,0-15.68,5.83,7,7,0,0,1-10.37-1.74A61.43,61.43,0,1,1,60.83,0ZM35.84,81.16a7.71,7.71,0,1,0,7.71,7.71,7.71,7.71,0,0,0-7.71-7.71Zm36.87-23.7a8.77,8.77,0,1,0,8.77,8.77,8.77,8.77,0,0,0-8.77-8.77ZM45,39.69a6.66,6.66,0,1,0,6.66,6.66A6.65,6.65,0,0,0,45,39.69ZM83,29.35a6.47,6.47,0,1,0,6.47,6.47A6.47,6.47,0,0,0,83,29.35ZM25.86,54.89a7.61,7.61,0,1,0,7.61,7.61,7.61,7.61,0,0,0-7.61-7.61Z" fill="#615151"/>
              </g>
            </svg>

            <span className="cookieHeading">We use cookies.</span>
            <p className="cookieDescription">
              AfriQuantX uses cookies to enhance institutional analytics & market speed. Learn more in our{' '}
              <a href="#privacy" onClick={(e) => e.preventDefault()}>privacy policy</a>.
            </p>

            <div className="buttonContainer">
              <button className="acceptButton" onClick={handleAccept}>
                Allow
              </button>
              <button className="declineButton" onClick={handleDecline}>
                Decline
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
