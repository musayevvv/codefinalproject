import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import Layout from '../layout/Layout'
import Home from '../pages/home/Home'
import Listing from '../pages/listing/Listing'
import ProductDetails from '../pages/productDetails/ProductDetails'
import Cart from '../pages/cart/Cart'
import SignIn from '../pages/signIn/SignIn'
import SignUp from '../pages/signUp/SignUp'
const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path='/cat/:id' element={<Listing />} />
                    <Route path='/product/:id' element={<ProductDetails />} />
                    <Route path='/cart' element={<Cart />} />
                </Route>
                <Route path='/signin' element={<SignIn />} />
                <Route path='/signup' element={<SignUp />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Router