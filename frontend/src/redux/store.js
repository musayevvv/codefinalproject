import { configureStore } from "@reduxjs/toolkit";
import countriesSlice from './reducer/countrySlice'

const store = configureStore({
    reducer: {
        countries: countriesSlice
    }
})

export default store