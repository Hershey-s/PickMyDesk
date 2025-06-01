import Workspace from "../models/workspace.model.js";
import Booking from "../models/booking.model.js";
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
  try {
    const { id } = req.params;
    console.log("🗑️ Delete request for workspace:", id);
    console.log("👤 User info:", req.user);

    const workspace = await Workspace.findById(id);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    console.log("🏢 Workspace owner:", workspace.owner);
    console.log("👤 Current user:", req.user.userId);
    console.log("🔑 User role:", req.user.role);

    // Allow deletion if user is admin OR if user owns the workspace
    const isOwner = workspace.owner.toString() === req.user.userId;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You don't have permission to delete this workspace",
      });
    }

    await Workspace.findByIdAndDelete(id);
    console.log("✅ Workspace deleted successfully");

    res.status(200).json({
      message: "Workspace deleted successfully",
      deletedBy: isAdmin ? "admin" : "owner",
    });
  } catch (error) {
    console.error("❌ Error deleting workspace:", error);
    res.status(500).json({
      message: "Failed to delete workspace",
      error: error.message,
    });
  }
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

// AI/ML Recommendation Engine
export const getSmartRecommendations = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("🤖 Generating smart recommendations for user:", userId);

    // Get user's booking history
    const userBookings = await Booking.find({ user: userId }).populate(
      "workspace"
    );
    console.log("📊 User booking history:", userBookings.length, "bookings");

    // Analyze user preferences
    const preferences = analyzeUserPreferences(userBookings);
    console.log("🎯 User preferences:", preferences);

    // Get all available workspaces
    const allWorkspaces = await Workspace.find({});

    // Generate recommendations based on preferences
    const recommendations = generateRecommendations(allWorkspaces, preferences);
    console.log("✨ Generated recommendations:", recommendations.length);

    res.json({
      success: true,
      recommendations: recommendations.slice(0, 6), // Top 6 recommendations
      userPreferences: preferences,
      totalAnalyzed: allWorkspaces.length,
    });
  } catch (error) {
    console.error("❌ Error generating recommendations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate recommendations",
      error: error.message,
    });
  }
};

// Analyze user booking patterns to extract preferences
const analyzeUserPreferences = (bookings) => {
  if (!bookings || bookings.length === 0) {
    // Default preferences for new users
    return {
      preferredPriceRange: { min: 0, max: 1000 },
      preferredLocations: [],
      preferredAmenities: [],
      avgGuestCount: 1,
      preferredTimeSlots: [],
      bookingFrequency: "new_user",
    };
  }

  const preferences = {
    preferredPriceRange: { min: 0, max: 5000 },
    preferredLocations: [],
    preferredAmenities: [],
    avgGuestCount: 1,
    preferredTimeSlots: [],
    bookingFrequency: "regular",
  };

  // Analyze price preferences
  const prices = bookings
    .map((b) => b.workspace?.price || 0)
    .filter((p) => p > 0);
  if (prices.length > 0) {
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    preferences.preferredPriceRange = {
      min: Math.max(0, avgPrice * 0.7),
      max: avgPrice * 1.3,
    };
  }

  // Analyze location preferences
  const locations = bookings.map((b) => b.workspace?.location).filter(Boolean);
  const locationCounts = {};
  locations.forEach((loc) => {
    locationCounts[loc] = (locationCounts[loc] || 0) + 1;
  });
  preferences.preferredLocations = Object.keys(locationCounts)
    .sort((a, b) => locationCounts[b] - locationCounts[a])
    .slice(0, 3);

  // Analyze guest count preferences
  const guestCounts = bookings.map((b) => b.guestCount || 1);
  if (guestCounts.length > 0) {
    preferences.avgGuestCount = Math.round(
      guestCounts.reduce((a, b) => a + b, 0) / guestCounts.length
    );
  }

  // Analyze amenity preferences (from workspace tags)
  const allTags = bookings.flatMap((b) => b.workspace?.tags || []);
  const tagCounts = {};
  allTags.forEach((tag) => {
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  });
  preferences.preferredAmenities = Object.keys(tagCounts)
    .sort((a, b) => tagCounts[b] - tagCounts[a])
    .slice(0, 5);

  return preferences;
};

// Generate workspace recommendations based on user preferences
const generateRecommendations = (workspaces, preferences) => {
  return workspaces
    .map((workspace) => {
      let score = 0;
      const reasons = [];

      // Price matching (30% weight)
      if (
        workspace.price >= preferences.preferredPriceRange.min &&
        workspace.price <= preferences.preferredPriceRange.max
      ) {
        score += 30;
        reasons.push("Price matches your budget");
      } else if (workspace.price < preferences.preferredPriceRange.min) {
        score += 20;
        reasons.push("Great value for money");
      }

      // Location matching (25% weight)
      if (preferences.preferredLocations.includes(workspace.location)) {
        score += 25;
        reasons.push("In your preferred location");
      }

      // Amenity matching (20% weight)
      const matchingAmenities =
        workspace.tags?.filter((tag) =>
          preferences.preferredAmenities.includes(tag)
        ) || [];
      if (matchingAmenities.length > 0) {
        score +=
          (matchingAmenities.length / preferences.preferredAmenities.length) *
          20;
        reasons.push(
          `Has ${matchingAmenities.length} of your preferred amenities`
        );
      }

      // Capacity matching (15% weight)
      if (workspace.maxCapacity >= preferences.avgGuestCount) {
        score += 15;
        if (workspace.maxCapacity === preferences.avgGuestCount) {
          reasons.push("Perfect capacity for your group size");
        } else {
          reasons.push("Suitable for your group size");
        }
      }

      // Popularity bonus (10% weight)
      if (workspace.isPopular) {
        score += 10;
        reasons.push("Popular choice among users");
      }

      // Rating bonus
      if (workspace.avgRating >= 4) {
        score += 5;
        reasons.push("Highly rated workspace");
      }

      return {
        ...workspace.toObject(),
        recommendationScore: Math.round(score),
        recommendationReasons: reasons,
        matchPercentage: Math.min(100, Math.round(score)),
      };
    })
    .filter((w) => w.recommendationScore > 20) // Only show workspaces with decent scores
    .sort((a, b) => b.recommendationScore - a.recommendationScore);
};

// All functions are exported individually above with 'export const'
