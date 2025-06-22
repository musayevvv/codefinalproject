import React from 'react'
import Slider from 'react-slick';
import InnerImageZoom from 'react-inner-image-zoom';
import { useRef } from 'react';
const ProductZoom = () => {

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
        <>
            <div className='productZoom'>       <div className="productZoom position-relative">
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
                </Slider></div>
        </>
    )
}

export default ProductZoom
