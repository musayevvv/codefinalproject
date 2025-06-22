import React from 'react'
import '../signIn/Sign.css'
import './SignUp.css'
import Logo from '../../../src/image/logo.webp'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { Link } from 'react-router';
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import Google from '../../../src/image/google.png'
const SignUp = () => {
    return (
        <>
            <section className="section signInPage signUpPage">
                <div className="container">
                    <div className="box card p-3 shadow border-0">
                        <div className="signLogo text-center">
                            <img className='w-50' src={Logo} alt="Logo" />
                        </div>
                        <form className='mt-2'>
                            <h2 className='mb-3'>Sign Up</h2>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <TextField
                                            label="Name"
                                            required variant="standard"
                                            type='text'
                                            className='w-100'
                                        />
                                    </div>

                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <TextField
                                            label="PhoneNumber"
                                            required variant="standard"
                                            type='text'
                                            className='w-100'
                                        />
                                    </div>
                                </div>
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
                                <div className='row w-100'>
                                    <div className="col-md-6">
                                        <Button className="btn-blue w-100 btn-lg btn-big">
                                            Sign In
                                        </Button>
                                    </div>

                                    <div className="col-md-6">
                                        <Link className='d-block w-100' to="/signin">
                                            <Button
                                                className="btn-lg btn-big w-100"
                                                variant="outlined"
                                            >
                                                Cancel
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>


                            <p className='txt'>
                                Not Registered?
                                <Link to="/signin" className="border-effect">
                                    Sign In
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

export default SignUp

