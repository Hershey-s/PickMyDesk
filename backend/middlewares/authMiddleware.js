import jwt from "jsonwebtoken";

// Make sure to access environment variables correctly
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });
  }

  try {
    // Ensure token starts with 'Bearer ' and slice it off to get the token
    const actualToken = token.startsWith("Bearer ") ? token.slice(7) : token;
    // Use process.env to access the JWT_SECRET_KEY from the environment
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET_KEY); // Corrected here
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default verifyToken;
