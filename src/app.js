// Importações
import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import joi from "joi";
import bcrypt from "bcrypt";

// Iniciando Configurações

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// MongoClient

const mongoClient = new MongoClient(process.env.DATABASE_URL);
let db;

//Conectando ao Mongo

try {
  await mongoClient.connect();
  console.log("MongoDB Connected!");
} catch (error) {
  res.status(500).send(error.message);
}

db = mongoClient.db();

//Rotas

app.post("/login", async (req, res) => {
  const user = req.body;

  const userSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  });

  const validation = userSchema.validate(user, { abortEarly: false });

  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }

  res.status(200).send("Rota Login funcionando");
});

app.post("/cadastro", async (req, res) => {
  const userCadastro = req.body;

  const cadastroSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(3).max(15).required().label("Password"),
    confirmPassword: joi
      .any()
      .equal(joi.ref("password"))
      .required()
      .label("Confirma password")
      .options({ messages: { "any.only": "{{#label}} does not match" } }),
  });

  try {
    const validation = cadastroSchema.validate(userCadastro, {
      abortEarly: false,
    });

    if (validation.error) {
      const errors = validation.error.details.map((detail) => detail.message);
      return res.status(422).send(errors);
    }

    const resp = await db.collection("users").findOne({
      email: userCadastro.email
    });

    if (resp) {
      return res.status(400).send("Email já cadastrado");
    }

    const senhaCriptografada = bcrypt.hashSync(userCadastro.password, 10);

    delete userCadastro.confirmPassword;

    await db.collection("users").insertOne({
      ...userCadastro, password: senhaCriptografada
    });

    return res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Port

const PORT = 5000;

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
