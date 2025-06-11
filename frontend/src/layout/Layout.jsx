import React from 'react'
import Navbar from './navbar/Navbar'
import Footer from './footer/Footer'
import { Outlet } from 'react-router'

const Layout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>
    )
}

export default Layout
