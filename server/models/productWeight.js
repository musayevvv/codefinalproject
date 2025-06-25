import mongoose from 'mongoose';

const productWeightSchema = new mongoose.Schema({
    productWeight: { type: String, default: null }
});

productWeightSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productWeightSchema.set('toJSON', { virtuals: true });

export const ProductWeight = mongoose.model('ProductWeight', productWeightSchema);
export { productWeightSchema };
