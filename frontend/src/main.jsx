import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "leaflet/dist/leaflet.css";
import App from "./App.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import {
  GOOGLE_OAUTH_CONFIG,
  validateGoogleOAuthConfig,
} from "./config/googleOAuth.js";

// Validate Google OAuth configuration on startup
const oauthValidation = validateGoogleOAuthConfig();
console.log("🔐 OAuth Validation:", oauthValidation);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_OAUTH_CONFIG.clientId}>
      <UserProvider>
        <App />
      </UserProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
