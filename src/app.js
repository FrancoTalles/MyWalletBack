// Importações
import express from "express";
import cors from "cors";
import loginRouter from "./Routes/loginRouter.js";
import cadastroRouter from "./Routes/cadastroRouter.js"
import userRouter from "./Routes/userRouter.js"
import entradaRouter from "./Routes/entradaRouter.js"
import saidaRouter from "./Routes/saidaRouter.js";

// Iniciando Configurações

const app = express();
app.use(cors());
app.use(express.json());

//Rotas

app.use([loginRouter, cadastroRouter, userRouter, entradaRouter, saidaRouter]);

// Port

const PORT = 5000;

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
