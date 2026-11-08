// Conexión a MongoDB con Mongoose. Se conecta una vez al arrancar.
import mongoose from 'mongoose';

export async function connectDB(uri = process.env.DB_CONNECTION_STRING) {
  if (!uri) throw new Error('Falta DB_CONNECTION_STRING en el archivo .env');

  const conn = await mongoose.connect(uri);
  console.log(`✅ Connected to MongoDB (${conn.connection.name})`);
  return conn;
}

export async function closeDB() {
  await mongoose.disconnect();
}
