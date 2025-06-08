import mongoose from 'mongoose';

const commissionSchema = new mongoose.Schema({
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, default: 5 },
    paid: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Commission', commissionSchema);
