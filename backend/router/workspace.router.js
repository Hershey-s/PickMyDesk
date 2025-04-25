import express from "express";
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

const WorkSpaceRouter = express.Router();

// Routes for all workspaces
WorkSpaceRouter.route("/workspaces")
  .post(verifyToken, validateWorkspace, WrapAsync(createWorkspaces))
  .get(WrapAsync(getAllWorkspaces));

// Route for getting workspaces by owner
WorkSpaceRouter.route("/workspaces/owner/:ownerId").get(
  WrapAsync(getWorkspacesByOwner)
);

// Routes for specific workspace by ID
WorkSpaceRouter.route("/workspaces/:id")
  .get(WrapAsync(getWorkspaceById))
  .put(validateWorkspace, verifyToken, WrapAsync(updateWorkspace))
  .delete(verifyToken, WrapAsync(deleteWorkspace));

export default WorkSpaceRouter;
