import mongoose from 'mongoose';

const myListSchema = new mongoose.Schema({
    productTitle: { type: String, required: true },
    image: { type: String, required: true },
    rating: { type: Number, required: true },
    price: { type: Number, required: true },
    productId: { type: String, required: true },
    userId: { type: String, required: true }
});

myListSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

myListSchema.set('toJSON', { virtuals: true });

export const MyList = mongoose.model('MyList', myListSchema);
export { myListSchema };
