import Workspace from "../models/workspace.model.js";
import { cloudinary } from "../cloudConfig.js";

// Create a new workspace (Only owners can create workspaces)
export const createWorkspace = async (req, res) => {
  try {
    console.log("🚀 Creating workspace...");
    console.log("📝 Request body:", req.body);
    console.log("👤 User info:", req.user);
    console.log("📁 File info:", req.file ? req.file.filename : "No file");

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

    // Provide defaults for missing fields
    const workspaceTitle = title || "Untitled Workspace";
    const workspaceLocation = location || "Unknown Location";
    const workspaceDescription = description || "No description provided";
    const workspacePrice = price ? Number(price) : 100;
    const workspaceCountry = country || "India";

    console.log("📝 Processed fields:");
    console.log("Title:", workspaceTitle);
    console.log("Location:", workspaceLocation);
    console.log("Description:", workspaceDescription);
    console.log("Price:", workspacePrice);
    console.log("Country:", workspaceCountry);

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
          { format: "auto" },
        ],
      });

      imageUrl = result.secure_url;
      console.log("✅ Image uploaded successfully:", imageUrl);
    }

    // Parse tags if it's a string (from FormData)
    let parsedTags = tags;
    if (typeof tags === "string") {
      try {
        parsedTags = JSON.parse(tags);
      } catch (e) {
        parsedTags = [];
      }
    }

    const newWorkspace = new Workspace({
      owner: req.user.userId,
      title: workspaceTitle,
      location: workspaceLocation,
      description: workspaceDescription,
      price: workspacePrice,
      listingImage: imageUrl,
      country: workspaceCountry,
      currency: currency || "INR",
      priceUnit: priceUnit || "hour",
      tags: parsedTags || [],
      isPopular: isPopular === "true" || isPopular === true,
      avgRating: 0,
      maxCapacity: 20, // Default to 20 people
    });

    const savedWorkspace = await newWorkspace.save();
    console.log("✅ Workspace created successfully:", savedWorkspace._id);

    res.status(201).json({
      message: "Workspace created successfully!",
      workspace: savedWorkspace,
    });
  } catch (error) {
    console.error("❌ Error creating workspace:", error);
    res.status(500).json({
      message: "Failed to create workspace",
      error: error.message,
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

// Update all workspace capacities to 20 (admin utility)
export const updateAllWorkspaceCapacities = async (req, res) => {
  try {
    console.log("🔄 Updating all workspace capacities to 20...");

    const result = await Workspace.updateMany(
      { maxCapacity: { $lt: 20 } },
      { $set: { maxCapacity: 20 } }
    );

    console.log(`✅ Updated ${result.modifiedCount} workspaces`);

    // Get sample of updated workspaces
    const sampleWorkspaces = await Workspace.find(
      {},
      "title maxCapacity"
    ).limit(5);

    res.status(200).json({
      message: "Workspace capacities updated successfully",
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount,
      sampleWorkspaces: sampleWorkspaces.map((ws) => ({
        title: ws.title,
        maxCapacity: ws.maxCapacity,
      })),
    });
  } catch (error) {
    console.error("❌ Error updating workspace capacities:", error);
    res.status(500).json({
      message: "Failed to update workspace capacities",
      error: error.message,
    });
  }
};
