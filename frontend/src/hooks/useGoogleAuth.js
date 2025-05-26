import { useEffect, useState } from 'react';
import axios from 'axios';

const useGoogleAuth = () => {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  useEffect(() => {
    // Check if Google Identity Services is loaded
    const checkGoogleLoaded = () => {
      if (window.google && window.google.accounts) {
        setIsGoogleLoaded(true);
      } else {
        // Retry after a short delay
        setTimeout(checkGoogleLoaded, 100);
      }
    };

    checkGoogleLoaded();
  }, []);

  const initializeGoogleSignIn = (onSuccess, onError) => {
    if (!isGoogleLoaded) {
      onError('Google services not loaded');
      return;
    }

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId || clientId === 'your_google_client_id_here') {
      onError('Google Client ID not configured');
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          try {
            // Send the Google token to your backend
            const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
            const result = await axios.post(`${baseURL}/auth/google`, {
              token: response.credential
            });

            if (result.data.token) {
              localStorage.setItem("token", result.data.token);
              onSuccess(result.data);
            } else {
              onError('Authentication failed');
            }
          } catch (error) {
            console.error('Google auth error:', error);
            onError(error.response?.data?.message || 'Authentication failed');
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Render the sign-in button
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'signin_with',
          shape: 'pill',
        }
      );
    } catch (error) {
      console.error('Error initializing Google Sign-In:', error);
      onError('Failed to initialize Google Sign-In');
    }
  };

  const signInWithGoogle = (onSuccess, onError) => {
    if (!isGoogleLoaded) {
      onError('Google services not loaded');
      return;
    }

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId || clientId === 'your_google_client_id_here') {
      onError('Google OAuth Setup Required:\n1. Go to Google Cloud Console\n2. Create OAuth 2.0 credentials\n3. Add Client ID to environment variables\n\nFor now, please use email/password login below.');
      return;
    }

    try {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback to popup
          window.google.accounts.id.renderButton(
            document.createElement('div'),
            { theme: 'outline', size: 'large' }
          );
        }
      });
    } catch (error) {
      console.error('Error with Google Sign-In:', error);
      onError('Failed to sign in with Google');
    }
  };

  return {
    isGoogleLoaded,
    initializeGoogleSignIn,
    signInWithGoogle,
  };
};

export default useGoogleAuth;
