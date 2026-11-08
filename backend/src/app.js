// Configura la aplicación Express (middlewares y rutas), sin arrancarla.
// Separarla de server.js permite usarla en tests sin abrir un puerto.
import express from 'express';
import cors from 'cors';
import productsRouter from './routes/products.routes.js';
import { notFound, errorHandler } from './middlewares/errors.js';

export function createApp({ frontendUrl = 'http://localhost:3000' } = {}) {
  const app = express();

  // Middlewares globales
  app.use(cors({ origin: frontendUrl })); // solo el frontend puede llamar a la API
  app.use(express.json());                // parsea body JSON

  // Rutas
  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
  app.use('/api/products', productsRouter);

  // Errores (siempre al final)
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
