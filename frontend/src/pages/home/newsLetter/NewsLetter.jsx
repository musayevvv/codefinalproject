import React from 'react'
import { IoMailOutline } from "react-icons/io5";
import Button from '@mui/material/Button';
import ticket from '../../../image/ticket.png'
import './NewsLetter.css'
const NewsLetter = () => {
    return (
        <>
            <section className='newsLetterSection mt-3 mb-3 d-flex align-items-center '>
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <p className='text-white mb-1'>
                                20$ discount for your first order
                            </p>
                            <h3 className='text-white'>Join our newsletter and get...</h3>
                            <p className='text-ligth'>Join our email subscription now to get updates  <br />
                                on promotions and coupons.</p>

                            <form action="">
                                <IoMailOutline />
                                <input type="text" placeholder='Your Email Address' />
                                <Button>Subcribe</Button>
                            </form>

                        </div>
                        <div className="col-md-6">
                            <img src={ticket} alt="photo" />
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default NewsLetter
