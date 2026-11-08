// Llena la BD con datos de prueba. Uso: npm run seed
// ⚠️ Borra y recrea las colecciones products, customers y sales.
import 'dotenv/config';
import { connectDB, closeDB } from './config/db.js';

const products = [
  { name: 'Café Americano', price: 35, stock: 100, category: 'Bebidas calientes' },
  { name: 'Café Latte', price: 45, stock: 80, category: 'Bebidas calientes' },
  { name: 'Capuchino', price: 48, stock: 80, category: 'Bebidas calientes' },
  { name: 'Frappé de Moka', price: 60, stock: 50, category: 'Bebidas frías' },
  { name: 'Té Chai', price: 40, stock: 60, category: 'Bebidas calientes' },
  { name: 'Croissant', price: 30, stock: 25, category: 'Panadería' },
  { name: 'Concha', price: 18, stock: 40, category: 'Panadería' },
  { name: 'Sándwich de Pavo', price: 75, stock: 15, category: 'Alimentos' },
];

const customers = [
  { name: 'Ana López', email: 'ana.lopez@example.com', phone: '5551234567' },
  { name: 'Carlos Méndez', email: 'carlos.mendez@example.com', phone: '5559876543' },
  { name: 'María Torres', email: 'maria.torres@example.com', phone: '5555550001' },
];

async function seed() {
  const db = await connectDB();
  const now = new Date();

  await Promise.all(['products', 'customers', 'sales'].map((c) => db.collection(c).deleteMany({})));

  const { insertedIds: prodIds } = await db
    .collection('products')
    .insertMany(products.map((p) => ({ ...p, createdAt: now, updatedAt: now })));
  console.log(`✅ Seeding products... (${Object.keys(prodIds).length} created)`);

  const { insertedIds: custIds } = await db
    .collection('customers')
    .insertMany(customers.map((c) => ({ ...c, createdAt: now, updatedAt: now })));
  console.log(`✅ Seeding customers... (${Object.keys(custIds).length} created)`);

  // Cada venta guarda una "foto" del producto (nombre y precio) al momento de vender.
  const item = (i, quantity) => ({
    productId: prodIds[i],
    name: products[i].name,
    unitPrice: products[i].price,
    quantity,
    subtotal: products[i].price * quantity,
  });
  const sale = (customerId, items) => ({
    customerId,
    items,
    total: items.reduce((sum, it) => sum + it.subtotal, 0),
    createdAt: now,
  });

  const sales = [
    sale(custIds[0], [item(1, 2), item(5, 1)]),
    sale(custIds[1], [item(0, 1), item(6, 2)]),
  ];
  const { insertedCount } = await db.collection('sales').insertMany(sales);
  console.log(`✅ Seeding sales... (${insertedCount} created)`);

  console.log('✅ Done! Database ready for development.');
}

seed()
  .catch((err) => {
    console.error('❌ Error en el seed:', err.message);
    process.exitCode = 1;
  })
  .finally(closeDB);
