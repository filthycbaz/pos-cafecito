import mongoose from 'mongoose';
import toJSONPlugin from './toJSON.plugin.js';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    price: { type: Number, required: true, min: 0.01 },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      validate: { validator: Number.isInteger, message: 'stock must be an integer' },
    },
  },
  { timestamps: true } // agrega createdAt y updatedAt automáticamente
);

productSchema.plugin(toJSONPlugin);

export const Product = mongoose.model('Product', productSchema);
