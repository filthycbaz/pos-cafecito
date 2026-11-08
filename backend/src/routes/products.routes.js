// Rutas del módulo Productos.
// Por ahora solo lectura. El CRUD completo (admin) llega con sus historias de usuario.
import { Router } from 'express';
import { Product } from '../models/index.js';
import { parsePagination, searchRegex } from '../utils/pagination.js';

const router = Router();

// GET /api/products?q=café&page=1&limit=10
// Respuesta: { data: [...], total, page, limit }
router.get('/', async (req, res, next) => {
  try {
    const pagination = parsePagination(req.query);
    if (pagination.errors) {
      return res.status(400).json({ error: 'Invalid query parameter', details: pagination.errors });
    }
    const { page, limit, skip } = pagination;

    const filter = req.query.q ? { name: searchRegex(req.query.q) } : {};

    const [products, total] = await Promise.all([
      Product.find(filter).sort({ name: 1 }).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    res.json({ data: products, total, page, limit });
  } catch (err) {
    next(err);
  }
});

export default router;
