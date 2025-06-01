import axios from 'axios';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY || "workspacehub_super_secret_key_for_development_2024";

// Create a test token
const testUser = {
  userId: "507f1f77bcf86cd799439011", // Mock user ID
  email: "test@example.com",
  username: "testuser",
  role: "user"
};

const testToken = jwt.sign(testUser, JWT_SECRET, { expiresIn: "1h" });

console.log("🧪 Testing AI Recommendations Endpoint");
console.log("Token created for user:", testUser.username);

async function testRecommendations() {
  try {
    console.log("\n📡 Making request to recommendations endpoint...");
    
    const response = await axios.get('http://localhost:5007/workspaces/recommendations', {
      headers: {
        'Authorization': `Bearer ${testToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log("✅ Success! Status:", response.status);
    console.log("📊 Response data:", JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error("❌ Error:", error.response?.status, error.response?.statusText);
    console.error("📝 Error details:", error.response?.data);
    console.error("🔍 Full error:", error.message);
  }
}

// Test basic backend connection first
async function testBackend() {
  try {
    console.log("\n🔗 Testing backend connection...");
    const response = await axios.get('http://localhost:5007');
    console.log("✅ Backend is running:", response.data);
  } catch (error) {
    console.error("❌ Backend connection failed:", error.message);
    return false;
  }
  return true;
}

// Run tests
async function runTests() {
  console.log("🚀 Starting AI Recommendations Tests\n");
  
  const backendOk = await testBackend();
  if (!backendOk) {
    console.log("❌ Backend not available, stopping tests");
    return;
  }
  
  await testRecommendations();
  
  console.log("\n✨ Tests completed!");
}

runTests();
