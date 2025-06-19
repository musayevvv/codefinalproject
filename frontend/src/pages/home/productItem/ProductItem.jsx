import React, { useState } from 'react';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import { TfiFullscreen } from 'react-icons/tfi';
import { IoMdHeartEmpty } from 'react-icons/io';
import ProductModal from './productModal/ProductModal';
import './ProductItem.css'

const ProductItem = ({ image, title, inStock, oldPrice, netPrice, rating, discount, itemView }) => {
    const [isOpenProductModal, setIsOpenProductModal] = useState(false);

    return (
        <>
            <div className={`productItem ${itemView}`}>
                <div className="imgWrapper">
                    <img src={image} className="w-100" alt={title} />
                    {discount && <span className="badge badge-primary">{discount}</span>}
                    <div className="actions">
                        <Button onClick={() => setIsOpenProductModal(true)}><TfiFullscreen /></Button>
                        <Button><IoMdHeartEmpty /></Button>
                    </div>
                </div>
                <div className="info">
                    <h4>{title}</h4>
                    <span className="text-success d-block">{inStock ? 'In Stock' : 'Out of Stock'}</span>
                    <Rating name="read-only" value={rating} readOnly size="small" precision={0.5} className="mt-2 mb-2" />
                    <div className="d-flex">
                        <span className="oldPrice">{oldPrice}</span>
                        <span className="netPrice text-danger ml-2">{netPrice}</span>
                    </div>
                </div>
            </div>
            {isOpenProductModal && <ProductModal closeProductModal={() => setIsOpenProductModal(false)} />}
        </>
    );
};

export default ProductItem;