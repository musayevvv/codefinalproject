import mongoose from 'mongoose';

const productRamsSchema = new mongoose.Schema({
  productRam: { type: String, default: null }
});

productRamsSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

productRamsSchema.set('toJSON', { virtuals: true });

export const ProductRams = mongoose.model('ProductRams', productRamsSchema);
export { productRamsSchema };
