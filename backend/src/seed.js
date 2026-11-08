// Llena la BD con datos de prueba. Uso: npm run seed
// ⚠️ Borra y recrea las colecciones products, customers y sales.
import 'dotenv/config';
import { randomBytes } from 'node:crypto';
import { connectDB, closeDB } from './config/db.js';
import { Product, Customer, Sale } from './models/index.js';

const products = [
  { name: 'Café Americano', price: 35, stock: 100 },
  { name: 'Café Latte', price: 45, stock: 80 },
  { name: 'Capuchino', price: 48, stock: 80 },
  { name: 'Espresso', price: 30, stock: 100 },
  { name: 'Frappé de Moka', price: 60, stock: 50 },
  { name: 'Té Chai', price: 40, stock: 60 },
  { name: 'Croissant', price: 30, stock: 25 },
  { name: 'Concha', price: 18, stock: 40 },
  { name: 'Galleta artesanal', price: 22, stock: 40 },
  { name: 'Sándwich de Pavo', price: 75, stock: 15 },
];

// Un cliente por cada nivel de descuento, para probar las 4 reglas.
const customers = [
  { name: 'Ana López', phoneOrEmail: 'ana.lopez@example.com', purchasesCount: 0 },      // 0%
  { name: 'Carlos Méndez', phoneOrEmail: '+524491234567', purchasesCount: 2 },          // 5%
  { name: 'Juan García', phoneOrEmail: 'juan@example.com', purchasesCount: 5 },         // 10%
  { name: 'María Torres', phoneOrEmail: 'maria.torres@example.com', purchasesCount: 9 }, // 15%
];

const round2 = (n) => Math.round(n * 100) / 100;
const newSaleId = () => `sale-${randomBytes(4).toString('hex')}`;

// Construye una venta histórica de ejemplo con los mismos cálculos que hará POST /api/sales.
function buildSale(customer, discountPercent, lines, paymentMethod = 'cash') {
  const items = lines.map(([product, quantity]) => ({
    productId: product._id,
    productNameSnapshot: product.name,
    unitPriceSnapshot: product.price,
    quantity,
    lineTotal: round2(product.price * quantity),
  }));
  const subtotal = round2(items.reduce((sum, it) => sum + it.lineTotal, 0));
  const discountAmount = round2(subtotal * (discountPercent / 100));
  return {
    saleId: newSaleId(),
    customerId: customer?._id ?? null,
    paymentMethod,
    items,
    subtotal,
    discountPercent,
    discountAmount,
    total: round2(subtotal - discountAmount),
  };
}

async function seed() {
  await connectDB();

  await Promise.all([Product.deleteMany({}), Customer.deleteMany({}), Sale.deleteMany({})]);
  await Promise.all([Product.syncIndexes(), Customer.syncIndexes(), Sale.syncIndexes()]);

  const p = await Product.insertMany(products);
  console.log(`✅ Seeding products... (${p.length} created)`);

  const c = await Customer.insertMany(customers);
  console.log(`✅ Seeding customers... (${c.length} created)`);

  // Ventas históricas de ejemplo (no alteran stock ni purchasesCount del seed).
  const sales = await Sale.insertMany([
    buildSale(c[2], 10, [[p[1], 2], [p[6], 1]]),            // Juan, 10%
    buildSale(null, 0, [[p[3], 1]]),                         // venta anónima
    buildSale(c[3], 15, [[p[0], 1], [p[7], 2]], 'card'),     // María, 15%
  ]);
  console.log(`✅ Seeding sales... (${sales.length} created)`);

  console.log('✅ Done! Database ready for development.');
}

seed()
  .catch((err) => {
    console.error('❌ Error en el seed:', err.message);
    process.exitCode = 1;
  })
  .finally(closeDB);
