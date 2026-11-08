// Rutas del módulo Productos.
// Por ahora solo lectura (Quickstart). El CRUD completo llega con sus historias de usuario.
import { Router } from 'express';
import { getDb } from '../config/db.js';

const router = Router();

// GET /api/products → lista de productos ordenada por nombre
router.get('/', async (req, res, next) => {
  try {
    const products = await getDb()
      .collection('products')
      .find()
      .sort({ name: 1 })
      .toArray();
    res.json(products);
  } catch (err) {
    next(err);
  }
});

export default router;
