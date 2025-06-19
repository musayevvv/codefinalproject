import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import './HomeCat.css'
const HomeCat = () => {

    const [itemBg, setitemBg] = useState([
        '#fffceb',
        '#ecffec',
        '#feefea',
        '#fff3eb',
        '#f2fcf4',
        '#f2fcf4',
        '#feeefa',
        '#fffceb',
        '#feeefa',
        '#ecffec',
        '#feeefa',
        '#fff3eb',
        '#fff3ff',
        '#f2fcf4',
        '#feeefa',
        '#fffceb',
        '#feeefa',
        '#ecffec'
    ])

    return (
        <>
            <section className='homeCat'>
                <div className="container">
                    <h3 className='mb-3 hd'>FEATURED CATEGORIES</h3>
                    <Swiper
                        slidesPerView={10}
                        spaceBetween={8}
                        navigation={true}
                        slidesPerGroup={3}
                        modules={[Navigation]}
                        className="mySwiper"
                    >

                        {itemBg?.map((item, index) => (
                            <SwiperSlide>
                                <div className="item text-center cursor" style={{ background: item }}>
                                    <img src="https://wp.alithemes.com/html/nest/demo/assets/imgs/shop/cat-9.png" alt="" />
                                    <h6>Red Apple</h6>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>
        </>
    )
}

export default HomeCat
