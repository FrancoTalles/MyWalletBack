import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoClient = new MongoClient(process.env.DATABASE_URL);
let db;

try {
  await mongoClient.connect();
  console.log("MongoDB Connected!")
  db = mongoClient.db();
} catch (error) {
  console.log("Deu erro no server");
}

export default db;
