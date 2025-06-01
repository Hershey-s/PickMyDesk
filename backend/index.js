// Load environment variables first
import dotenv from "dotenv";
dotenv.config();

console.log("Starting backend server...");

import connectDB from "./config/db.js";

import express from "express";
import cors from "cors";

import userRouter from "./router/userReg.router.js";
import WorksSpaceRouter from "./router/workspace.router.js";
import bookingRouter from "./router/booking.router.js";
import analyticsRouter from "./routes/analytics.js";
import verifyToken from "./middlewares/authMiddleware.js";

const port = process.env.PORT || 5006;
const app = express();

const environment = process.env.NODE_ENV || "development";

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:3000",
    environment === "production"
      ? "https://works-space-hub.onrender.com"
      : null,
  ].filter(Boolean),
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Handle preflight requests
app.options("*", cors(corsOptions));

app.use("/", userRouter);
app.use("/", WorksSpaceRouter);
app.use("/", bookingRouter);
app.use("/analytics", analyticsRouter);

app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

// Test endpoint for JWT debugging
app.get("/test-auth", verifyToken, (req, res) => {
  res.json({
    message: "Authentication successful!",
    user: req.user,
  });
});

// Connect to database asynchronously (non-blocking)
console.log("🔗 Connecting to database...");
connectDB().catch((error) => {
  console.error("⚠️ Database connection failed:", error.message);
  console.log("🚀 Server will continue running without database...");
});

console.log("Starting server on port:", port);
app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
