import express from "express";
import multer from "multer";
import {
  createWorkspace,
  getAllWorkspaces,
  getWorkspaceById,
  getWorkspacesByOwner,
  updateWorkspace,
  deleteWorkspace,
  updateAllWorkspaceCapacities,
} from "../controllers/workspace.controllers.js";
import verifyToken from "../middlewares/authMiddleware.js"; // Import the JWT verification middleware
import {
  authenticateToken,
  requireAdmin,
} from "../middlewares/authMiddleware.js"; // Import role-based auth
import WrapAsync from "../utils/WrapAsync.js";
import { validateWorkspace } from "../utils/validation.js";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        "-" +
        uniqueSuffix +
        "." +
        file.originalname.split(".").pop()
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file type
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

const WorkSpaceRouter = express.Router();

// Routes for all workspaces
WorkSpaceRouter.route("/workspaces")
  .post(
    authenticateToken,
    requireAdmin,
    upload.single("listingImage"),
    WrapAsync(createWorkspace)
  )
  .get(WrapAsync(getAllWorkspaces));

// Route for getting workspaces by owner (Admin only)
WorkSpaceRouter.route("/workspaces/owner/:ownerId").get(
  authenticateToken,
  requireAdmin,
  WrapAsync(getWorkspacesByOwner)
);

// Route for individual workspace
WorkSpaceRouter.route("/workspaces/:id")
  .get(WrapAsync(getWorkspaceById)) // Public access for viewing
  .put(
    authenticateToken,
    requireAdmin,
    validateWorkspace,
    WrapAsync(updateWorkspace)
  ) // Admin only
  .delete(authenticateToken, requireAdmin, WrapAsync(deleteWorkspace)); // Admin only

// Utility route to update all workspace capacities (Admin only)
WorkSpaceRouter.route("/workspaces/admin/update-capacities").post(
  authenticateToken,
  requireAdmin,
  WrapAsync(updateAllWorkspaceCapacities)
);

export default WorkSpaceRouter;
