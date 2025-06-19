import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import Layout from '../layout/Layout'
import Home from '../pages/home/Home'
import Listing from '../pages/home/listing/Listing'
const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path='/cat/:id' element={<Listing />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router