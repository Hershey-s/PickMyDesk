// Test AI Features for PickMyDesk
import axios from 'axios';

const API_BASE = 'http://localhost:5006';

// Test user token (replace with actual token)
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODM4OWRiYjFlZThjYjVmMjIzODM4NmMiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJ1c2VybmFtZSI6InRlc3R1c2VyIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NDg1NDA5MDcsImV4cCI6MTc0OTc1MDUwN30.S4jK6xW6s2J8m8KHBEgS2wTe7KQNzvC5qtzdEM4opOU';

async function testSmartRecommendations() {
  try {
    console.log('🤖 Testing Smart Recommendations API...');
    
    const response = await axios.get(`${API_BASE}/workspaces/recommendations`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Smart Recommendations Response:');
    console.log('- Success:', response.data.success);
    console.log('- Recommendations count:', response.data.recommendations?.length || 0);
    console.log('- User preferences:', response.data.userPreferences);
    
    if (response.data.recommendations && response.data.recommendations.length > 0) {
      console.log('\n📊 Top Recommendation:');
      const top = response.data.recommendations[0];
      console.log('- Title:', top.title);
      console.log('- Score:', top.recommendationScore);
      console.log('- Match %:', top.matchPercentage);
      console.log('- Reasons:', top.recommendationReasons);
    }

  } catch (error) {
    console.error('❌ Smart Recommendations Error:');
    console.error('- Status:', error.response?.status);
    console.error('- Message:', error.response?.data?.message || error.message);
  }
}

async function testWorkspacesList() {
  try {
    console.log('\n📋 Testing Workspaces List...');
    
    const response = await axios.get(`${API_BASE}/workspaces`);
    
    console.log('✅ Workspaces Response:');
    console.log('- Total workspaces:', response.data.length);
    
    if (response.data.length > 0) {
      console.log('- Sample workspace:', {
        title: response.data[0].title,
        location: response.data[0].location,
        price: response.data[0].price
      });
    }

  } catch (error) {
    console.error('❌ Workspaces List Error:', error.message);
  }
}

async function testUserBookings() {
  try {
    console.log('\n📅 Testing User Bookings...');
    
    const response = await axios.get(`${API_BASE}/bookings`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ User Bookings Response:');
    console.log('- Bookings count:', response.data.length || 0);

  } catch (error) {
    console.error('❌ User Bookings Error:');
    console.error('- Status:', error.response?.status);
    console.error('- Message:', error.response?.data?.message || error.message);
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting AI Features Tests for PickMyDesk\n');
  
  await testWorkspacesList();
  await testUserBookings();
  await testSmartRecommendations();
  
  console.log('\n✨ Tests completed!');
}

runTests().catch(console.error);
