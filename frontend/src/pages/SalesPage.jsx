// Página de Ventas. Por ahora solo lista productos (comprueba la conexión con el backend).
// Búsqueda, carrito y ticket llegan con sus historias de usuario.
import { useEffect, useState } from 'react'
import { getProducts } from '../services/api.js'
import ProductList from '../components/ProductList.jsx'
import '../styles/sales.css'

export default function SalesPage() {
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading') // loading | ok | error

  useEffect(() => {
    getProducts()
      .then(({ data }) => {
        setProducts(data)
        setStatus('ok')
      })
      .catch(() => setStatus('error'))
  }, [])

  return (
    <main className="app">
      <h1>☕ Cafecito Feliz — POS</h1>

      {status === 'loading' && <p>Cargando productos…</p>}
      {status === 'error' && (
        <p className="error">No se pudo conectar con la API. ¿Está corriendo el backend?</p>
      )}

      {status === 'ok' && (
        <>
          <p className="ok">✅ Backend conectado — {products.length} productos</p>
          <ProductList products={products} />
        </>
      )}
    </main>
  )
}
