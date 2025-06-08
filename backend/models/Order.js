import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: Number
        }
    ],
    address: String,
    totalPrice: Number,
    status: {
        type: String,
        enum: ['Preparing', 'On the way', 'Delivered'],
        default: 'Preparing'
    }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);