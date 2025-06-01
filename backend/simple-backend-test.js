// Simple backend test to check if Node.js works
console.log("🚀 Starting simple backend test...");

import express from "express";
import cors from "cors";

const app = express();
const port = 5006;

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// Test routes
app.get("/", (req, res) => {
  console.log("📞 Root endpoint called");
  res.json({ 
    message: "Backend is working!", 
    timestamp: new Date().toISOString(),
    status: "success"
  });
});

app.get("/test", (req, res) => {
  console.log("📞 Test endpoint called");
  res.json({ 
    message: "Test endpoint working!",
    ai_features: "ready"
  });
});

// Mock recommendations endpoint
app.get("/workspaces/recommendations", (req, res) => {
  console.log("🤖 Recommendations endpoint called");
  res.json({
    success: true,
    message: "Mock AI recommendations",
    recommendations: [
      {
        _id: "test1",
        title: "AI Test Workspace 1",
        location: "Mumbai",
        price: 500,
        currency: "INR",
        priceUnit: "hour",
        recommendationScore: 95,
        matchPercentage: 95,
        recommendationReasons: ["AI-powered match", "Perfect location", "Great value"],
        isPopular: true,
        avgRating: 4.8,
        maxCapacity: 10,
        tags: ["WiFi", "Coffee", "AI-Ready"],
        listingImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400"
      }
    ],
    userPreferences: {
      preferredPriceRange: { min: 0, max: 1000 },
      preferredLocations: ["Mumbai"],
      preferredAmenities: ["WiFi"],
      avgGuestCount: 1,
      bookingFrequency: "new_user"
    }
  });
});

// Mock workspaces endpoint
app.get("/workspaces", (req, res) => {
  console.log("📋 Workspaces endpoint called");
  res.json([
    {
      _id: "ws1",
      title: "Test Workspace 1",
      location: "Mumbai",
      country: "India",
      price: 500,
      currency: "INR",
      priceUnit: "hour",
      description: "Test workspace for AI features",
      listingImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400",
      isPopular: true,
      avgRating: 4.5,
      maxCapacity: 10,
      tags: ["WiFi", "Coffee", "Meeting Room"]
    }
  ]);
});

// Error handling
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);
  res.status(500).json({ 
    error: "Internal server error",
    message: err.message 
  });
});

// Start server
app.listen(port, () => {
  console.log(`✅ Simple backend test server running on http://localhost:${port}`);
  console.log("🔗 Available endpoints:");
  console.log("   - GET / (root test)");
  console.log("   - GET /test (simple test)");
  console.log("   - GET /workspaces/recommendations (AI test)");
  console.log("   - GET /workspaces (workspaces test)");
  console.log("");
  console.log("🌐 Frontend should be running on http://localhost:5173");
  console.log("🤖 AI features should now work!");
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Server shutting down...');
  process.exit(0);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
