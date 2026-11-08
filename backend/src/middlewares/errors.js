// Middlewares de error compartidos por toda la API.

// 404 para cualquier ruta que no exista.
export function notFound(req, res) {
  res.status(404).json({ error: 'Route not found', path: req.originalUrl });
}

// Manejador central: cualquier error no controlado termina aquí.
// Express 5 envía aquí automáticamente los errores de funciones async.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // JSON mal formado en el body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  console.error(err);
  res.status(err.status || 500).json({
    error: err.status ? err.message : 'Internal server error',
  });
}
