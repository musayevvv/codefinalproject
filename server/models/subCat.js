import mongoose from 'mongoose';

const subCatSchema = new mongoose.Schema({
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subCat: { type: String, required: true }
});

subCatSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

subCatSchema.set('toJSON', { virtuals: true });

export const SubCategory = mongoose.model('SubCategory', subCatSchema);
export { subCatSchema };
