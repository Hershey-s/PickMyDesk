import axios from 'axios';

async function testUserBooking() {
  try {
    console.log("🧪 Testing user booking functionality...");

    const baseURL = 'http://localhost:5006';

    // Step 1: Create a test user account
    console.log("📝 Creating test user account...");
    const userData = {
      username: "testuser",
      email: "testuser@example.com",
      password: "testpassword123",
      role: "user"
    };

    let userToken;
    try {
      const signupResponse = await axios.post(`${baseURL}/signup`, userData);
      userToken = signupResponse.data.token;
      console.log("✅ User created successfully");
      console.log("User role:", signupResponse.data.user.role);
    } catch (error) {
      if (error.response?.data?.message === "User already exists") {
        console.log("ℹ️ User already exists, trying to login...");
        const loginResponse = await axios.post(`${baseURL}/login`, {
          email: userData.email,
          password: userData.password,
          expectedRole: "user"
        });
        userToken = loginResponse.data.token;
        console.log("✅ User logged in successfully");
        console.log("User role:", loginResponse.data.user.role);
      } else {
        throw error;
      }
    }

    // Step 2: Get available workspaces
    console.log("🔍 Getting available workspaces...");
    const workspacesResponse = await axios.get(`${baseURL}/workspaces`);
    const workspaces = workspacesResponse.data.workspaces || workspacesResponse.data;
    
    if (!workspaces || workspaces.length === 0) {
      console.log("❌ No workspaces available for booking");
      return;
    }

    const workspace = workspaces[0];
    console.log("✅ Found workspace:", workspace.title);
    console.log("Workspace ID:", workspace._id);

    // Step 3: Try to create a booking
    console.log("📅 Creating test booking...");
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);

    const bookingData = {
      workspaceId: workspace._id,
      startDate: tomorrow.toISOString().split('T')[0],
      endDate: dayAfter.toISOString().split('T')[0],
      startTime: "09:00",
      endTime: "17:00",
      guestCount: 1,
      specialRequests: "Test booking",
      contactInfo: {
        phone: "+91 9876543210",
        email: "testuser@example.com"
      }
    };

    console.log("Booking data:", bookingData);

    const bookingResponse = await axios.post(`${baseURL}/bookings`, bookingData, {
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log("✅ Booking created successfully!");
    console.log("Booking ID:", bookingResponse.data.booking._id);
    console.log("Status:", bookingResponse.data.booking.status);

  } catch (error) {
    console.error("❌ Test failed:");
    console.error("Status:", error.response?.status);
    console.error("Message:", error.response?.data?.message);
    console.error("Error:", error.response?.data?.error);
    console.error("Full error:", error.message);
  }
}

testUserBooking();
