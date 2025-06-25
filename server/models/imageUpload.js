import mongoose from 'mongoose';

const imageUploadSchema = new mongoose.Schema({
  images: [{ type: String, required: true }]
});

imageUploadSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

imageUploadSchema.set('toJSON', { virtuals: true });

export const ImageUpload = mongoose.model('ImageUpload', imageUploadSchema);
export { imageUploadSchema };
