import axios from 'axios';

async function testWorkspaceCreation() {
  try {
    console.log("🧪 Testing workspace creation...");

    // Test data
    const workspaceData = {
      title: "Modern Hub",
      description: "free wifi, free food, with desks",
      location: "Bengaluru, Karnataka",
      country: "India",
      price: 2400,
      priceUnit: "day",
      currency: "INR",
      tags: JSON.stringify(["co working", "quiet", "19th floor", "food", "wifi"]),
      isPopular: false
    };

    console.log("📝 Sending data:", workspaceData);

    // First test without auth (should fail)
    try {
      const response = await axios.post('http://localhost:5006/workspaces', workspaceData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("❌ Unexpected success without auth");
    } catch (error) {
      console.log("✅ Correctly rejected without auth:", error.response?.status);
    }

    // Test with fake auth token (should fail with different error)
    try {
      const response = await axios.post('http://localhost:5006/workspaces', workspaceData, {
        headers: {
          'Authorization': 'Bearer fake-token',
          'Content-Type': 'application/json'
        }
      });
      console.log("❌ Unexpected success with fake token");
    } catch (error) {
      console.log("✅ Correctly rejected fake token:", error.response?.status, error.response?.data?.message);
    }

  } catch (error) {
    console.error("❌ Test failed:");
    console.error("Error:", error.message);
  }
}

testWorkspaceCreation();
