import Workspace from "../models/workspace.model.js";
import { cloudinary } from "../cloudConfig.js";

// Create a new workspace (Only owners can create workspaces)
export const createWorkspaces = async (req, res) => {
  try {
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
      currency,
    } = req.body;

    let imageUrl = listingImage;

    // Handle file upload if a file was provided
    if (req.file) {
      console.log("📁 Uploading file to Cloudinary:", req.file.originalname);

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "workspaces",
        transformation: [
          { width: 800, height: 600, crop: "fill" },
          { quality: "auto" },
          { format: "auto" }
        ]
      });

      imageUrl = result.secure_url;
      console.log("✅ Image uploaded successfully:", imageUrl);
    }

    // Parse tags if it's a string (from FormData)
    let parsedTags = tags;
    if (typeof tags === 'string') {
      try {
        parsedTags = JSON.parse(tags);
      } catch (e) {
        parsedTags = [];
      }
    }

    const newWorkspace = new Workspace({
      owner: req.user.userId,
      title,
      location,
      description,
      price: Number(price),
      listingImage: imageUrl,
      country,
      currency: currency || "INR",
      priceUnit: priceUnit || "hour",
      tags: parsedTags || [],
      isPopular: isPopular === 'true' || isPopular === true,
      avgRating: 0,
    });

    const savedWorkspace = await newWorkspace.save();
    console.log("✅ Workspace created successfully:", savedWorkspace._id);

    res.status(201).json({
      message: "Workspace created successfully!",
      workspace: savedWorkspace
    });
  } catch (error) {
    console.error("❌ Error creating workspace:", error);
    res.status(500).json({
      message: "Failed to create workspace",
      error: error.message
    });
  }
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
