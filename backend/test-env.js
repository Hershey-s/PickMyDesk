import dotenv from "dotenv";

console.log("🔄 Testing environment variables...");

// Load environment variables
dotenv.config();

console.log("Environment variables loaded:");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("MONGO_URL:", process.env.MONGO_URL ? "✅ Found" : "❌ Missing");
console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY ? "✅ Found" : "❌ Missing");
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "✅ Found" : "❌ Missing");

if (process.env.MONGO_URL) {
  console.log("MONGO_URL value:", process.env.MONGO_URL);
} else {
  console.log("❌ MONGO_URL is not set!");
  console.log("Current working directory:", process.cwd());
  console.log("Looking for .env file at:", process.cwd() + "/.env");
}

// Test if .env file exists
import fs from 'fs';
const envPath = '.env';
if (fs.existsSync(envPath)) {
  console.log("✅ .env file exists");
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log("📄 .env file content preview:");
  console.log(envContent.split('\n').slice(0, 5).join('\n'));
} else {
  console.log("❌ .env file not found");
}
