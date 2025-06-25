import mongoose from 'mongoose';

const homeBannerSchema = new mongoose.Schema({
  images: [{ type: String, required: true }]
});

homeBannerSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

homeBannerSchema.set('toJSON', { virtuals: true });

export const HomeBanner = mongoose.model('HomeBanner', homeBannerSchema);
export { homeBannerSchema };
