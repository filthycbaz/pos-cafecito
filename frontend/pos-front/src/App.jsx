import { useEffect, useState } from 'react'
import './App.css'

// URL base de la API (definida en .env.local → VITE_API_URL)
const API_URL = import.meta.env.VITE_API_URL

// Pantalla temporal del Quickstart: comprueba que el frontend habla con el backend.
function App() {
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading') // loading | ok | error

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(({ data }) => {
        setProducts(data) // el contrato envuelve la lista en { data, total, page, limit }
        setStatus('ok')
      })
      .catch(() => setStatus('error'))
  }, [])

  return (
    <main className="app">
      <h1>☕ Cafecito Feliz — POS</h1>

      {status === 'loading' && <p>Cargando productos…</p>}
      {status === 'error' && (
        <p className="error">No se pudo conectar con la API en {API_URL}. ¿Está corriendo el backend?</p>
      )}

      {status === 'ok' && (
        <>
          <p className="ok">✅ Backend conectado — {products.length} productos</p>
          <ul className="products">
            {products.map((p) => (
              <li key={p.id}>
                <span>{p.name}</span>
                <strong>${p.price.toFixed(2)}</strong>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  )
}

export default App
