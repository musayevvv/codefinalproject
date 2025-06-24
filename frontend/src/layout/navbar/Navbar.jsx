import React, { useState } from 'react'
import Logo from '../../image/logo.webp'
import { Link } from 'react-router'
import CountryDrop from './countryDrop/CountryDrop';
import Button from '@mui/material/Button';
import { FiUser } from "react-icons/fi";
import { IoBagOutline } from "react-icons/io5";
import './Navbar.css'
import SearchBox from './searchBox/SearchBox';
import Navigation from './navigation/Navigation';

const Navbar = () => {

  const [isLogin, setIsLogin] = useState(false)

  return (
    <>
      <div className="haederWrapper">
        <header className="header">
          <div className="container">
            <div className="row">
              <div className="logoWrapper d-flex align-items-center col-sm-2">
                <Link to={'/'}> <img src={Logo} alt="LOGO" /> </Link>
              </div>
              <div className="col-sm-10 d-flex align-items-center part2">
                <CountryDrop />

                <SearchBox />

                <div className='part3 d-flex align-items-center ml-auto'>
                  {isLogin !== true ? (
                    <Link to="/signIn">
                      <Button className="btn-blue btn-round mr-3">Sign In</Button>
                    </Link>
                  ) : (
                    <Button className="circle mr-3">
                      <FiUser />
                    </Button>
                  )}

                  <div className="ml-auto d-flex align-items-center cartTab">
                    <span className='price'>3.28AZN</span>
                    <div className="position-relative ml-2">
                      <Button className='circle'><IoBagOutline /></Button>
                      <span className='count d-flex align-items-center justify-content-center'>1</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </header>

        <Navigation />

      </div>
    </ >
  )
}

export default Navbar
