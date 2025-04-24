import connectDB from "./config/db.js";

connectDB();

import express from "express";
import cors from "cors";
import userRouter from "./router/userReg.router.js";

const port = 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", userRouter);

app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
