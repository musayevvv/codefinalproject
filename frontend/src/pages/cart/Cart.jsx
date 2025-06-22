import React from 'react';
import './Cart.css';
import { Link } from 'react-router'
import Rating from '@mui/material/Rating';
import { IoIosClose } from "react-icons/io";
import Button from '@mui/material/Button';
import QuantityBox from '../home/productItem/productModal/quantityBox/QuantityBox';
import { IoCartSharp } from "react-icons/io5";
const Cart = () => {
    return (
        <section className="section cartPage">
            <div className="container">
                <h2 className="hd mb-1">Your Cart</h2>
                <p>There are <b className='text-red'>3</b> products in your cart</p>
                <div className="row">
                    <div className="col-md-9">
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th width='35%'>Product</th>
                                        <th width='15%'>Unit Price</th>
                                        <th width='25%'>Quantity</th>
                                        <th width='15%'>Total</th>
                                        <th width='10%'>Remove</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td width='35%'>
                                            <Link to='/product/1'>

                                                <div className="d-flex align-items-center cartItemImgWrapper">
                                                    <div className="imgWrapper">
                                                        <img
                                                            src="https://wp.alithemes.com/html/nest/demo/assets/imgs/shop/product-1-1.jpg"
                                                            className="w-100"
                                                            alt="product"
                                                        />
                                                    </div>
                                                    <div className="info px-3">
                                                        <h6>
                                                            Field Roast Chao Cheese Creamy Original
                                                        </h6>
                                                        <Rating
                                                            name="read-only"
                                                            value={4.5}
                                                            readOnly
                                                            precision={0.5}
                                                            size="small"
                                                        />
                                                    </div>
                                                </div>
                                            </Link>
                                        </td>

                                        <td width='15%'>$14.00</td>
                                        <td width='25%'>
                                            <QuantityBox />
                                        </td>
                                        <td width='15%'>$28.00</td>
                                        <td width='10%'>
                                            <span className='remove'><IoIosClose /></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width='35%'>
                                            <Link to='/product/1'>

                                                <div className="d-flex align-items-center cartItemImgWrapper">
                                                    <div className="imgWrapper" >
                                                        <img
                                                            src="https://wp.alithemes.com/html/nest/demo/assets/imgs/shop/product-1-1.jpg"
                                                            className="w-100"
                                                            alt="product"
                                                        />
                                                    </div>
                                                    <div className="info px-3">
                                                        <h6>
                                                            Field Roast Chao Cheese Creamy Original
                                                        </h6>
                                                        <Rating
                                                            name="read-only"
                                                            value={4.5}
                                                            readOnly
                                                            precision={0.5}
                                                            size="small"
                                                        />
                                                    </div>
                                                </div>
                                            </Link>
                                        </td>

                                        <td width='15%'>$14.00</td>
                                        <td width='25%'>
                                            <QuantityBox />
                                        </td>
                                        <td width='15%'>$28.00</td>
                                        <td width='10%'>
                                            <span className='remove'><IoIosClose /></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width='35%'>
                                            <Link to='/product/1'>

                                                <div className="d-flex align-items-center cartItemImgWrapper">
                                                    <div className="imgWrapper">
                                                        <img
                                                            src="https://wp.alithemes.com/html/nest/demo/assets/imgs/shop/product-1-1.jpg"
                                                            className="w-100"
                                                            alt="product"
                                                        />
                                                    </div>
                                                    <div className="info px-3">
                                                        <h6>
                                                            Field Roast Chao Cheese Creamy Original
                                                        </h6>
                                                        <Rating
                                                            name="read-only"
                                                            value={4.5}
                                                            readOnly
                                                            precision={0.5}
                                                            size="small"
                                                        />
                                                    </div>
                                                </div>
                                            </Link>
                                        </td>

                                        <td width='15%'>$14.00</td>
                                        <td width='25%'>
                                            <QuantityBox />
                                        </td>
                                        <td width='15%'>$28.00</td>
                                        <td width='10%'>
                                            <span className='remove'><IoIosClose /></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width='35%'>
                                            <Link to='/product/1'>

                                                <div className="d-flex align-items-center cartItemImgWrapper">
                                                    <div className="imgWrapper">
                                                        <img
                                                            src="https://wp.alithemes.com/html/nest/demo/assets/imgs/shop/product-1-1.jpg"
                                                            className="w-100"
                                                            alt="product"
                                                        />
                                                    </div>
                                                    <div className="info px-3">
                                                        <h6>
                                                            Field Roast Chao Cheese Creamy Original
                                                        </h6>
                                                        <Rating
                                                            name="read-only"
                                                            value={4.5}
                                                            readOnly
                                                            precision={0.5}
                                                            size="small"
                                                        />
                                                    </div>
                                                </div>
                                            </Link>
                                        </td>

                                        <td width='15%'>$14.00</td>
                                        <td width='25%'>
                                            <QuantityBox />
                                        </td>
                                        <td width='15%'>$28.00</td>
                                        <td width='10%'>
                                            <span className='remove'><IoIosClose /></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width='35%'>
                                            <Link to='/product/1'>

                                                <div className="d-flex align-items-center cartItemImgWrapper">
                                                    <div className="imgWrapper">
                                                        <img
                                                            src="https://wp.alithemes.com/html/nest/demo/assets/imgs/shop/product-1-1.jpg"
                                                            className="w-100"
                                                            alt="product"
                                                        />
                                                    </div>
                                                    <div className="info px-3">
                                                        <h6>
                                                            Field Roast Chao Cheese Creamy Original
                                                        </h6>
                                                        <Rating
                                                            name="read-only"
                                                            value={4.5}
                                                            readOnly
                                                            precision={0.5}
                                                            size="small"
                                                        />
                                                    </div>
                                                </div>
                                            </Link>
                                        </td>

                                        <td width='15%'>$14.00</td>
                                        <td width='25%'>
                                            <QuantityBox />
                                        </td>
                                        <td width='15%'>$28.00</td>
                                        <td width='10%'>
                                            <span className='remove'><IoIosClose /></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width='35%'>
                                            <Link to='/product/1'>

                                                <div className="d-flex align-items-center cartItemImgWrapper">
                                                    <div className="imgWrapper">
                                                        <img
                                                            src="https://wp.alithemes.com/html/nest/demo/assets/imgs/shop/product-1-1.jpg"
                                                            className="w-100"
                                                            alt="product"
                                                        />
                                                    </div>
                                                    <div className="info px-3">
                                                        <h6>
                                                            Field Roast Chao Cheese Creamy Original
                                                        </h6>
                                                        <Rating
                                                            name="read-only"
                                                            value={4.5}
                                                            readOnly
                                                            precision={0.5}
                                                            size="small"
                                                        />
                                                    </div>
                                                </div>
                                            </Link>
                                        </td>

                                        <td width='15%'>$14.00</td>
                                        <td width='25%'>
                                            <QuantityBox />
                                        </td>
                                        <td width='15%'>$28.00</td>
                                        <td width='10%'>
                                            <span className='remove'><IoIosClose /></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width='35%'>
                                            <Link to='/product/1'>

                                                <div className="d-flex align-items-center cartItemImgWrapper">
                                                    <div className="imgWrapper">
                                                        <img
                                                            src="https://wp.alithemes.com/html/nest/demo/assets/imgs/shop/product-1-1.jpg"
                                                            className="w-100"
                                                            alt="product"
                                                        />
                                                    </div>
                                                    <div className="info px-3">
                                                        <h6>
                                                            Field Roast Chao Cheese Creamy Original
                                                        </h6>
                                                        <Rating
                                                            name="read-only"
                                                            value={4.5}
                                                            readOnly
                                                            precision={0.5}
                                                            size="small"
                                                        />
                                                    </div>
                                                </div>
                                            </Link>
                                        </td>

                                        <td width='15%'>$14.00</td>
                                        <td width='25%'>
                                            <QuantityBox />
                                        </td>
                                        <td width='15%'>$28.00</td>
                                        <td width='10%'>
                                            <span className='remove'><IoIosClose /></span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card border p-3 cartDetails">
                            <h4>CART TOTALS</h4>

                            <div className="d-flex align-items-center mb-3 ">
                                <span>Subtotal</span>
                                <span className="ml-auto text-red font-weight-bold">$12.31</span>
                            </div>

                            <div className="d-flex align-items-center mb-3">
                                <span>Shipping</span>
                                <span className="ml-auto"><b>Free</b></span>
                            </div>

                            <div className="d-flex align-items-center mb-3">
                                <span>Estimate for</span>
                                <span className="ml-auto"><b>Yasamal</b></span>
                            </div>

                            <div className="d-flex align-items-center">
                                <span>Total</span>
                                <span className="ml-auto text-red font-weight-bold">$12.31</span>
                            </div>

                            <br />

                            <Button className='btn-blue bg-red btn-big ml-3'>
                                <IoCartSharp />Add to Cart
                            </Button>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Cart;
