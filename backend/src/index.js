// Punto de entrada del backend: configura Express, conecta a MongoDB y levanta el servidor.
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import productsRouter from './routes/products.routes.js';

const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const app = express();

// Middlewares globales
app.use(cors({ origin: FRONTEND_URL })); // permite que el frontend llame a la API
app.use(express.json());                  // parsea body JSON

// Rutas
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/products', productsRouter);

// 404 para rutas de API no existentes
app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

// Manejador central de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor' });
});

try {
  await connectDB();
  app.listen(PORT, () => console.log(`🚀 Server is running on http://localhost:${PORT}`));
} catch (err) {
  console.error('❌ No se pudo iniciar el servidor:', err.message);
  process.exit(1);
}
