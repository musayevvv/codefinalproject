import mongoose from "mongoose"

const countrySchema = mongoose.Schema({
    countryName: { type: String, required: true },
}, { timestamps: true })

const countryModel = mongoose.model('Countries', countrySchema)

export default countryModel