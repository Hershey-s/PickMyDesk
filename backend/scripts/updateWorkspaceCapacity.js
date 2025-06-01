import mongoose from "mongoose";
import Workspace from "../models/workspace.model.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const updateWorkspaceCapacity = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    console.log(
      "📍 MongoDB URL:",
      process.env.MONGO_URL ? "Found" : "Not found"
    );
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected to MongoDB");

    console.log("🔄 Updating workspace capacities...");

    // Update all workspaces that have maxCapacity less than 20
    const result = await Workspace.updateMany(
      { maxCapacity: { $lt: 20 } },
      { $set: { maxCapacity: 20 } }
    );

    console.log(`✅ Updated ${result.modifiedCount} workspaces`);
    console.log(`📊 Matched ${result.matchedCount} workspaces`);

    // Verify the update
    const workspaces = await Workspace.find({}, "title maxCapacity").limit(10);
    console.log("📋 Sample workspaces after update:");
    workspaces.forEach((ws) => {
      console.log(`  - ${ws.title}: maxCapacity = ${ws.maxCapacity}`);
    });

    console.log("🎉 Update completed successfully!");
  } catch (error) {
    console.error("❌ Error updating workspace capacity:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  }
};

// Run the update
updateWorkspaceCapacity();
