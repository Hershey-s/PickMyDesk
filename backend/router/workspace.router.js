import express from "express";
import multer from "multer";
import {
  createWorkspaces,
  getAllWorkspaces,
  getWorkspaceById,
  getWorkspacesByOwner,
  updateWorkspace,
  deleteWorkspace,
} from "../controllers/workspace.controllers.js";
import verifyToken from "../middlewares/authMiddleware.js"; // Import the JWT verification middleware
import WrapAsync from "../utils/WrapAsync.js";
import { validateWorkspace } from "../utils/validation.js";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop())
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

const WorkSpaceRouter = express.Router();

// Routes for all workspaces
WorkSpaceRouter.route("/workspaces")
  .post(verifyToken, upload.single('listingImage'), validateWorkspace, WrapAsync(createWorkspaces))
  .get(WrapAsync(getAllWorkspaces));

// Route for getting workspaces by owner
WorkSpaceRouter.route("/workspaces/owner/:ownerId").get(
  WrapAsync(getWorkspacesByOwner)
);

// Route for individual workspace
WorkSpaceRouter.route("/workspaces/:id")
  .get(WrapAsync(getWorkspaceById))
  .put(verifyToken, validateWorkspace, WrapAsync(updateWorkspace))
  .delete(verifyToken, WrapAsync(deleteWorkspace));

export default WorkSpaceRouter;
