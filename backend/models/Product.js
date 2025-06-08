import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    discount: { type: Number, default: 0 },
    slug: { type: String, unique: true },
    tags: [String],
    keywords: [String],
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
