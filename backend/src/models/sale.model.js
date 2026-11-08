import mongoose from 'mongoose';
import toJSONPlugin from './toJSON.plugin.js';

// Cada item guarda una "foto" (snapshot) del producto al momento de vender:
// si mañana cambia el precio, el ticket histórico no cambia.
const saleItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productNameSnapshot: { type: String, required: true },
    unitPriceSnapshot: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const saleSchema = new mongoose.Schema(
  {
    saleId: { type: String, required: true, unique: true }, // ej. "sale-20261108-ab12cd"
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', default: null },
    paymentMethod: { type: String, enum: ['cash', 'card', 'transfer'], default: 'cash' },
    items: {
      type: [saleItemSchema],
      validate: { validator: (v) => v.length > 0, message: 'items cannot be empty' },
    },
    subtotal: { type: Number, required: true, min: 0 },
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },
    discountAmount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

saleSchema.plugin(toJSONPlugin);

export const Sale = mongoose.model('Sale', saleSchema);
