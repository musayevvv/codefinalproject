import Dialog from '@mui/material/Dialog';
import { MdClose } from 'react-icons/md';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import 'react-inner-image-zoom/lib/styles.min.css';
import QuantityBox from './quantityBox/QuantityBox';
import { IoIosHeartEmpty } from 'react-icons/io';
import { LiaExchangeAltSolid } from "react-icons/lia";
import './ProductModal.css'
import ProductZoom from './productZoom/ProductZoom';
import { useState } from 'react';
import { IoCartSharp } from "react-icons/io5";

const ProductModal = (props) => {

    const [activeSize, setActiveSize] = useState(null);

    const isActive = (index) => {
        setActiveSize(index);
    };

    return (
        <Dialog
            open={true}
            onClose={props.closeProductModal}
            PaperProps={{ style: { maxWidth: "900px", width: "100%" } }}
        >
            <div className="productModal p-3">
                <Button className="close_" onClick={props.closeProductModal}>
                    <MdClose />
                </Button>

                <h4 className="mb-1 font-weight-bold">
                    All Natural Italian-Style Chicken Meatballs
                </h4>

                <div className="d-flex align-items-center mb-3">
                    <div className="d-flex align-items-center mr-4">
                        <span>Brands:</span>
                        <span className="ml-2"><b>Welch's</b></span>
                    </div>
                    <Rating
                        name="read-only"
                        value={5}
                        size="small"
                        precision={0.5}
                        readOnly
                    />
                </div>

                <div className="row mt-2 productDetaileModal">
                    <div className="col-md-5">
                        <ProductZoom />
                    </div>

                    <div className="col-md-7">
                        <div className="d-flex info align-items-center mb-3">
                            <span className="oldPrice lg mr-2">$9.35</span>
                            <span className="netPrice text-danger lg">$7.25</span>
                        </div>

                        <span className="badge bg-success">IN STOCK</span>

                        <p className="mt-3">
                            Vivamus adipiscing nisl ut dolor dignissim semper.
                            Nulla luctus malesuada tincidunt. Class aptent taciti sociosqu ad litora torquent
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

                        <div className='d-flex align-items-center'>
                            <QuantityBox />
                            <Button className='btn-blue btn-lg btn-big btn-round ml-3 '>
                                <IoCartSharp />Add To Cart
                            </Button>
                        </div>


                        <div className='d-flex align-items-center mt-4 actions'>
                            <Button className='btn-sml btn-round'
                                variant='outlined'>
                                <IoIosHeartEmpty /> Add To Wishlist
                            </Button>
                            <Button className='btn-sml btn-round ml-3'
                                variant='outlined'>
                                <LiaExchangeAltSolid style={{ transform: 'rotate(90deg)' }} />
                                COMPARE
                            </Button>
                        </div>

                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default ProductModal;
