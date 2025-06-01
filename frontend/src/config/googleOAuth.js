// Google OAuth Configuration
export const GOOGLE_OAUTH_CONFIG = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || "813762554049-isgimqs6d2v0v48ldahen5jdhb7vkutp.apps.googleusercontent.com",
  redirectUri: window.location.origin,
  scope: 'openid email profile',
  responseType: 'code',
  accessType: 'offline',
  prompt: 'consent'
};

// Get the current redirect URI based on the current port
export const getCurrentRedirectUri = () => {
  const currentPort = window.location.port;
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  
  return `${protocol}//${hostname}:${currentPort}`;
};

// Validate Google OAuth configuration
export const validateGoogleOAuthConfig = () => {
  const config = GOOGLE_OAUTH_CONFIG;
  
  console.log('🔍 Google OAuth Configuration:');
  console.log('Client ID:', config.clientId);
  console.log('Redirect URI:', getCurrentRedirectUri());
  console.log('Current Origin:', window.location.origin);
  
  return {
    isValid: !!config.clientId,
    clientId: config.clientId,
    redirectUri: getCurrentRedirectUri()
  };
};
