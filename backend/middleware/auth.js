import jwt from 'jsonwebtoken';
import User from '../models/userReg.model.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT token
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user from database to ensure they still exist and get latest role
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Middleware to check if user is admin
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: 'Admin access required. Only workspace owners can perform this action.' 
    });
  }

  next();
};

// Middleware to check if user is either admin or the resource owner
export const requireAdminOrOwner = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  // If user is admin, allow access
  if (req.user.role === 'admin') {
    return next();
  }

  // If user is the owner of the resource, allow access
  // This will be checked in the route handler using req.user._id
  next();
};

// Middleware to check if user can book workspaces (users only)
export const requireUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (req.user.role !== 'user') {
    return res.status(403).json({ 
      message: 'User access required. Only users can book workspaces.' 
    });
  }

  next();
};
