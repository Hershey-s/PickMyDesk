import User from "../models/userReg.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const singUp = async (req, res) => {
  const { username, email, password } = req.body;
  const userExists = await User.find({ email });
  if (userExists.length > 0) {
    return res.status(400).json({ message: "User already exists" });
  }
  const newUser = new User({ username, email, password });

  const result = await newUser.save();

  console.log(result); // remove me

  const token = jwt.sign(
    { userId: result._id, email: result.email, username: result.username },
    process.env.JWT_SECRET_KEY, // Secret key
    { expiresIn: "14d" } // Token expiration
  );

  if (result) {
    res.status(201).json({
      message: "User registered successfully",
      token, // Return the JWT token to the client
    });
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

  const token = jwt.sign(
    { userId: user._id, email: user.email, username: user.username },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "14d" } // Optional: Token expiration time
  );

  // Send response with token
  res.status(200).json({
    message: "Login successful",
    token,
  });
};
