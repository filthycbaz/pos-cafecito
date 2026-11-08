// Capa de CONTROLADORES: traduce HTTP ↔ servicio.
// Lee y valida el request, llama al servicio y arma la respuesta con el formato del contrato.
import * as productsService from '../services/products.service.js';
import { parsePagination } from '../utils/pagination.js';

// GET /api/products?q=café&page=1&limit=10 → { data, total, page, limit }
export async function list(req, res) {
  const pagination = parsePagination(req.query);
  if (pagination.errors) {
    return res.status(400).json({ error: 'Invalid query parameters', details: pagination.errors });
  }
  const { page, limit, skip } = pagination;

  // q vacío o solo espacios = sin filtro (devuelve todos, paginados)
  const q = String(req.query.q ?? '').trim();
  const { items, total } = await productsService.listProducts({ q, skip, limit });

  const body = { data: items, total, page, limit };
  // Sin resultados NO es error: 200 con arreglo vacío y un mensaje informativo
  if (total === 0 && q) body.message = `No products found matching '${q}'`;
  res.json(body);
}
