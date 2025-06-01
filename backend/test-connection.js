// Test script to check if backend is working
import fetch from 'node-fetch';

async function testBackend() {
  try {
    console.log("Testing backend connection...");
    
    // Test root endpoint
    const response = await fetch('http://localhost:5004');
    const data = await response.json();
    console.log("✅ Backend response:", data);
    
    // Test signup endpoint
    const signupResponse = await fetch('http://localhost:5004/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword',
        role: 'user'
      })
    });
    
    const signupData = await signupResponse.json();
    console.log("✅ Signup response:", signupData);
    
  } catch (error) {
    console.error("❌ Backend test failed:", error.message);
  }
}

testBackend();
