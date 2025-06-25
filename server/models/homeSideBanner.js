import mongoose from 'mongoose';

const homeSideBannersSchema = new mongoose.Schema({
  images: [{ type: String, required: true }],
  catId: { type: String },
  catName: { type: String },
  subCatId: { type: String },
  subCatName: { type: String }
});

homeSideBannersSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

homeSideBannersSchema.set('toJSON', { virtuals: true });

export const HomeSideBanners = mongoose.model('HomeSideBanners', homeSideBannersSchema);
export { homeSideBannersSchema };
