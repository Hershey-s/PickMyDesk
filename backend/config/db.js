import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

// MongoDB connection URL based on the environment
const mongoUrl =
  process.env.NODE_ENV !== "production"
    ? "mongodb://127.0.0.1:27017/workspace"
    : process.env.MONGO_URL;

// Debugging: Log the MongoDB URL (only in non-production environments)
if (process.env.NODE_ENV !== "production") {
  console.log("MongoDB URL:", mongoUrl);
}

const connectDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoUrl);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
