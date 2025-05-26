import { v2 as cloudinary } from "cloudinary";

// Validate that required environment variables are set
const requiredEnvVars = ["CLOUD_NAME", "CLOUD_API_KEY", "CLOUD_API_SECRET"];
const missingVars = [];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar] || process.env[envVar].includes('your_')) {
    missingVars.push(envVar);
  }
}

let configuredCloudinary;

if (missingVars.length > 0) {
  console.warn(`⚠️  Cloudinary not configured. Missing/placeholder values for: ${missingVars.join(', ')}`);
  console.log("To enable file uploads:");
  console.log("1. Sign up at https://cloudinary.com (free tier available)");
  console.log("2. Get your Cloud Name, API Key, and API Secret");
  console.log("3. Update these values in backend/.env file");
  console.log("4. Restart the server");

  // Create a dummy cloudinary object for now
  configuredCloudinary = {
    uploader: {
      upload: () => Promise.reject(new Error("Cloudinary not configured"))
    }
  };
} else {
  // Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    secure: true, // Always use HTTPS
  });

  configuredCloudinary = cloudinary;
}

export { configuredCloudinary as cloudinary };
