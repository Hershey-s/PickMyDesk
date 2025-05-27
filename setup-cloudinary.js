#!/usr/bin/env node

/**
 * Cloudinary Setup Helper for PickMyDesk
 * This script helps you configure Cloudinary for image uploads
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, 'backend', '.env');

console.log('🎨 PickMyDesk Cloudinary Setup Helper');
console.log('=====================================');

function updateCloudinaryConfig(cloudName, apiKey, apiSecret) {
  try {
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Update Cloudinary configuration
    envContent = envContent.replace(/CLOUD_NAME=.*/, `CLOUD_NAME=${cloudName}`);
    envContent = envContent.replace(/CLOUD_API_KEY=.*/, `CLOUD_API_KEY=${apiKey}`);
    envContent = envContent.replace(/CLOUD_API_SECRET=.*/, `CLOUD_API_SECRET=${apiSecret}`);
    
    fs.writeFileSync(envPath, envContent);
    
    console.log('✅ Cloudinary configuration updated successfully!');
    console.log('📁 Image uploads are now enabled for workspace creation');
    console.log('🔄 Please restart your backend server to apply changes');
    console.log('');
    console.log('🎯 Next steps:');
    console.log('1. Restart backend: cd backend && npm start');
    console.log('2. Test workspace creation with image upload');
    
  } catch (error) {
    console.error('❌ Error updating configuration:', error.message);
  }
}

function showInstructions() {
  console.log('📋 How to get your Cloudinary credentials:');
  console.log('');
  console.log('1. 🌐 Go to https://cloudinary.com/users/register/free');
  console.log('2. 📝 Sign up for a free account');
  console.log('3. 📊 Go to your Dashboard');
  console.log('4. 📋 Copy these values:');
  console.log('   - Cloud Name (e.g., "dxyz123abc")');
  console.log('   - API Key (e.g., "123456789012345")');
  console.log('   - API Secret (e.g., "abcdefghijklmnopqrstuvwxyz123456")');
  console.log('');
  console.log('💡 Usage:');
  console.log('node setup-cloudinary.js <cloud_name> <api_key> <api_secret>');
  console.log('');
  console.log('📝 Example:');
  console.log('node setup-cloudinary.js dxyz123abc 123456789012345 abcdefghijklmnopqrstuvwxyz123456');
  console.log('');
  console.log('🆓 Free tier includes:');
  console.log('- 25 GB storage');
  console.log('- 25 GB monthly bandwidth');
  console.log('- 1,000 transformations per month');
  console.log('- Perfect for development and small projects!');
}

// Get command line arguments
const args = process.argv.slice(2);

if (args.length === 3) {
  const [cloudName, apiKey, apiSecret] = args;
  
  console.log('🔧 Configuring Cloudinary...');
  console.log(`Cloud Name: ${cloudName}`);
  console.log(`API Key: ${apiKey}`);
  console.log(`API Secret: ${'*'.repeat(apiSecret.length)}`);
  console.log('');
  
  updateCloudinaryConfig(cloudName, apiKey, apiSecret);
  
} else if (args.length === 1 && args[0] === 'test') {
  console.log('🧪 Testing current Cloudinary configuration...');
  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    const cloudName = lines.find(line => line.startsWith('CLOUD_NAME='))?.split('=')[1];
    const apiKey = lines.find(line => line.startsWith('CLOUD_API_KEY='))?.split('=')[1];
    const apiSecret = lines.find(line => line.startsWith('CLOUD_API_SECRET='))?.split('=')[1];
    
    console.log('Current configuration:');
    console.log(`Cloud Name: ${cloudName || 'Not set'}`);
    console.log(`API Key: ${apiKey || 'Not set'}`);
    console.log(`API Secret: ${apiSecret ? '*'.repeat(apiSecret.length) : 'Not set'}`);
    
    if (cloudName?.includes('your_') || !cloudName || !apiKey || !apiSecret) {
      console.log('❌ Cloudinary not configured properly');
      console.log('🔧 Run this script with your credentials to fix it');
    } else {
      console.log('✅ Cloudinary appears to be configured');
    }
    
  } catch (error) {
    console.error('❌ Could not read configuration:', error.message);
  }
  
} else {
  showInstructions();
}
