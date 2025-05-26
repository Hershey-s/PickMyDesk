import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const testDatabaseConnection = async () => {
  try {
    console.log("🔄 Testing database connection...");
    console.log("MongoDB URL:", process.env.MONGO_URL ? "✅ Found" : "❌ Missing");

    // Set connection timeout to 10 seconds
    const connectionOptions = {
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
      maxPoolSize: 10,
    };

    await mongoose.connect(process.env.MONGO_URL, connectionOptions);

    console.log("✅ Database connected successfully!");

    // Test a simple query
    console.log("🔄 Testing workspace collection...");
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log("📊 Available collections:", collections.map(c => c.name));

    // Try to count workspaces
    const workspaceCount = await db.collection('workspaces').countDocuments();
    console.log("🏢 Workspace count:", workspaceCount);

    // If no workspaces, let's check if we need to seed data
    if (workspaceCount === 0) {
      console.log("⚠️  No workspaces found. Database might need seeding.");
    }

    await mongoose.disconnect();
    console.log("✅ Database test completed successfully!");

  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error("Error type:", error.name);
    console.error("Error message:", error.message);

    if (error.name === 'MongooseServerSelectionError') {
      console.error("🔧 Possible solutions:");
      console.error("1. Check your internet connection");
      console.error("2. Verify MongoDB Atlas cluster is running");
      console.error("3. Check IP whitelist in MongoDB Atlas");
      console.error("4. Verify database credentials");
    }

    process.exit(1);
  }
};

testDatabaseConnection();
