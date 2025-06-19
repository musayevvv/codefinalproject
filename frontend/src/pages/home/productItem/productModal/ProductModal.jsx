import Dialog from '@mui/material/Dialog';
import { MdClose } from 'react-icons/md';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Slider from 'react-slick';
import { useRef } from 'react';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/styles.min.css';
import QuantityBox from './quantityBox/QuantityBox';
import { IoIosHeartEmpty } from 'react-icons/io';
import { LiaExchangeAltSolid } from "react-icons/lia";
import './ProductModal.css'

const ProductModal = (props) => {
    const zoomSliderBig = useRef();
    const zoomSlider = useRef();

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        fade: false,
        arrows: true,
    };

    const settings2 = {
        dots: false,
        infinite: false,
        speed: 700,
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: false,
        arrows: false,
    };

    const goto = (index) => {
        zoomSlider.current.slickGoTo(index);
        zoomSliderBig.current.slickGoTo(index);
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
                        <div className="productZoom position-relative">
                            <div className="badge badge-primary">23%</div>
                            <Slider {...settings2} className="zoomSliderBig" ref={zoomSliderBig}>
                                {[
                                    "https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image-62.jpg",
                                    "https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image-47.jpg",
                                    "https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image-35.jpg",
                                ].map((img, idx) => (
                                    <div className="item" key={idx}>
                                        <InnerImageZoom
                                            zoomType="hover"
                                            zoomScale={1}
                                            src={img}
                                        />
                                    </div>
                                ))}
                            </Slider>
                        </div>
                        <Slider {...settings} className="zoomSlider" ref={zoomSlider}>
                            {[
                                "https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image-62.jpg",
                                "https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image-47.jpg",
                                "https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image-35.jpg",
                            ].map((img, idx) => (
                                <div className="item" key={idx}>
                                    <img
                                        src={img}
                                        className="w-100"
                                        onClick={() => goto(idx)}
                                        alt={`Product thumb ${idx}`}
                                    />
                                </div>
                            ))}
                        </Slider>
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
                        <div className='d-flex align-items-center'>
                            <QuantityBox />
                            <Button className='btn-blue btn-lg btn-big btn-round ml-3 '>
                                Add To Cart
                            </Button>
                        </div>


                        <div className='d-flex align-items-center mt-5 actions'>
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
