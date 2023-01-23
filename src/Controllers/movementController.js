import db from "../Configs/database.js";
import { entradaSchema, saidaSchema } from "../Schemas/MovementSchema.js";

export async function novaEntrada(req, res) {
  const entrada = req.body;
  const auth = req.headers.authorization;
  const token = auth?.replace("Bearer ", "");
  entrada.valor = Number(entrada.valor);

  try {

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
}

export async function novaSaida(req, res) {
  const saida = req.body;
  const auth = req.headers.authorization;
  const token = auth?.replace("Bearer ", "");
  saida.valor = Number(saida.valor);

  try {

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
}
