import countryModel from "../models/countryModel.js"


const getCountries = async (req, res) => {
    const country = await countryModel.find()
    res.json(country)
}
const postCountries = async (req, res) => {
    const { countryName } = req.body
    const country = { countryName }
    const newCountries = await countryModel.create(country)
    res.json(newCountries)
}
const deleteCountries = async (req, res) => {
    const { id } = req.params
    await countryModel.findByIdAndDelete(id)
    res.json(`${id}-li mehsul silindi`)
}

export { getCountries, postCountries, deleteCountries }