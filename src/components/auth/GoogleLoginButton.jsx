import React, { useEffect, useRef } from 'react';

const GoogleLoginButton = ({ onSuccess, onError }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const initGoogleBtn = () => {
      if (!window.google) return;

      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (response.credential) {
            onSuccess(response.credential);
          } else {
            if (onError) onError('Failed to obtain Google credential');
          }
        },
      });

      window.google.accounts.id.renderButton(containerRef.current, {
        type: 'standard',
        theme: 'filled_black', // Sleek dark Google button that fits our dark theme perfectly
        size: 'large',
        text: 'continue_with',
        shape: 'pill',
        logo_alignment: 'left',
        width: 320, // Clean standard width that fits both login and signup cards perfectly
      });
    };

    // If script isn't fully loaded yet, poll for it
    if (window.google) {
      initGoogleBtn();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          initGoogleBtn();
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [onSuccess, onError]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '0.5rem', marginBottom: '0.25rem' }}>
      <div ref={containerRef} style={{ width: '320px', minHeight: '40px' }} />
    </div>
  );
};

export default GoogleLoginButton;
