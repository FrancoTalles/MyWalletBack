import db from "../Configs/database.js";
import bcrypt from "bcrypt"
import { v4 as uuid} from "uuid"

export async function login(req, res) {
  const user = req.body;

  try {

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
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function cadastro(req, res) {
  const userCadastro = req.body;

  try {

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
}
