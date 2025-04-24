import express from "express";
import { singUp, logIn } from "../controllers/userReg.controller.js";
import WrapAsync from "../utils/WrapAsync.js";

const userRouter = express.Router();

userRouter.post("/signup", WrapAsync(singUp));

userRouter.post("/login", WrapAsync(logIn));

export default userRouter;
