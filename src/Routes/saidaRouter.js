import express from "express";
import { novaSaida } from "../Controllers/movementController.js";
import { validateSchema } from "../Middlewares/validateSchema.js";
import { saidaSchema } from "../Schemas/MovementSchema.js";

const saidaRouter = express.Router();
saidaRouter.post("/nova-saida", validateSchema(saidaSchema), novaSaida);
export default saidaRouter;