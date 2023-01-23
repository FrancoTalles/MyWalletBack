import express from "express";
import { cadastro } from "../Controllers/authController.js";
import { validateSchema } from "../Middlewares/validateSchema.js";
import { cadastroSchema } from "../Schemas/AuthSchema.js";

const cadastroRouter = express.Router();
cadastroRouter.post("/cadastro", validateSchema(cadastroSchema), cadastro);
export default cadastroRouter;
