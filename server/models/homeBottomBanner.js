import mongoose from 'mongoose';

const homeBottomBannersSchema = new mongoose.Schema({
  images: [{ type: String, required: true }],
  catId: { type: String },
  catName: { type: String },
  subCatId: { type: String },
  subCatName: { type: String }
});

homeBottomBannersSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

homeBottomBannersSchema.set('toJSON', { virtuals: true });

export const HomeBottomBanners = mongoose.model('HomeBottomBanners', homeBottomBannersSchema);
export { homeBottomBannersSchema };
