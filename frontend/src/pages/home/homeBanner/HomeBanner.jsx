import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import './HomeBanner.css'

const HomeBanner = () => {
    return (
        <div className="container mt-3">
            <div className="homeBannerSection">
                <Swiper
                    slidesPerView={1}
                    spaceBetween={15}
                    navigation={true}
                    loop={false}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    modules={[Navigation, Autoplay]}
                    className="mySwiper"
                >
                    <SwiperSlide>
                        <div className="item">
                            <img src="https://api.spicezgold.com/download/file_1734525002307_1723967638078_slideBanner1.6bbeed1a0c8ffb494f7c.jpg" className='w-100' />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="item">
                            <img src="https://api.spicezgold.com/download/file_1734524930884_NewProject(6).jpg" className='w-100' />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="item">
                            <img src="https://api.spicezgold.com/download/file_1734525014348_NewProject(7).jpg" className='w-100' />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="item">
                            <img src="https://api.spicezgold.com/download/file_1734524878924_1721277298204_banner.jpg" className='w-100' />
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>
        </div>
    );
};

export default HomeBanner;
