#!/usr/bin/env node

/**
 * Google OAuth Setup Helper for WorkspaceHub
 * Usage: node setup-google-oauth.js "your_google_client_id_here"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendEnvPath = path.join(__dirname, 'frontend', '.env');
const backendEnvPath = path.join(__dirname, 'backend', '.env');

function updateGoogleClientId(clientId) {
  if (!clientId) {
    console.log('❌ Please provide a Google Client ID');
    console.log('Usage: node setup-google-oauth.js "your_google_client_id_here"');
    return;
  }

  try {
    // Update frontend .env
    let frontendEnv = fs.readFileSync(frontendEnvPath, 'utf8');
    const frontendRegex = /^VITE_GOOGLE_CLIENT_ID=.*$/m;
    if (frontendEnv.match(frontendRegex)) {
      frontendEnv = frontendEnv.replace(frontendRegex, `VITE_GOOGLE_CLIENT_ID=${clientId}`);
    } else {
      frontendEnv += `\nVITE_GOOGLE_CLIENT_ID=${clientId}`;
    }
    fs.writeFileSync(frontendEnvPath, frontendEnv);

    // Update backend .env
    let backendEnv = fs.readFileSync(backendEnvPath, 'utf8');
    const backendRegex = /^GOOGLE_CLIENT_ID=.*$/m;
    if (backendEnv.match(backendRegex)) {
      backendEnv = backendEnv.replace(backendRegex, `GOOGLE_CLIENT_ID=${clientId}`);
    } else {
      backendEnv += `\nGOOGLE_CLIENT_ID=${clientId}`;
    }
    fs.writeFileSync(backendEnvPath, backendEnv);

    console.log('✅ Google Client ID updated successfully!');
    console.log('🔄 Please restart both frontend and backend servers to apply changes.');
    console.log('');
    console.log('Frontend: npm run dev (in frontend directory)');
    console.log('Backend: npm start (in backend directory)');
    
  } catch (error) {
    console.error('❌ Error updating Google Client ID:', error.message);
  }
}

const clientId = process.argv[2];

if (!clientId) {
  console.log('🔧 Google OAuth Setup Helper');
  console.log('');
  console.log('To set up Google OAuth:');
  console.log('1. Go to https://console.cloud.google.com/');
  console.log('2. Create a new project or select existing');
  console.log('3. Enable Google Identity API');
  console.log('4. Create OAuth 2.0 credentials');
  console.log('5. Copy your Client ID');
  console.log('6. Run: node setup-google-oauth.js "your_client_id_here"');
  console.log('');
  console.log('Current configuration:');
  try {
    const frontendEnv = fs.readFileSync(frontendEnvPath, 'utf8');
    const backendEnv = fs.readFileSync(backendEnvPath, 'utf8');
    
    const frontendMatch = frontendEnv.match(/VITE_GOOGLE_CLIENT_ID=(.*)/);
    const backendMatch = backendEnv.match(/GOOGLE_CLIENT_ID=(.*)/);
    
    console.log('Frontend Client ID:', frontendMatch ? frontendMatch[1] : 'Not set');
    console.log('Backend Client ID:', backendMatch ? backendMatch[1] : 'Not set');
  } catch (error) {
    console.log('Could not read current configuration');
  }
} else {
  updateGoogleClientId(clientId);
}
