import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const getCountriesThunk = createAsyncThunk('country/get', async () => {
    const res = await axios.get('http://localhost:5000/countries')
    return res.data
})
export const postCountriesThunk = createAsyncThunk('country/post', async (newCountries) => {
    const res = await axios.post('http://localhost:5000/countries', newCountries)
    return res.data
})
export const deleteCountriesThunk = createAsyncThunk('country/delete', async (id) => {
    await axios.delete(`http://localhost:5000/countries/${id}`);
    console.log(id);

    return id;
})

const countriesSlice = createSlice({
    name: 'countries',
    initialState: {
        country: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCountriesThunk.pending, (state) => {
                state.loading = true
            })
            .addCase(getCountriesThunk.fulfilled, (state, action) => {
                state.loading = false
                state.country = action.payload
            })
            .addCase(getCountriesThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(postCountriesThunk.fulfilled, (state, action) => {
                state.loading = false
                state.country.push(action.payload)
            })
            .addCase(deleteCountriesThunk.fulfilled, (state, action) => {
                state.loading = false
                state.country = state.country.filter(item => item._id !== action.payload)
            })
    }
})

export default countriesSlice.reducer