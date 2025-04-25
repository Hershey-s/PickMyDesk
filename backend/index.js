import connectDB from "./config/db.js";
connectDB();

import express from "express";
import cors from "cors";

import userRouter from "./router/userReg.router.js";
import WorksSpaceRouter from "./router/workspace.router.js";

const port = 5000;
const app = express();

const environment = process.env.NODE_ENV || "development";

const corsOptions = {
  origin:
    environment !== "production"
      ? "http://localhost:5173"
      : "https://works-space-hub.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", userRouter);
app.use("/", WorksSpaceRouter);

app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
