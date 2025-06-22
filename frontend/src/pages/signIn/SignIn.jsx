import React from 'react'
import './Sign.css'
import Logo from '../../../src/image/logo.webp'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { Link } from 'react-router';
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import Google from '../../../src/image/google.png'
const SignIn = () => {
    return (
        <>
            <section className="section signInPage">
                <div className="container">
                    <div className="box card p-3 shadow border-0">
                        <div className="signLogo text-center">
                            <img className='w-50' src={Logo} alt="Logo" />
                        </div>
                        <form className='mt-3'>
                            <h2 className='mb-4'>Sign In</h2>
                            <div className="form-group">
                                <TextField
                                    id="standart-basic"
                                    label="Email"
                                    required variant="standard"
                                    type='email'
                                    className='w-100'
                                />
                            </div>

                            <div className="form-group">
                                <TextField
                                    id="standart-basic"
                                    label="Password"
                                    required variant="standard"
                                    type='password'
                                    className='w-100'
                                />
                            </div>

                            <a className="border-effect cursor txt">Forgot Password?</a>

                            <div className="d-flex align-items-center mt-3 mb-3">
                                <Button className="btn-blue col btn-lg btn-big">
                                    Sign In
                                </Button>

                                <Link to="/">
                                    <Button
                                        className="btn-lg btn-big col ml-3"
                                        variant="outlined"
                                    >
                                        Cancel
                                    </Button>
                                </Link>
                            </div>


                            <p className='txt'>
                                Not Registered?
                                <Link to="/signUp" className="border-effect">
                                    Sign Up
                                </Link>
                            </p>

                            <h6 className="mt-4 text-center font-weight-bold">
                                Or continue with social account
                            </h6>

                            <Button className="loginWithGoogle mt-2" variant="outlined">
                                <img src={Google} />
                                Sign In with Google
                            </Button>

                        </form>
                    </div>
                </div>
            </section>
        </>
    )
}

export default SignIn
