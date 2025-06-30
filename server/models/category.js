import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, unique: true, lowercase: true },
    images: [{ type: String }],
    color: { type: String },
    parentId: { type: String }
}, { timestamps: true });

categorySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

categorySchema.set('toJSON', { virtuals: true });

export const Category = mongoose.model('Category', categorySchema);
export { categorySchema };
