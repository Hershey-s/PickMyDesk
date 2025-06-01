import express from "express";
import dotenv from "dotenv";

console.log("Testing backend startup...");

try {
  console.log("✅ Node.js is working");
  console.log("✅ Express imported");
  console.log("✅ Dotenv imported");

  dotenv.config();
  console.log("✅ Environment loaded");

  // Test environment variables
  console.log("🔍 Environment check:");
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("PORT:", process.env.PORT);
  console.log("MONGO_URL exists:", !!process.env.MONGO_URL);

  const app = express();
  const port = process.env.PORT || 5006;

  app.get("/", (req, res) => {
    res.json({ message: "Backend test successful!" });
  });

  app.listen(port, () => {
    console.log(`✅ Test server running on port ${port}`);
    console.log(`🌐 Test URL: http://localhost:${port}`);
  });
} catch (error) {
  console.error("❌ Error:", error);
}
