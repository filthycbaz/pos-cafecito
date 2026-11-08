import mongoose from 'mongoose';
import toJSONPlugin from './toJSON.plugin.js';

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    // Un solo campo para teléfono (+52...) o correo. Único para no duplicar clientes.
    phoneOrEmail: { type: String, required: true, unique: true, trim: true, lowercase: true },
    // Solo lo incrementa POST /api/sales (regla de negocio, ver Flujo 4).
    purchasesCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

customerSchema.plugin(toJSONPlugin);

export const Customer = mongoose.model('Customer', customerSchema);
