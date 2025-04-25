import { v2 as cloudinary } from "cloudinary";

// Validate that required environment variables are set
const requiredEnvVars = ["CLOUD_NAME", "CLOUD_API_KEY", "CLOUD_API_SECRET"];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true, // Always use HTTPS
});

export { cloudinary };
