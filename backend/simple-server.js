// Simple working server for testing
import express from "express";
import cors from "cors";

const app = express();
const port = 5004;

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

// Test routes
app.get("/", (req, res) => {
  res.json({ message: "Backend is working!" });
});

app.post("/signup", (req, res) => {
  console.log("Signup request:", req.body);
  const { username, email, password, role = "user" } = req.body;
  
  // Simple validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  
  // Mock successful response
  res.status(201).json({
    message: "User registered successfully",
    token: "mock_jwt_token_for_testing",
    user: {
      id: "mock_user_id",
      username,
      email,
      role
    }
  });
});

app.post("/login", (req, res) => {
  console.log("Login request:", req.body);
  const { email, password } = req.body;
  
  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ message: "Missing email or password" });
  }
  
  // Mock successful response
  res.status(200).json({
    message: "Login successful",
    token: "mock_jwt_token_for_testing",
    user: {
      id: "mock_user_id",
      username: "Test User",
      email,
      role: "user"
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`✅ Simple server running on http://localhost:${port}`);
});
