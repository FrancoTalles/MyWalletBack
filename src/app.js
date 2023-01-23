// Importações
import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

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

  const respUser = await db.collection("users").findOne({
    email: user.email,
  });

  if (respUser && bcrypt.compareSync(user.password, respUser.password)) {
    const token = uuid();

    await db.collection("sessions").insertOne({
      userId: respUser._id,
      token: token,
    });

    return res.status(200).send({
      userId: respUser._id,
      name: respUser.name,
      token: token,
    });
  } else {
    return res.status(404).send("Email ou Senha Incorretos");
  }
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
      email: userCadastro.email,
    });

    if (resp) {
      return res.status(400).send("Email já cadastrado");
    }

    const senhaCriptografada = bcrypt.hashSync(userCadastro.password, 10);

    delete userCadastro.confirmPassword;

    await db.collection("users").insertOne({
      ...userCadastro,
      password: senhaCriptografada,
    });

    return res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/home/:userId", async (req, res) => {
  const auth = req.headers.authorization;
  const token = auth?.replace("Bearer ", "");
  const id = req.params.userId;

  if (!auth) {
    return res.sendStatus(401);
  }

  const online = await db.collection("sessions").findOne({
    token: token,
  });

  if (!online) {
    return res.status(404).send("Usuario não logado");
  }

  const resp = await db
    .collection("movements")
    .find({
      userId: `${id}`,
    })
    .toArray();

  if (!resp) {
    return res.status(200).send([]);
  } else {
    return res.status(200).send(resp);
  }
});

app.post("/nova-entrada", async (req, res) => {
  const entrada = req.body;
  const auth = req.headers.authorization;
  const token = auth?.replace("Bearer ", "");
  entrada.valor = Number(entrada.valor);

  const entradaSchema = joi.object({
    userId: joi.string().required(),
    valor: joi.number().min(0).required(),
    descricao: joi.string().required(),
    data: joi.string().required(),
    type: joi.string().valid("input").required(),
  });

  try {
    const validation = entradaSchema.validate(entrada, { abortEarly: false });

    if (validation.error) {
      const errors = validation.error.details.map((detail) => detail.message);
      return res.status(422).send(errors);
    }

    const online = await db.collection("sessions").findOne({
      token: token,
    });

    if (!online) {
      return res.status(404).send("Usuario não logado");
    }

    await db.collection("movements").insertOne(entrada);

    return res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/nova-saida", async (req, res) => {
  const saida = req.body;
  const auth = req.headers.authorization;
  const token = auth?.replace("Bearer ", "");
  saida.valor = Number(saida.valor);
  console.log(token)

  const saidaSchema = joi.object({
    userId: joi.string().required(),
    valor: joi.number().min(0).required(),
    descricao: joi.string().required(),
    data: joi.string().required(),
    type: joi.string().valid("output").required(),
  });

  try {
    const validation = saidaSchema.validate(saida, { abortEarly: false });

    if (validation.error) {
      const errors = validation.error.details.map((detail) => detail.message);
      return res.status(422).send(errors);
    }

    const online = await db.collection("sessions").findOne({
      token: token,
    });

    if (!online) {
      return res.status(404).send("Usuario não logado");
    }

    await db.collection("movements").insertOne(saida);

    return res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Port

const PORT = 5000;

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
