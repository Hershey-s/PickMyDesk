import User from "../models/userReg.model.js";
import bcrypt from "bcryptjs";

// Function to handle user registration
export const singUp = async (req, res) => {
  const { email, password } = req.body;
  const userExists = await User.find({ email });
  if (userExists.length > 0) {
    return res.status(400).json({ message: "User already exists" });
  }
  const newUser = new User({ email, password });

  const result = await newUser.save();

  console.log(result);

  if (result) {
    return res.status(201).json({ message: "User registered successfully" });
  } else {
    throw new Error("User registration failed");
  }
};

export const logIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "user not found" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid password" });
  }

  res.status(200).json({
    message: "Login successful",
  });
};
