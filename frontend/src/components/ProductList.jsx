// Componente reutilizable: lista de productos con nombre y precio.
export default function ProductList({ products }) {
  return (
    <ul className="products">
      {products.map((p) => (
        <li key={p.id}>
          <span>{p.name}</span>
          <strong>${p.price.toFixed(2)}</strong>
        </li>
      ))}
    </ul>
  )
}
