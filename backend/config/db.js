import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// MongoDB connection URL based on the environment
// Temporary fix: Use Atlas URL directly until env loading is fixed
const mongoUrl = process.env.MONGO_URL || "mongodb+srv://admin:Jxoikokkvi0p3fdq@harshitha.4dxlkl5.mongodb.net/workspace?retryWrites=true&w=majority&appName=Harshitha";

// Debugging: Log the MongoDB URL and environment variables
console.log("🔍 Database Configuration Debug:");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("MONGO_URL from env:", process.env.MONGO_URL ? "✅ Found" : "❌ Missing");
console.log("Final MongoDB URL:", mongoUrl);
console.log("URL type:", mongoUrl.includes('mongodb+srv') ? 'Atlas (Cloud)' : 'Local');

const connectDB = async () => {
  try {
    // Connection options for better reliability
    const connectionOptions = {
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
      maxPoolSize: 10,
      retryWrites: true,
    };

    // Connect to MongoDB
    await mongoose.connect(mongoUrl, connectionOptions);
    console.log("MongoDB connected successfully");

    // Test the connection with a simple query
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log("Available collections:", collections.map(c => c.name));

  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    console.error("Error type:", err.name);

    if (err.name === 'MongooseServerSelectionError') {
      console.error("🔧 Database connection troubleshooting:");
      console.error("1. Check your internet connection");
      console.error("2. Verify MongoDB Atlas cluster is running");
      console.error("3. Check IP whitelist in MongoDB Atlas (add 0.0.0.0/0 for testing)");
      console.error("4. Verify database credentials in .env file");
    }

    // Exit the process if database connection fails
    process.exit(1);
  }
};

export default connectDB;
