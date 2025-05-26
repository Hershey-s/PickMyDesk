#!/usr/bin/env node

/**
 * Configuration Setup Helper for WorkspaceHub
 * This script helps you update your environment variables
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, 'backend', '.env');

function updateEnvFile(updates) {
  try {
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    Object.entries(updates).forEach(([key, value]) => {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      if (envContent.match(regex)) {
        envContent = envContent.replace(regex, `${key}=${value}`);
      } else {
        envContent += `\n${key}=${value}`;
      }
    });
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Environment file updated successfully!');
    console.log('🔄 Please restart your backend server to apply changes.');
    
  } catch (error) {
    console.error('❌ Error updating environment file:', error.message);
  }
}

// Example usage:
console.log('🔧 WorkspaceHub Configuration Helper');
console.log('📁 Environment file location:', envPath);
console.log('');
console.log('To update your configuration, you can use this script like:');
console.log('');
console.log('For MongoDB Atlas:');
console.log('node setup-config.js mongo "mongodb+srv://username:password@cluster.mongodb.net/workspace"');
console.log('');
console.log('For Cloudinary:');
console.log('node setup-config.js cloudinary "cloud_name" "api_key" "api_secret"');
console.log('');

const command = process.argv[2];
const args = process.argv.slice(3);

if (command === 'mongo' && args.length === 1) {
  updateEnvFile({
    MONGO_URL: args[0]
  });
} else if (command === 'cloudinary' && args.length === 3) {
  updateEnvFile({
    CLOUD_NAME: args[0],
    CLOUD_API_KEY: args[1],
    CLOUD_API_SECRET: args[2]
  });
} else if (command === 'test') {
  console.log('🧪 Testing current configuration...');
  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    console.log('Current .env file contents:');
    console.log('---');
    console.log(envContent);
    console.log('---');
  } catch (error) {
    console.error('❌ Could not read .env file:', error.message);
  }
}
