import mongoose from "mongoose";
const mongoUrl = "mongodb://127.0.0.1:27017/workspace"; // Replace with your actual MongoDB URL

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
