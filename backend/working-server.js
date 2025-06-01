// Working backend server with AI features
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();
const port = 5007;

console.log("🚀 Starting PickMyDesk Backend with AI Features...");

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// JWT Secret
const JWT_SECRET = "workspacehub_super_secret_key_for_development_2024";

// Mock data
const mockWorkspaces = [
  {
    _id: "ws1",
    title: "Modern Co-working Space",
    location: "Mumbai",
    country: "India",
    price: 500,
    currency: "INR",
    priceUnit: "hour",
    description:
      "A beautiful workspace in the heart of Mumbai with all modern amenities",
    listingImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
    isPopular: true,
    avgRating: 4.5,
    maxCapacity: 10,
    tags: ["WiFi", "Coffee", "Meeting Room", "Parking"],
    availableFrom: new Date(),
    availableUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  {
    _id: "ws2",
    title: "Creative Studio Space",
    location: "Delhi",
    country: "India",
    price: 750,
    currency: "INR",
    priceUnit: "hour",
    description: "Modern workspace perfect for creative teams and startups",
    listingImage:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=300&fit=crop",
    isPopular: false,
    avgRating: 4.2,
    maxCapacity: 8,
    tags: ["WiFi", "Parking", "AC", "Projector"],
    availableFrom: new Date(),
    availableUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  {
    _id: "ws3",
    title: "Tech Hub Workspace",
    location: "Bangalore",
    country: "India",
    price: 600,
    currency: "INR",
    priceUnit: "hour",
    description:
      "Perfect for tech teams with high-speed internet and modern facilities",
    listingImage:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&h=300&fit=crop",
    isPopular: true,
    avgRating: 4.7,
    maxCapacity: 12,
    tags: ["High-speed WiFi", "Projector", "Whiteboard", "24/7 Access"],
    availableFrom: new Date(),
    availableUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  {
    _id: "ws4",
    title: "Premium Business Center",
    location: "Mumbai",
    country: "India",
    price: 1200,
    currency: "INR",
    priceUnit: "hour",
    description:
      "High-end workspace perfect for client meetings and presentations",
    listingImage:
      "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=400&h=300&fit=crop",
    isPopular: true,
    avgRating: 4.8,
    maxCapacity: 6,
    tags: ["Premium WiFi", "Reception", "Coffee", "Conference Room"],
    availableFrom: new Date(),
    availableUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
];

const mockUsers = [
  {
    id: "user1",
    username: "testuser",
    email: "test@example.com",
    password: "password123", // In real app, this would be hashed
    role: "user",
  },
  {
    id: "admin1",
    username: "admin",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  },
];

const mockBookings = [
  {
    _id: "booking1",
    user: "user1",
    workspace: "ws1",
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    guestCount: 4,
    status: "completed",
  },
  {
    _id: "booking2",
    user: "user1",
    workspace: "ws3",
    startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    guestCount: 2,
    status: "completed",
  },
];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "PickMyDesk Backend with AI Features is running!",
    features: ["Smart Recommendations", "AI Chatbot", "Workspace Management"],
    status: "active",
  });
});

// Auth routes
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = mockUsers.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.json({
    message: "Login successful",
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});

app.post("/signup", (req, res) => {
  const { username, email, password, role = "user" } = req.body;

  // Check if user exists
  if (mockUsers.find((u) => u.email === email)) {
    return res.status(400).json({ message: "User already exists" });
  }

  const newUser = {
    id: `user${Date.now()}`,
    username,
    email,
    password, // In real app, hash this
    role,
  };

  mockUsers.push(newUser);

  const token = jwt.sign(
    {
      userId: newUser.id,
      email: newUser.email,
      username: newUser.username,
      role: newUser.role,
    },
    JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.json({
    message: "User registered successfully",
    token,
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    },
  });
});

// Workspace routes
app.get("/workspaces", (req, res) => {
  console.log("📋 Fetching all workspaces");
  res.json(mockWorkspaces);
});

app.get("/workspaces/:id", (req, res) => {
  const workspace = mockWorkspaces.find((w) => w._id === req.params.id);
  if (!workspace) {
    return res.status(404).json({ message: "Workspace not found" });
  }
  res.json(workspace);
});

