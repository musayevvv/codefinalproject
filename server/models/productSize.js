import mongoose from 'mongoose';

const productSizeSchema = new mongoose.Schema({
    size: { type: String, default: null }
});

productSizeSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productSizeSchema.set('toJSON', { virtuals: true });

export const ProductSize = mongoose.model('ProductSize', productSizeSchema);
export { productSizeSchema };
