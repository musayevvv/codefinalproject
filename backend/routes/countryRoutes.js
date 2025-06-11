import express from 'express'
import { deleteCountries, getCountries, postCountries } from '../controllers/countryController.js'
const router = express.Router()

router
    .get('/', getCountries)
    .post('/', postCountries)
    .delete('/:id', deleteCountries)

export default router