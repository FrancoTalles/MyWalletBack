import express from "express";
import { home } from "../Controllers/userController.js"

const userRouter = express.Router();
userRouter.get("/home/:userId", home);
export default userRouter;