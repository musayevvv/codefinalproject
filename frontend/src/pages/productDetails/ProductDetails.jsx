import React, { useState } from 'react';
import ProductZoom from '../home/productItem/productModal/productZoom/ProductZoom';
import Rating from '@mui/material/Rating';
import QuantityBox from '../home/productItem/productModal/quantityBox/QuantityBox';
import Button from '@mui/material/Button';
import { FaRegHeart } from 'react-icons/fa';
import { MdOutlineCompareArrows } from 'react-icons/md';
import Tooltip from '@mui/material/Tooltip';
import { BsCartFill } from 'react-icons/bs';
import './ProductDetails.css';
import RelatedProducts from './RelatedProducts/RelatedProducts';

const ProductDetails = () => {
    const [activeSize, setActiveSize] = useState(null);
    const [activeTabs, setActiveTabs] = useState(0);
    const [rating, setRating] = useState(0);

    const isActive = (index) => {
        setActiveSize(index);
    };

    return (
        <section className="productDetails section">
            <div className="container">
                <div className="row">
                    <div className="col-md-4 pl-5">
                        <ProductZoom />
                    </div>

                    <div className="col-md-7 pl-5 pr-5">
                        <h2 className="hd text-capitalize">All Natural Italian-Style Chicken Meatballs</h2>

                        <ul className="list list-inline d-flex align-items-center">
                            <li className="list-inline-item">
                                <div className="d-flex align-items-center">
                                    <span className="text-light mr-2">Brands:</span>
                                    <span>Welch's</span>
                                </div>
                            </li>

                            <li className="list-inline-item">
                                <div className="d-flex align-items-center">
                                    <Rating name="read-only" value={4.5} precision={0.5} readOnly size="small" />
                                    <span className="text-light cursor ml-2">1 Review</span>
                                </div>
                            </li>
                        </ul>

                        <div className="d-flex info mb-3">
                            <span className="oldPrice">$20.00</span>
                            <span className="netPrice text-danger ml-2">$14.00</span>
                        </div>

                        <span className="badge badge-success position-static">IN STOCK</span>

                        <p className="mt-3">
                            Vivamus adipiscing nisl ut dolor dignissim semper. Nulla luctus malesuada tincidunt.
                            Class aptent taciti sociosqu ad litora torquent<br />
                            Vivamus adipiscing nisl ut dolor dignissim semper. Nulla luctus malesuada tincidunt.
                            Class aptent taciti sociosqu ad litora torquent
                        </p>

                        <div className="productSize d-flex align-items-center">
                            <span>Size / Weight:</span>
                            <ul className="list list-inline mb-0 pl-4">
                                {[50, 100, 200, 300, 500].map((value, index) => (
                                    <li className="list-inline-item" key={index}>
                                        <a
                                            className={`tag ${activeSize === index ? 'active' : ''}`}
                                            onClick={() => isActive(index)}
                                        >
                                            {value}g
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="d-flex align-items-center mt-3">
                            <QuantityBox />
                            <Button className="btn-blue btn-lg btn-big btn-round ml-3">
                                <BsCartFill /> &nbsp; Add to cart
                            </Button>
                            <Tooltip title="Add to Wishlist" placement="top">
                                <Button className="btn-blue btn-lg btn-big btn-circle ml-4">
                                    <FaRegHeart />
                                </Button>
                            </Tooltip>
                            <Tooltip title="Add to Compare" placement="top">
                                <Button className="btn-blue btn-lg btn-big btn-circle ml-2">
                                    <MdOutlineCompareArrows />
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                </div>

                <div className="cart mt-5 p-5 detailsPageTabs">
                    <div className='customTabs'>
                        <ul className="list list-inline" role="tablist">
                            {['Description', 'Additional Info', 'Reviews (22)'].map((tab, index) => (
                                <li key={index} className="list-inline-item">
                                    <Button
                                        className={activeTabs === index ? 'active' : ''}
                                        onClick={() => setActiveTabs(index)}
                                    >
                                        {tab}
                                    </Button>
                                </li>
                            ))}
                        </ul>

                        <br />

                        <div className="tabContent">
                            {activeTabs === 0 && (
                                <p>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                                </p>
                            )}
                            {activeTabs === 1 && (

                                <div className='table-responsive'>
                                    <table className="table table-bordered">
                                        <tbody>
                                            <tr className='stand-up'>
                                                <th>Stand Up</th>
                                                <td>35″L x 24″W x 37-45″H(front to back wheel)</td>
                                            </tr>
                                            <tr className='folded-wo-wheels'>
                                                <th>Folded (w/o wheels)</th>
                                                <td>32.5″L x 18.5″W x 16.5″H</td>
                                            </tr>
                                            <tr className='folded-w-wheels'>
                                                <th>Folded (w/ wheels)</th>
                                                <td>32.5″L x 24″W x 18.5″H</td>
                                            </tr>
                                            <tr className='door-pass-through'>
                                                <th>Door Pass Through</th>
                                                <td>Black, Blue, Red, White</td>
                                            </tr>
                                            <tr className='frame'>
                                                <th>Frame</th>
                                                <td>Aluminum</td>
                                            </tr>
                                            <tr className='weight-wo-wheels'>
                                                <th>Weight (w/o wheels)</th>
                                                <td>60 LBS</td>
                                            </tr>
                                            <tr className='weight-capacity'>
                                                <th>Weight Capacity</th>
                                                <td>60 LBS</td>
                                            </tr>
                                            <tr className='width'>
                                                <th>Width</th>
                                                <td>24″</td>
                                            </tr>
                                            <tr className='handle-height-ground-to-handle'>
                                                <th>Handle height (ground to handle)</th>
                                                <td>37-45″</td>
                                            </tr>
                                            <tr className='wheels'>
                                                <th>Wheels</th>
                                                <td>12″ air / wide track slick tread</td>
                                            </tr>
                                            <tr className='seat-back-height'>
                                                <th>Seat back height</th>
                                                <td>21.5″</td>
                                            </tr>
                                            <tr className='head-room-inside-canopy'>
                                                <th>Head room (inside canopy)</th>
                                                <td>25"</td>
                                            </tr>
                                            <tr className='pa_color'>
                                                <th>Color</th>
                                                <td>Black, Blue, Red, White</td>
                                            </tr>
                                            <tr className='pa_size'>
                                                <th>Color</th>
                                                <td>M, S</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>


                            )}
                            {activeTabs === 2 && (
                                <>
                                    <div className='row'>
                                        <div className='col-md-10'>
                                            <h3>Customer questions & answers</h3>
                                            <br />
                                            <div className='reviewBox mb-4 border-bottom'>
                                                <div className='info'>
                                                    <div className='d-flex align-items-center w-100'>
                                                        <h5>Ayxan Musayev</h5>
                                                        <div className='ml-auto'>
                                                            <Rating value={1} readOnly size="small" />
                                                        </div>
                                                    </div>
                                                    <h6 className="text-light">2025-06-21</h6>
                                                    <p>Lorem, ipsum dolor </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <form className='reviewForm'>
                                        <h4>Add a Review</h4>

                                        <div className='form-group'>
                                            <textarea
                                                className='form-control shadow'
                                                placeholder='Write a Review'
                                                name='review'
                                            ></textarea>
                                        </div>

                                        <div className='row'>
                                            <div className='col-md-6'>
                                                <div className='form-group'>
                                                    <Rating
                                                        name='user-rating'
                                                        value={rating}
                                                        precision={0.5}
                                                        onChange={(event, newValue) => {
                                                            setRating(newValue);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className='form-group'>
                                            <Button className='btn-blue btn-lg btn-big btn-round'>
                                                Submit Review
                                            </Button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <RelatedProducts title='RELATED PRODUCTS' />
                <RelatedProducts title='RECENTLY VIEWED PRODUCTS' />
            </div>
        </section>
    );
};

export default ProductDetails;
