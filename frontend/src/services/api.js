// Capa de SERVICIOS del frontend: todas las llamadas a la API pasan por aquí.
// Los componentes nunca usan fetch directo; así, si cambia la URL o el formato, se cambia en un solo lugar.

const API_URL = import.meta.env.VITE_API_URL // definida en .env.local

// Error con la información que devuelve la API ({ error, details }) para mostrarla en pantalla.
export class ApiError extends Error {
  constructor(status, body) {
    super(body?.error || `HTTP ${status}`)
    this.status = status
    this.details = body?.details ?? []
  }
}

async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new ApiError(res.status, data)
  return data
}

// GET /api/products → { data, total, page, limit }
export function getProducts({ q = '', page = 1, limit = 20 } = {}) {
  const params = new URLSearchParams({ page, limit })
  if (q) params.set('q', q)
  return request(`/products?${params}`)
}
