import db from "../Configs/database.js"

export async function home(req, res) {
  const auth = req.headers.authorization;
  const token = auth?.replace("Bearer ", "");
  const id = req.params.userId;

  try {
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
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
