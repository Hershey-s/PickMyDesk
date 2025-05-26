import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/userReg.model.js";
import Workspace from "./models/workspace.model.js";

dotenv.config();

// Sample data
const sampleUsers = [
  {
    username: "john_doe",
    email: "john@example.com",
    password: "password123"
  },
  {
    username: "jane_smith",
    email: "jane@example.com",
    password: "password123"
  }
];

const sampleWorkspaces = [
  {
    title: "Modern Co-working Space",
    listingImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500",
    location: "Connaught Place, Delhi",
    country: "India",
    description: "A modern co-working space in the heart of Delhi with high-speed internet, meeting rooms, and a vibrant startup community atmosphere.",
    priceUnit: "hour",
    tags: ["WiFi", "Meeting Rooms", "Coffee", "Metro Access"],
    price: 400, // ₹400 per hour
    currency: "INR",
    isPopular: true,
    avgRating: 4.8
  },
  {
    title: "Premium Office Suite",
    listingImage: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=500",
    location: "Bandra Kurla Complex, Mumbai",
    country: "India",
    description: "Luxurious private office with sea views in Mumbai's business district, perfect for executives and growing teams.",
    priceUnit: "day",
    tags: ["Private", "Sea View", "Executive", "AC"],
    price: 2500, // ₹2500 per day
    currency: "INR",
    isPopular: false,
    avgRating: 4.5
  },
  {
    title: "Creative Studio Space",
    listingImage: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=500",
    location: "Koregaon Park, Pune",
    country: "India",
    description: "Bright and inspiring creative studio in Pune perfect for artists, designers, and creative professionals with garden views.",
    priceUnit: "hour",
    tags: ["Creative", "Natural Light", "Garden View", "Peaceful"],
    price: 300, // ₹300 per hour
    currency: "INR",
    isPopular: true,
    avgRating: 4.7
  },
  {
    title: "Tech Hub Workspace",
    listingImage: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=500",
    location: "Electronic City, Bangalore",
    country: "India",
    description: "High-tech workspace in Bangalore's IT hub with latest equipment, perfect for startups and tech companies.",
    priceUnit: "day",
    tags: ["Tech", "Equipment", "Startup", "IT Hub"],
    price: 1800, // ₹1800 per day
    currency: "INR",
    isPopular: false,
    avgRating: 4.6
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/workspace";
    await mongoose.connect(mongoUrl);
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Workspace.deleteMany({});
    console.log("Cleared existing data");

    // Create sample users
    const createdUsers = await User.insertMany(sampleUsers);
    console.log("Created sample users:", createdUsers.length);

    // Create sample workspaces with the first user as owner
    const workspacesWithOwner = sampleWorkspaces.map(workspace => ({
      ...workspace,
      owner: createdUsers[0]._id
    }));

    const createdWorkspaces = await Workspace.insertMany(workspacesWithOwner);
    console.log("Created sample workspaces:", createdWorkspaces.length);

    console.log("✅ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
