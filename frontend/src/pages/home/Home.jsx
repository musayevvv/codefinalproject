import React from 'react';
import Button from '@mui/material/Button';
import { IoIosArrowRoundForward } from 'react-icons/io';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import HomeBanner from './homeBanner/HomeBanner';
import ProductItem from './productItem/ProductItem';
import './Home.css';
import HomeCat from './homeCat/HomeCat';
import NewsLetter from './newsLetter/NewsLetter';
import banner1 from '../../image/banner1.png'
import banner2 from '../../image/banner2.png'

const productList = [
    {
        image: 'https://api.spicezgold.com/download/file_1734527033962_ksc-khatushyam-collection-black-pu-for-women-handheld-bag-product-images-rvkg3apiuk-1-202405282358.jpg',
        title: 'Lorem, ipsum dolor sit amet consectetu',
        inStock: true,
        oldPrice: '20.00AZN',
        netPrice: '15.00AZN',
        rating: 5,
        discount: '20%'
    },
    {
        image: 'https://api.spicezgold.com/download/file_1734527033962_ksc-khatushyam-collection-black-pu-for-women-handheld-bag-product-images-rvkg3apiuk-1-202405282358.jpg',
        title: 'Lorem, ipsum dolor sit amet consectetu',
        inStock: true,
        oldPrice: '20.00AZN',
        netPrice: '15.00AZN',
        rating: 5,
        discount: '20%'

    },
    {
        image: 'https://api.spicezgold.com/download/file_1734527033962_ksc-khatushyam-collection-black-pu-for-women-handheld-bag-product-images-rvkg3apiuk-1-202405282358.jpg',
        title: 'Lorem, ipsum dolor sit amet consectetu',
        inStock: true,
        oldPrice: '20.00AZN',
        netPrice: '15.00AZN',
        rating: 5,
        discount: '20%'
    },
    {
        image: 'https://api.spicezgold.com/download/file_1734527033962_ksc-khatushyam-collection-black-pu-for-women-handheld-bag-product-images-rvkg3apiuk-1-202405282358.jpg',
        title: 'Lorem, ipsum dolor sit amet consectetu',
        inStock: true,
        oldPrice: '20.00AZN',
        netPrice: '15.00AZN',
        rating: 5,
        discount: '20%'
    },
    {
        image: 'https://api.spicezgold.com/download/file_1734527033962_ksc-khatushyam-collection-black-pu-for-women-handheld-bag-product-images-rvkg3apiuk-1-202405282358.jpg',
        title: 'Lorem, ipsum dolor sit amet consectetu',
        inStock: true,
        oldPrice: '20.00AZN',
        netPrice: '15.00AZN',
        rating: 5,
        discount: '20%'
    },
    {
        image: 'https://api.spicezgold.com/download/file_1734527033962_ksc-khatushyam-collection-black-pu-for-women-handheld-bag-product-images-rvkg3apiuk-1-202405282358.jpg',
        title: 'Lorem, ipsum dolor sit amet consectetu',
        inStock: true,
        oldPrice: '20.00AZN',
        netPrice: '15.00AZN',
        rating: 5
    },
    {
        image: 'https://api.spicezgold.com/download/file_1734527033962_ksc-khatushyam-collection-black-pu-for-women-handheld-bag-product-images-rvkg3apiuk-1-202405282358.jpg',
        title: 'Lorem, ipsum dolor sit amet consectetu',
        inStock: true,
        oldPrice: '20.00AZN',
        netPrice: '15.00AZN',
        rating: 5
    },
    {
        image: 'https://api.spicezgold.com/download/file_1734527033962_ksc-khatushyam-collection-black-pu-for-women-handheld-bag-product-images-rvkg3apiuk-1-202405282358.jpg',
        title: 'Lorem, ipsum dolor sit amet consectetu',
        inStock: true,
        oldPrice: '20.00AZN',
        netPrice: '15.00AZN',
        rating: 5
    },
    {
        image: 'https://api.spicezgold.com/download/file_1734527033962_ksc-khatushyam-collection-black-pu-for-women-handheld-bag-product-images-rvkg3apiuk-1-202405282358.jpg',
        title: 'Lorem, ipsum dolor sit amet consectetu',
        inStock: true,
        oldPrice: '20.00AZN',
        netPrice: '15.00AZN',
        rating: 5
    },
    {
        image: 'https://api.spicezgold.com/download/file_1734527033962_ksc-khatushyam-collection-black-pu-for-women-handheld-bag-product-images-rvkg3apiuk-1-202405282358.jpg',
        title: 'Lorem, ipsum dolor sit amet consectetu',
        inStock: true,
        oldPrice: '20.00AZN',
        netPrice: '15.00AZN',
        rating: 5
    },
];

const Home = () => {
    return (
        <>
            <HomeBanner />
            <HomeCat />
            <section className="homeProducts">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3">
                            <div className='sticky'>
                                <img src={banner1} className="cursor w-100" alt="" />
                                <img src={banner2} className="cursor w-100 mt-4" alt="" />
                            </div>
                        </div>
                        <div className="col-md-9 productRow">
                            <div className="d-flex align-items-center">
                                <div className="info w-75">
                                    <h3 className="mb-0 hd">BEST SELLERS</h3>
                                    <p className="text-light text-sml mb-0">Do not miss the current offers until the end of July.</p>
                                </div>
                                <Button className="viewAllBtn ml-auto">View All<IoIosArrowRoundForward /></Button>
                            </div>
                            <Swiper slidesPerView={4} spaceBetween={0} navigation={true} slidesPerGroup={3} modules={[Navigation]} className="mySwiper mt-4">
                                {productList.map((product, idx) => (
                                    <SwiperSlide key={idx}>
                                        <ProductItem {...product} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            <div className="d-flex align-items-center mt-5">
                                <div className="info w-75">
                                    <h3 className="mb-0 hd">NEW PRODUCTS</h3>
                                    <p className="text-light text-sml mb-0">Do not miss the current offers until the end of July.</p>
                                </div>
                                <Button className="viewAllBtn ml-auto">View All<IoIosArrowRoundForward /></Button>
                            </div>
                            <div className="product_row d-flex flex-wrap w-100 mt-4">
                                {productList.slice(0, 8).map((product, idx) => (
                                    <ProductItem key={idx} {...product} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <NewsLetter />
        </>
    );
};

export default Home;
