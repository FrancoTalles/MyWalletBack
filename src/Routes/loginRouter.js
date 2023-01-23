import express from "express";
import { login } from "../Controllers/authController.js";
import { validateSchema } from "../Middlewares/validateSchema.js";
import { userSchema } from "../Schemas/AuthSchema.js";

const loginRouter = express.Router();
loginRouter.post("/login", validateSchema(userSchema), login);
export default loginRouter;