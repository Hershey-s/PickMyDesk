import mongoose from "mongoose";
import dotenv from "dotenv";
import Workspace from "./models/workspace.model.js";
import User from "./models/userReg.model.js";

dotenv.config();

// Sample workspaces with coordinates for major Indian cities
const sampleWorkspacesWithCoordinates = [
  {
    title: "Modern Co-working Space",
    listingImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500",
    location: "Connaught Place, Delhi",
    country: "India",
    city: "Delhi",
    state: "Delhi",
    fullAddress: "Connaught Place, New Delhi, Delhi 110001, India",
    coordinates: {
      latitude: 28.6315,
      longitude: 77.2167
    },
    description: "A modern co-working space in the heart of Delhi with high-speed internet, meeting rooms, and a vibrant startup community atmosphere.",
    priceUnit: "hour",
    tags: ["WiFi", "Meeting Rooms", "Coffee", "Metro Access"],
    price: 400,
    currency: "INR",
    isPopular: true,
    avgRating: 4.8
  },
  {
    title: "Premium Office Suite",
    listingImage: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=500",
    location: "Bandra Kurla Complex, Mumbai",
    country: "India",
    city: "Mumbai",
    state: "Maharashtra",
    fullAddress: "Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra 400051, India",
    coordinates: {
      latitude: 19.0596,
      longitude: 72.8656
    },
    description: "Luxurious private office with sea views in Mumbai's business district, perfect for executives and growing teams.",
    priceUnit: "day",
    tags: ["Private", "Sea View", "Executive", "AC"],
    price: 2500,
    currency: "INR",
    isPopular: false,
    avgRating: 4.5
  },
  {
    title: "Creative Studio Space",
    listingImage: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=500",
    location: "Koregaon Park, Pune",
    country: "India",
    city: "Pune",
    state: "Maharashtra",
    fullAddress: "Koregaon Park, Pune, Maharashtra 411001, India",
    coordinates: {
      latitude: 18.5362,
      longitude: 73.8958
    },
    description: "Bright and inspiring creative studio in Pune perfect for artists, designers, and creative professionals with garden views.",
    priceUnit: "hour",
    tags: ["Creative", "Natural Light", "Garden View", "Peaceful"],
    price: 300,
    currency: "INR",
    isPopular: true,
    avgRating: 4.7
  },
  {
    title: "Tech Hub Workspace",
    listingImage: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=500",
    location: "Electronic City, Bangalore",
    country: "India",
    city: "Bangalore",
    state: "Karnataka",
    fullAddress: "Electronic City, Bengaluru, Karnataka 560100, India",
    coordinates: {
      latitude: 12.8456,
      longitude: 77.6603
    },
    description: "High-tech workspace in Bangalore's IT hub with latest equipment, perfect for startups and tech companies.",
    priceUnit: "day",
    tags: ["Tech", "Equipment", "Startup", "IT Hub"],
    price: 1800,
    currency: "INR",
    isPopular: false,
    avgRating: 4.6
  },
  {
    title: "Startup Incubator",
    listingImage: "https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?w=500",
    location: "Hitech City, Hyderabad",
    country: "India",
    city: "Hyderabad",
    state: "Telangana",
    fullAddress: "HITEC City, Hyderabad, Telangana 500081, India",
    coordinates: {
      latitude: 17.4435,
      longitude: 78.3772
    },
    description: "Dynamic startup incubator in Hyderabad's tech district with mentorship programs and networking events.",
    priceUnit: "hour",
    tags: ["Startup", "Mentorship", "Networking", "Events"],
    price: 350,
    currency: "INR",
    isPopular: true,
    avgRating: 4.9
  },
  {
    title: "Business Center",
    listingImage: "https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?w=500",
    location: "Anna Salai, Chennai",
    country: "India",
    city: "Chennai",
    state: "Tamil Nadu",
    fullAddress: "Anna Salai, Chennai, Tamil Nadu 600002, India",
    coordinates: {
      latitude: 13.0569,
      longitude: 80.2497
    },
    description: "Professional business center in Chennai's commercial hub with conference facilities and business services.",
    priceUnit: "day",
    tags: ["Business", "Conference", "Professional", "Services"],
    price: 2000,
    currency: "INR",
    isPopular: false,
    avgRating: 4.4
  },
  {
    title: "Freelancer Hub",
    listingImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500",
    location: "Salt Lake, Kolkata",
    country: "India",
    city: "Kolkata",
    state: "West Bengal",
    fullAddress: "Salt Lake City, Kolkata, West Bengal 700064, India",
    coordinates: {
      latitude: 22.5726,
      longitude: 88.3639
    },
    description: "Affordable workspace for freelancers and remote workers in Kolkata's IT sector with flexible timings.",
    priceUnit: "hour",
    tags: ["Freelancer", "Affordable", "Flexible", "IT Sector"],
    price: 250,
    currency: "INR",
    isPopular: true,
    avgRating: 4.3
  },
  {
    title: "Design Studio",
    listingImage: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=500",
    location: "Jayanagar, Mysuru",
    country: "India",
    city: "Mysuru",
    state: "Karnataka",
    fullAddress: "Jayanagar, Mysuru, Karnataka 570014, India",
    coordinates: {
      latitude: 12.2958,
      longitude: 76.6394
    },
    description: "Peaceful design studio in the cultural city of Mysuru, perfect for creative professionals and artists.",
    priceUnit: "hour",
    tags: ["Design", "Creative", "Peaceful", "Cultural"],
    price: 280,
    currency: "INR",
    isPopular: false,
    avgRating: 4.6
  }
];

async function addSampleWorkspaces() {
  try {
    // Connect to MongoDB
    const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/workspace";
    await mongoose.connect(mongoUrl);
    console.log("Connected to MongoDB");

    // Find the first user to be the owner
    const firstUser = await User.findOne();
    if (!firstUser) {
      console.log("No users found. Please create a user first.");
      process.exit(1);
    }

    console.log("Using user as owner:", firstUser.username);

    // Clear existing workspaces
    await Workspace.deleteMany({});
    console.log("Cleared existing workspaces");

    // Add owner to each workspace
    const workspacesWithOwner = sampleWorkspacesWithCoordinates.map(workspace => ({
      ...workspace,
      owner: firstUser._id
    }));

    // Insert new workspaces
    const createdWorkspaces = await Workspace.insertMany(workspacesWithOwner);
    console.log(`✅ Created ${createdWorkspaces.length} sample workspaces with coordinates`);

    // Log created workspaces
    createdWorkspaces.forEach(workspace => {
      console.log(`📍 ${workspace.title} - ${workspace.city} (${workspace.coordinates.latitude}, ${workspace.coordinates.longitude})`);
    });

    console.log("✅ Sample workspaces added successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error adding sample workspaces:", error);
    process.exit(1);
  }
}

addSampleWorkspaces();
