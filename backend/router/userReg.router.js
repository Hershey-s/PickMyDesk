import express from "express";
import { singUp, logIn } from "../controllers/userReg.controller.js";
import { validateUser } from "../utils/validation.js";
import WrapAsync from "../utils/WrapAsync.js";

const userRouter = express.Router();

userRouter.post("/signup", validateUser, WrapAsync(singUp));

userRouter.post("/login", WrapAsync(logIn));

export default userRouter;
