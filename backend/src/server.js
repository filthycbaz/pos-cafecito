// Punto de entrada: carga variables de entorno, conecta a MongoDB y levanta el servidor HTTP.
import 'dotenv/config';
import { connectDB } from './config/db.js';
import { createApp } from './app.js';

const PORT = process.env.PORT || 3001;
const app = createApp({ frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000' });

try {
  await connectDB();
  app.listen(PORT, () => console.log(`🚀 Server is running on http://localhost:${PORT}`));
} catch (err) {
  console.error('❌ No se pudo iniciar el servidor:', err.message);
  process.exit(1);
}
