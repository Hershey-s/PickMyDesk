import User from "../models/userReg.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// JWT Secret - ensure consistency across the app
const JWT_SECRET =
  process.env.JWT_SECRET_KEY ||
  "workspacehub_super_secret_key_for_development_2024";

export const singUp = async (req, res) => {
  try {
    console.log("📝 Signup request received:", req.body);
    const { username, email, password, role = "user" } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ message: "Missing required fields" });
    }

    console.log("🔍 Checking if user exists for email:", email);
    const userExists = await User.find({ email });
    if (userExists.length > 0) {
      console.log("⚠️ User already exists");
      return res.status(400).json({ message: "User already exists" });
    }

    // Validate role
    if (!["user", "admin"].includes(role)) {
      console.log("Invalid role provided:", role);
      return res
        .status(400)
        .json({ message: "Invalid role. Must be 'user' or 'admin'" });
    }

    console.log("Creating new user with role:", role);
    const newUser = new User({ username, email, password, role });

    console.log("Saving user to database...");
    const result = await newUser.save();
    console.log("User saved successfully:", result._id);

    const token = jwt.sign(
      {
        userId: result._id,
        email: result.email,
        username: result.username,
        role: result.role,
      },
      JWT_SECRET,
      { expiresIn: "14d" }
    );

    if (result) {
      console.log("Sending success response");
      res.status(201).json({
        message: "User registered successfully",
        token, // Return the JWT token to the client
        user: {
          id: result._id,
          username: result.username,
          email: result.email,
          role: result.role,
        },
      });
    } else {
      throw new Error("User registration failed");
    }
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

export const logIn = async (req, res) => {
  try {
    console.log("🔐 Login request received:", {
      email: req.body.email,
      expectedRole: req.body.expectedRole,
    });
    const { email, password, expectedRole } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found for email:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Invalid password for user:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check role if expectedRole is provided
    if (expectedRole && user.role !== expectedRole) {
      console.log(
        `❌ Role mismatch. Expected: ${expectedRole}, Actual: ${user.role}`
      );
      return res.status(403).json({
        message: `Access denied. This login is for ${expectedRole}s only.`,
        userRole: user.role,
        expectedRole: expectedRole,
      });
    }

    console.log(
      "✅ Login successful for user:",
      user.username,
      "Role:",
      user.role
    );

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "14d" }
    );

    // Send response with token
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

export const googleAuth = async (req, res) => {
  try {
    console.log("🔐 Google Auth request received:", {
      expectedRole: req.body.expectedRole,
    });
    const { token, expectedRole } = req.body;

    // Initialize Google OAuth client
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist (default to 'user' role for Google auth)
      user = new User({
        username: name,
        email: email,
        password: "google_oauth_user", // Placeholder password for OAuth users
        profilePicture: picture,
        role: expectedRole || "user", // Use expectedRole or default to 'user'
      });
      await user.save();
      console.log("✅ New Google user created with role:", user.role);
    }

    // Check role if expectedRole is provided
    if (expectedRole && user.role !== expectedRole) {
      console.log(
        `❌ Google Auth role mismatch. Expected: ${expectedRole}, Actual: ${user.role}`
      );
      return res.status(403).json({
        message: `Access denied. This login is for ${expectedRole}s only.`,
        userRole: user.role,
        expectedRole: expectedRole,
      });
    }

    console.log(
      "✅ Google Auth successful for user:",
      user.username,
      "Role:",
      user.role
    );

    // Generate JWT token
    const jwtToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "14d" }
    );

    res.status(200).json({
      message: "Google authentication successful",
      token: jwtToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(400).json({
      message: "Google authentication failed",
      error: error.message,
    });
  }
};
