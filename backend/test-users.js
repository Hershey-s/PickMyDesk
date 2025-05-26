import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/userReg.model.js";

// Load environment variables
dotenv.config();

const testUsers = async () => {
  try {
    console.log("🔄 Testing users...");
    
    // Connect to database
    const mongoUrl = "mongodb+srv://admin:Jxoikokkvi0p3fdq@harshitha.4dxlkl5.mongodb.net/workspace?retryWrites=true&w=majority&appName=Harshitha";
    await mongoose.connect(mongoUrl);
    
    console.log("✅ Database connected");
    
    // Get all users
    const users = await User.find({});
    console.log("📊 Users in database:", users.length);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}, Username: ${user.username}`);
    });
    
    if (users.length === 0) {
      console.log("⚠️  No users found. You may need to sign up first.");
    }
    
    await mongoose.disconnect();
    console.log("✅ Test completed");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

testUsers();
