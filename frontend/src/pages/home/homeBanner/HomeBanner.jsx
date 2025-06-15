import React from 'react'
import Slider from 'react-slick'

const HomeBanner = () => {
    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true
    };
    return (
        <>
            <div className="homeBannerSection">
                <Slider {...settings}>
                    <div className="item">
                        <img src="https://img.freepik.com/free-vector/gradient-horizontal-banner-template-cyber-monday-sale_23-2150815104.jpg?semt=ais_hybrid&w=740" className='w-100' />
                    </div>
                    <div className="item">
                        <img src="https://img.freepik.com/free-vector/gradient-horizontal-banner-template-cyber-monday-sale_23-2150815104.jpg?semt=ais_hybrid&w=740" className='w-100' />
                    </div>
                    <div className="item">
                        <img src="https://img.freepik.com/free-vector/gradient-horizontal-banner-template-cyber-monday-sale_23-2150815104.jpg?semt=ais_hybrid&w=740" className='w-100' />
                    </div>
                    <div className="item">
                        <img src="https://img.freepik.com/free-vector/gradient-horizontal-banner-template-cyber-monday-sale_23-2150815104.jpg?semt=ais_hybrid&w=740" className='w-100' />
                    </div>
                </Slider>
            </div>
        </>
    )
}

export default HomeBanner
