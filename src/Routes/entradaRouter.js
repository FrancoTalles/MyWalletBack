import express from "express";
import { novaEntrada } from "../Controllers/movementController.js";
import { validateSchema } from "../Middlewares/validateSchema.js";
import { entradaSchema } from "../Schemas/MovementSchema.js";

const entradaRouter = express.Router();
entradaRouter.post("/nova-entrada", validateSchema(entradaSchema), novaEntrada);
export default entradaRouter;