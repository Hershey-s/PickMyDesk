import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log("🚀 Starting minimal backend...");

const app = express();
const port = process.env.PORT || 5006;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: "Minimal backend is working!",
    port: port,
    timestamp: new Date().toISOString()
  });
});

// Test workspace creation route (without database)
app.post('/workspaces', (req, res) => {
  console.log("📝 Workspace creation request received:");
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  
  // Check authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      message: "Authorization header missing",
      error: "NO_AUTH_HEADER"
    });
  }
  
  // Mock successful response
  res.status(201).json({
    message: "Workspace created successfully! (Mock response)",
    workspace: {
      id: "mock-id-123",
      title: req.body.title || "Mock Workspace",
      location: req.body.location || "Mock Location",
      price: req.body.price || 100
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`✅ Minimal backend running on port ${port}`);
  console.log(`🌐 URL: http://localhost:${port}`);
  console.log(`📝 Test workspace creation: POST http://localhost:${port}/workspaces`);
});
