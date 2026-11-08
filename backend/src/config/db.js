// Conexión única a MongoDB usando el driver oficial.
// Se conecta una vez al arrancar y el resto del código reutiliza `getDb()`.
import { MongoClient } from 'mongodb';

let client;
let db;

export async function connectDB(uri = process.env.DB_CONNECTION_STRING) {
  if (!uri) throw new Error('Falta DB_CONNECTION_STRING en el archivo .env');
  if (db) return db;

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(); // usa el nombre de BD que viene en la URI (cafecito-pos)
  console.log(`✅ Connected to MongoDB (${db.databaseName})`);
  return db;
}

export function getDb() {
  if (!db) throw new Error('La BD no está conectada. Llama connectDB() primero.');
  return db;
}

export async function closeDB() {
  await client?.close();
  client = undefined;
  db = undefined;
}
