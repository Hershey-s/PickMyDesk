import Workspace from "../models/workspace.model.js";
import { cloudinary } from "../cloudConfig.js";

// Create a new workspace (Only owners can create workspaces)
export const createWorkspaces = async (req, res) => {
  const {
    title,
    location,
    description,
    price,
    country,
    listingImage,
    priceUnit,
    tags,
    isPopular,
  } = req.body;

  const newWorkspace = new Workspace({
    owner: req.user.userId,
    title,
    location,
    description,
    price,
    listingImage,
    country,
    priceUnit: priceUnit || "hour",
    tags: tags || [],
    isPopular: isPopular || false,
    avgRating: 0,
  });

  const savedWorkspace = await newWorkspace.save();
  res.status(201).json({ message: "Workspace created successfully!" });
};

// Get all workspaces
export const getAllWorkspaces = async (req, res) => {
  const workspaces = await Workspace.find();
  res.status(200).json(workspaces);
};

// Get a single workspace by ID
export const getWorkspaceById = async (req, res) => {
  const { id } = req.params;
  const workspace = await Workspace.findById(id);

  if (!workspace) {
    return res.status(404).json({ message: "Workspace not found" });
  }

  res.status(200).json(workspace);
};

// Get workspaces by owner ID
export const getWorkspacesByOwner = async (req, res) => {
  const { ownerId } = req.params;

  const workspaces = await Workspace.find({ owner: ownerId });

  res.status(200).json(workspaces);
};

// Update a workspace
export const updateWorkspace = async (req, res) => {
  const { id } = req.params;

  const workspace = await Workspace.findById(id);

  if (!workspace) {
    return res.status(404).json({ message: "Workspace not found" });
  }

  if (workspace.owner.toString() !== req.user.userId) {
    return res.status(403).json({
      message: "You don't have permission to update this workspace",
    });
  }

  const updatedWorkspace = await Workspace.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    message: "Workspace updated successfully",
    workspace: updatedWorkspace,
  });
};

// Delete a workspace
export const deleteWorkspace = async (req, res) => {
  const { id } = req.params;

  const workspace = await Workspace.findById(id);

  if (!workspace) {
    return res.status(404).json({ message: "Workspace not found" });
  }

  if (workspace.owner.toString() !== req.user.userId) {
    return res.status(403).json({
      message: "You don't have permission to delete this workspace",
    });
  }

  await Workspace.findByIdAndDelete(id);

  res.status(200).json({ message: "Workspace deleted successfully" });
};
