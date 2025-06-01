console.log("Starting test server...");

import express from "express";
import cors from "cors";

const app = express();
const port = 5003;

console.log("Setting up middleware...");

app.use(cors());
app.use(express.json());

console.log("Setting up routes...");

app.get("/", (req, res) => {
  console.log("Root route hit");
  res.json({ message: "Test server is working!" });
});

app.post("/signup", (req, res) => {
  console.log("Signup route hit with body:", req.body);
  res.json({ 
    message: "Test signup endpoint", 
    received: req.body 
  });
});

console.log("Starting server on port:", port);

app.listen(port, () => {
  console.log(`✅ Test server running on http://localhost:${port}`);
});
