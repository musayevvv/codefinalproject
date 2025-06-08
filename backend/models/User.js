import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Ad tələb olunur']
    },
    email: {
        type: String,
        required: [true, 'Email tələb olunur'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Şifrə tələb olunur']
    },
    role: {
        type: String,
        enum: ['guest', 'customer', 'seller', 'admin', 'superadmin'],
        default: 'customer'
    },
    cashbackPoints: {
        type: Number,
        default: 0
    },
    commissionPaid: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
