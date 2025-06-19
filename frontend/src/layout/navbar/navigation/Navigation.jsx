import React, { useState } from 'react'
import { IoIosMenu } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa6";
import Button from '@mui/material/Button';
import { FaAngleRight } from "react-icons/fa6";
import { Link } from 'react-router';
import './Navigation.css'
const Navigation = () => {

    const [isOpenSideBar, setisOpenSideBar] = useState(false)
    return (
        <>
            <nav>
                <div className="container">
                    <div className="row">
                        <div className="col-sm-2 navPart1">
                            <div className="catWrapper">
                                <Button className='allCatTab align-items-center' onClick={() => setisOpenSideBar(!isOpenSideBar)}>
                                    <span className='icon1 mr-2'><IoIosMenu /></span>
                                    <span className='text'>ALL CATEGORIES</span>
                                    <span className='icon2 ml-2'><FaAngleDown /></span>
                                </Button>
                                <div className={`sideBarNav ${isOpenSideBar === true ? 'open' : ''} `}>
                                    <ul>
                                        <li>
                                            <Link to='/'><Button>Home<FaAngleRight className='ml-auto' /></Button></Link>
                                            <div className='submenu'>
                                                <Link to='/'><Button>Home</Button></Link>
                                                <Link to='/'><Button>Home</Button></Link>
                                                <Link to='/'><Button>Home</Button></Link>
                                                <Link to='/'><Button>Home</Button></Link>
                                                <Link to='/'><Button>Home</Button></Link>
                                                <Link to='/'><Button>Home</Button></Link>
                                            </div>
                                        </li>
                                        <li>
                                            <Link to='/'><Button>Home<FaAngleRight className='ml-auto' /></Button></Link>
                                            <div className='submenu'>
                                                <Link to='/'><Button>Home</Button></Link>
                                                <Link to='/'><Button>Home</Button></Link>
                                                <Link to='/'><Button>Home</Button></Link>
                                                <Link to='/'><Button>Home</Button></Link>
                                                <Link to='/'><Button>Home</Button></Link>
                                                <Link to='/'><Button>Home</Button></Link>
                                            </div>
                                        </li>
                                        <li>
                                            <Link to='/'><Button>Home<FaAngleRight className='ml-auto' /></Button></Link>
                                            <div className='submenu'>
                                                <Link to='/'><Button>Home</Button></Link>
                                                <Link to='/'><Button>Home</Button></Link>
                                                <Link to='/'><Button>Home</Button></Link>
                                                <Link to='/'><Button>Home</Button></Link>
                                                <Link to='/'><Button>Home</Button></Link>
                                                <Link to='/'><Button>Home</Button></Link>
                                            </div>
                                        </li>
                                        <li>
                                            <Link to='/'><Button>Home<FaAngleRight className='ml-auto' /></Button></Link>
                                            <div className='submenu'>
                                                <Link to='/'><Button>Home</Button></Link>
                                                <Link to='/'><Button>Home</Button></Link>
                                                <Link to='/'><Button>Home</Button></Link>
                                                <Link to='/'><Button>Home</Button></Link>
                                                <Link to='/'><Button>Home</Button></Link>
                                                <Link to='/'><Button>Home</Button></Link>
                                            </div>
                                        </li>          <li>
                                            <Link to='/'><Button>Home<FaAngleRight className='ml-auto' /></Button></Link>
                                            <div className='submenu'>
                                                <Link to='/'><Button>Home</Button></Link>
                                                <Link to='/'><Button>Home</Button></Link>
                                                <Link to='/'><Button>Home</Button></Link>
                                                <Link to='/'><Button>Home</Button></Link>
                                                <Link to='/'><Button>Home</Button></Link>
                                                <Link to='/'><Button>Home</Button></Link>
                                            </div>
                                        </li>


                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-10 navPart2 d-flex align-items-center">
                            <ul className='list list-inline ml-auto'>
                                <li className='list-inline-item'><Link to='/'><Button>Home</Button></Link>

                                    <div className='submenu shadow'>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                    </div>

                                </li>
                                <li className='list-inline-item'><Link to='/'><Button>Homehome</Button></Link>
                                    <div className='submenu shadow'>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                    </div>
                                </li>
                                <li className='list-inline-item'><Link to='/'><Button>Home</Button></Link>
                                    <div className='submenu shadow'>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                    </div>
                                </li>
                                <li className='list-inline-item'><Link to='/'><Button>Home</Button></Link>
                                    <div className='submenu shadow'>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                    </div>
                                </li>
                                <li className='list-inline-item'><Link to='/'><Button>Home</Button></Link>
                                    <div className='submenu shadow'>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                    </div>
                                </li>
                                <li className='list-inline-item'><Link to='/'><Button>Home</Button></Link>
                                    <div className='submenu shadow'>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                    </div>
                                </li>
                                <li className='list-inline-item'><Link to='/'><Button>Home</Button></Link>
                                    <div className='submenu shadow'>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                    </div>
                                </li>
                                <li className='list-inline-item'><Link to='/'><Button>Home</Button></Link>
                                    <div className='submenu shadow'>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                    </div>
                                </li>
                                <li className='list-inline-item'><Link to='/'><Button>Home</Button></Link>
                                    <div className='submenu shadow'>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                    </div>
                                </li>
                                <li className='list-inline-item'><Link to='/'><Button>Home</Button></Link>
                                    <div className='submenu shadow'>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                        <Link to='/'><Button>Home</Button></Link>
                                    </div>
                                </li>


                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navigation
