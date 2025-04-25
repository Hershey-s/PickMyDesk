import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const mongoUrl =
  process.env.NODE_ENV !== "production"
    ? "mongodb://127.0.0.1:27017/workspace"
    : process.env.MONGO_URL;

// MongoDB connection function
const connectDB = async () => {
  try {
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    process.exit(1);
  }
};

export default connectDB;
