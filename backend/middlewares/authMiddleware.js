import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// JWT Secret - ensure consistency
const JWT_SECRET =
  process.env.JWT_SECRET_KEY ||
  "workspacehub_super_secret_key_for_development_2024";

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({
        message: "Access Denied. No token provided.",
        debug: "No Authorization header found",
      });
    }

    // Extract token from "Bearer <token>" format
    let token;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    } else {
      token = authHeader;
    }

    if (!token || token.trim() === "") {
      return res.status(401).json({
        message: "Access Denied. Invalid token format.",
        debug: "Token is empty after extraction",
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Validate decoded token structure
    if (!decoded.userId) {
      return res.status(401).json({
        message: "Invalid token structure",
        debug: "Token missing userId",
      });
    }

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      username: decoded.username,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error("JWT Verification Error:", {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });

    // Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token has expired. Please login again.",
        error: "TOKEN_EXPIRED",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token. Please login again.",
        error: "INVALID_TOKEN",
      });
    }

    if (error.name === "NotBeforeError") {
      return res.status(401).json({
        message: "Token not active yet.",
        error: "TOKEN_NOT_ACTIVE",
      });
    }

    // Generic error
    return res.status(401).json({
      message: "Token verification failed. Please login again.",
      error: "VERIFICATION_FAILED",
    });
  }
};

// Alias for verifyToken to match import expectations
export const authenticateToken = verifyToken;

// Middleware to require admin role
export const requireAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
        error: "NO_USER_INFO",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin privileges required.",
        error: "INSUFFICIENT_PRIVILEGES",
        userRole: req.user.role,
      });
    }

    next();
  } catch (error) {
    console.error("Admin authorization error:", error);
    return res.status(500).json({
      message: "Authorization check failed",
      error: "AUTHORIZATION_ERROR",
    });
  }
};

// Middleware to require user role
export const requireUser = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
        error: "NO_USER_INFO",
      });
    }

    if (req.user.role !== "user") {
      return res.status(403).json({
        message: "Access denied. User privileges required.",
        error: "INSUFFICIENT_PRIVILEGES",
        userRole: req.user.role,
      });
    }

    next();
  } catch (error) {
    console.error("User authorization error:", error);
    return res.status(500).json({
      message: "Authorization check failed",
      error: "AUTHORIZATION_ERROR",
    });
  }
};

export default verifyToken;
