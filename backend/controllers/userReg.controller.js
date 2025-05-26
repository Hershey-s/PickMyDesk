import User from "../models/userReg.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// JWT Secret - ensure consistency across the app
const JWT_SECRET = process.env.JWT_SECRET_KEY || "workspacehub_super_secret_key_for_development_2024";

export const singUp = async (req, res) => {
  const { username, email, password } = req.body;
  const userExists = await User.find({ email });
  if (userExists.length > 0) {
    return res.status(400).json({ message: "User already exists" });
  }
  const newUser = new User({ username, email, password });

  const result = await newUser.save();

  const token = jwt.sign(
    { userId: result._id, email: result.email, username: result.username },
    JWT_SECRET,
    { expiresIn: "14d" }
  );

  if (result) {
    res.status(201).json({
      message: "User registered successfully",
      token, // Return the JWT token to the client
    });
  } else {
    throw new Error("User registration failed");
  }
};

export const logIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "user not found" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email, username: user.username },
    JWT_SECRET,
    { expiresIn: "14d" }
  );

  // Send response with token
  res.status(200).json({
    message: "Login successful",
    token,
  });
};

export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

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
      // Create new user if doesn't exist
      user = new User({
        username: name,
        email: email,
        password: 'google_oauth_user', // Placeholder password for OAuth users
        profilePicture: picture,
      });
      await user.save();
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email, username: user.username },
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
