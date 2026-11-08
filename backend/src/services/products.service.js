// Capa de SERVICIOS: lógica de negocio y acceso a datos de productos.
// No sabe nada de HTTP (req/res): recibe datos simples y devuelve datos simples.
import { Product } from '../models/index.js';
import { searchRegex } from '../utils/pagination.js';

// Lista productos filtrando por nombre (opcional) y paginando.
export async function listProducts({ q = '', skip = 0, limit = 20 } = {}) {
  const filter = q ? { name: searchRegex(q) } : {};

  const [items, total] = await Promise.all([
    Product.find(filter).sort({ name: 1 }).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  return { items, total };
}