// AI Smart Recommendations Route
app.get("/workspaces/recommendations", authenticateToken, (req, res) => {
  console.log("🤖 Generating smart recommendations for user:", req.user.userId);

  // Get user's booking history
  const userBookings = mockBookings.filter((b) => b.user === req.user.userId);
  console.log("📊 User booking history:", userBookings.length, "bookings");

  // Analyze user preferences
  let preferences = {
    preferredPriceRange: { min: 0, max: 1000 },
    preferredLocations: [],
    preferredAmenities: [],
    avgGuestCount: 1,
    bookingFrequency: "new_user",
  };

  if (userBookings.length > 0) {
    // Calculate preferences based on booking history
    const avgGuestCount =
      userBookings.reduce((sum, b) => sum + b.guestCount, 0) /
      userBookings.length;
    const bookedWorkspaces = userBookings
      .map((b) => mockWorkspaces.find((w) => w._id === b.workspace))
      .filter(Boolean);
    const avgPrice =
      bookedWorkspaces.reduce((sum, w) => sum + w.price, 0) /
      bookedWorkspaces.length;

    preferences = {
      preferredPriceRange: { min: avgPrice * 0.7, max: avgPrice * 1.3 },
      preferredLocations: [...new Set(bookedWorkspaces.map((w) => w.location))],
      preferredAmenities: [
        ...new Set(bookedWorkspaces.flatMap((w) => w.tags)),
      ].slice(0, 3),
      avgGuestCount: Math.round(avgGuestCount),
      bookingFrequency: "regular",
    };
  }

  // Generate recommendations with AI scoring
  const recommendations = mockWorkspaces
    .map((workspace) => {
      let score = 0;
      const reasons = [];

      // Price matching (30% weight)
      if (
        workspace.price >= preferences.preferredPriceRange.min &&
        workspace.price <= preferences.preferredPriceRange.max
      ) {
        score += 30;
        reasons.push("Price matches your budget");
      } else if (workspace.price < preferences.preferredPriceRange.min) {
        score += 20;
        reasons.push("Great value for money");
      }

      // Location matching (25% weight)
      if (preferences.preferredLocations.includes(workspace.location)) {
        score += 25;
        reasons.push("In your preferred location");
      }

      // Amenity matching (20% weight)
      const matchingAmenities = workspace.tags.filter((tag) =>
        preferences.preferredAmenities.includes(tag)
      );
      if (matchingAmenities.length > 0) {
        score +=
          (matchingAmenities.length /
            Math.max(preferences.preferredAmenities.length, 1)) *
          20;
        reasons.push(
          `Has ${matchingAmenities.length} of your preferred amenities`
        );
      }

      // Capacity matching (15% weight)
      if (workspace.maxCapacity >= preferences.avgGuestCount) {
        score += 15;
        if (workspace.maxCapacity === preferences.avgGuestCount) {
          reasons.push("Perfect capacity for your group size");
        } else {
          reasons.push("Suitable for your group size");
        }
      }

      // Popularity bonus (10% weight)
      if (workspace.isPopular) {
        score += 10;
        reasons.push("Popular choice among users");
      }

      // Rating bonus
      if (workspace.avgRating >= 4) {
        score += 5;
        reasons.push("Highly rated workspace");
      }

      return {
        ...workspace,
        recommendationScore: Math.round(score),
        recommendationReasons: reasons,
        matchPercentage: Math.min(100, Math.round(score)),
      };
    })
    .filter((w) => w.recommendationScore > 20)
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, 6);

  console.log("✨ Generated", recommendations.length, "recommendations");

  res.json({
    success: true,
    recommendations,
    userPreferences: preferences,
    totalAnalyzed: mockWorkspaces.length,
  });
});

// Booking routes
app.get("/bookings", authenticateToken, (req, res) => {
  const userBookings = mockBookings.filter((b) => b.user === req.user.userId);
  res.json(userBookings);
});

// Error handling
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
});

// Start server
app.listen(port, () => {
  console.log(`✅ PickMyDesk Backend running on http://localhost:${port}`);
  console.log("🤖 AI Features Available:");
  console.log("   - Smart Recommendations: GET /workspaces/recommendations");
  console.log("   - Workspace Discovery: GET /workspaces");
  console.log("   - User Authentication: POST /login, POST /signup");
  console.log("");
  console.log("🌐 Frontend URL: http://localhost:5173");
  console.log("🚀 Ready for AI-powered workspace booking!");
});

process.on("SIGINT", () => {
  console.log("\n🛑 Server shutting down gracefully...");
  process.exit(0);
});
