// Helpers compartidos para listados con búsqueda y paginación (?q=&page=&limit=).

// Valida page/limit. Devuelve { page, limit, skip } o { errors: [...] } con formato del contrato.
export function parsePagination(query, { defaultLimit = 20, maxLimit = 100 } = {}) {
  const errors = [];
  const page = query.page === undefined ? 1 : Number(query.page);
  const limit = query.limit === undefined ? defaultLimit : Number(query.limit);

  // Devuelve el valor recibido tal cual lo mandó el cliente (número si lo es, si no el texto).
  const received = (raw) => (raw !== '' && !Number.isNaN(Number(raw)) ? Number(raw) : raw);

  if (!Number.isInteger(page) || page < 1) {
    errors.push({
      field: 'page',
      value: received(query.page),
      message: 'page must be a positive integer (greater than or equal to 1)',
    });
  }
  if (!Number.isInteger(limit) || limit < 1 || limit > maxLimit) {
    errors.push({
      field: 'limit',
      value: received(query.limit),
      message: `limit must be a positive integer between 1 and ${maxLimit}`,
    });
  }

  if (errors.length) return { errors };
  return { page, limit, skip: (page - 1) * limit };
}

// Cada vocal/ñ acepta su versión con o sin acento: "cafe" encuentra "Café".
const ACCENT_GROUPS = { a: '[aáàä]', e: '[eéèë]', i: '[iíìï]', o: '[oóòö]', u: '[uúùü]', n: '[nñ]' };

// Convierte texto del usuario en regex segura (escapa caracteres especiales),
// insensible a mayúsculas y a acentos.
export function searchRegex(text) {
  const normalized = String(text)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, ''); // quita acentos: "café" → "cafe"
  const escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = escaped.replace(/[aeioun]/g, (ch) => ACCENT_GROUPS[ch]);
  return new RegExp(pattern, 'i');
}
