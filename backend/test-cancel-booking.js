import axios from 'axios';

async function testCancelBooking() {
  try {
    console.log("🧪 Testing booking cancellation functionality...");

    const baseURL = 'http://localhost:5006';

    // Step 1: Create/Login as user
    console.log("📝 Creating/logging in as test user...");
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
      } else {
        throw error;
      }
    }

    // Step 2: Get user's bookings
    console.log("🔍 Getting user bookings...");
    const bookingsResponse = await axios.get(`${baseURL}/bookings/user`, {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });

    const bookings = bookingsResponse.data.bookings;
    console.log(`📋 Found ${bookings.length} bookings`);

    if (bookings.length === 0) {
      console.log("❌ No bookings found to test cancellation");
      return;
    }

    // Find a confirmed booking to cancel
    const confirmedBooking = bookings.find(b => b.status === 'confirmed' || b.status === 'pending');
    
    if (!confirmedBooking) {
      console.log("❌ No confirmed/pending bookings found to cancel");
      console.log("Available bookings:", bookings.map(b => ({ id: b._id, status: b.status })));
      return;
    }

    console.log("✅ Found booking to cancel:", {
      id: confirmedBooking._id,
      status: confirmedBooking.status,
      workspace: confirmedBooking.workspace?.title || 'Unknown'
    });

    // Step 3: Test the new cancel endpoint
    console.log("🚫 Testing cancel booking endpoint...");
    const cancelResponse = await axios.put(
      `${baseURL}/bookings/${confirmedBooking._id}/cancel`,
      {
        cancellationReason: "Test cancellation from script"
      },
      {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log("✅ Booking cancelled successfully!");
    console.log("Response:", cancelResponse.data);

    // Step 4: Verify the booking was cancelled
    console.log("🔍 Verifying booking was cancelled...");
    const verifyResponse = await axios.get(`${baseURL}/bookings/user`, {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });

    const updatedBooking = verifyResponse.data.bookings.find(b => b._id === confirmedBooking._id);
    if (updatedBooking && updatedBooking.status === 'cancelled') {
      console.log("✅ Booking cancellation verified!");
      console.log("Updated status:", updatedBooking.status);
      console.log("Cancellation reason:", updatedBooking.cancellationReason);
    } else {
      console.log("❌ Booking cancellation verification failed");
    }

  } catch (error) {
    console.error("❌ Test failed:");
    console.error("Status:", error.response?.status);
    console.error("Message:", error.response?.data?.message);
    console.error("Error:", error.response?.data?.error);
    console.error("Full error:", error.message);
  }
}

testCancelBooking();
