import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Button from '@mui/material/Button';
import ProductItem from '../../home/productItem/ProductItem';
import { IoIosArrowRoundForward } from 'react-icons/io';

const RelatedProducts = (props) => {
    const productList = [
        {
            image: 'https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image-62.jpg',
            title: 'Product 1',
            inStock: true,
            oldPrice: '$10.00',
            netPrice: '$8.00',
            rating: 4.5,
            discount: '-20%'
        },
        {
            image: 'https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image-47.jpg',
            title: 'Product 2',
            inStock: true,
            oldPrice: '$15.00',
            netPrice: '$12.00',
            rating: 4.0,
            discount: '-15%'
        },
        {
            image: 'https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image-35.jpg',
            title: 'Product 3',
            inStock: false,
            oldPrice: '$25.00',
            netPrice: '$19.99',
            rating: 3.5,
            discount: '-10%'
        },
        {
            image: 'https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image-62.jpg',
            title: 'Product 4',
            inStock: true,
            oldPrice: '$30.00',
            netPrice: '$25.00',
            rating: 5,
            discount: '-17%'
        },
        {
            image: 'https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image-62.jpg',
            title: 'Product 1',
            inStock: true,
            oldPrice: '$10.00',
            netPrice: '$8.00',
            rating: 4.5,
            discount: '-20%'
        },
        {
            image: 'https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image-47.jpg',
            title: 'Product 2',
            inStock: true,
            oldPrice: '$15.00',
            netPrice: '$12.00',
            rating: 4.0,
            discount: '-15%'
        },
        {
            image: 'https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image-35.jpg',
            title: 'Product 3',
            inStock: false,
            oldPrice: '$25.00',
            netPrice: '$19.99',
            rating: 3.5,
            discount: '-10%'
        },
        {
            image: 'https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image-62.jpg',
            title: 'Product 4',
            inStock: true,
            oldPrice: '$30.00',
            netPrice: '$25.00',
            rating: 5,
            discount: '-17%'
        },
    ];

    return (
        <>
            <div className="d-flex align-items-center mt-3">
                <div className="info w-75">
                    <h3 className="mb-0 hd">{props.title}</h3>
                    <p className="text-light text-sml mb-0">
                        Do not miss the current offers until the end of July.
                    </p>
                </div>
                <Button className="viewAllBtn ml-auto">
                    View All <IoIosArrowRoundForward />
                </Button>
            </div>
            <Swiper
                slidesPerView={5}
                spaceBetween={0}
                navigation={true}
                slidesPerGroup={3}
                modules={[Navigation]}
                className="mySwiper mt-3"
            >
                {productList.map((product, idx) => (
                    <SwiperSlide key={idx}>
                        <ProductItem {...product} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    );
};

export default RelatedProducts;
