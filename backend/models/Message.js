import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    createdAt: { type: Date, default: Date.now, expires: 86400 }
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);
