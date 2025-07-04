import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import { useContext, useEffect, useState } from 'react';
import { MdClose } from "react-icons/md";
import { IoIosHeartEmpty } from "react-icons/io";
import { MdOutlineCompareArrows } from "react-icons/md";
import { IoCartSharp } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";

import MyContext from "../../Context/MyContext";
import QuantityBox from '../QuantityBox/QuantityBox';
import ProductZoom from '../ProductZoom/ProductZoom';
import { fetchDataFromApi, postData } from '../../utils/api';

import './ProductModal.css';

const ProductModal = ({ data }) => {
    const context = useContext(MyContext);

    const [productQuantity, setProductQuantity] = useState(1);
    const [activeSize, setActiveSize] = useState(null);
    const [tabError, setTabError] = useState(false);
    const [isAddedToMyList, setIsAddedToMyList] = useState(false);

    const productId = data?._id || data?.id || "";
    const productRam = data?.productRam || [];
    const productSize = data?.size || [];
    const productWeight = data?.productWeight || [];

    useEffect(() => {
        if (!data) return;

        if (productRam.length === 0 && productSize.length === 0 && productWeight.length === 0) {
            setActiveSize(1);
        }

        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.userId && productId) {
            fetchDataFromApi(`/api/my-list?productId=${productId}&userId=${user.userId}`)
                .then((res) => {
                    if (res?.length > 0) setIsAddedToMyList(true);
                });
        }
    }, [data]);

    const quantityHandler = (val) => setProductQuantity(val);
    const handleSizeClick = (index) => {
        setActiveSize(index);
        setTabError(false);
    };

    const addToCart = () => {
        if (activeSize !== null) {
            const user = JSON.parse(localStorage.getItem("user"));
            const item = {
                productTitle: data?.name,
                image: data?.images?.[0],
                rating: data?.rating,
                price: data?.price,
                quantity: productQuantity,
                subTotal: parseInt(data?.price * productQuantity),
                productId,
                countInStock: data?.countInStock,
                userId: user?.userId,
            };
            context.addToCart(item);
        } else {
            setTabError(true);
        }
    };

    const addToMyList = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.userId) {
            const payload = {
                productTitle: data?.name,
                image: data?.images?.[0],
                rating: data?.rating,
                price: data?.price,
                productId,
                userId: user.userId,
            };
            postData(`/api/my-list/add/`, payload).then((res) => {
                context.setAlertBox({
                    open: true,
                    error: res?.status === false,
                    msg: res?.status === false ? res.msg : "The product was added to your wishlist.",
                });
                if (res?.status !== false) setIsAddedToMyList(true);
            });
        } else {
            context.setAlertBox({ open: true, error: true, msg: "Please login to continue." });
        }
    };

    return (
        <Dialog open={context.isOpenProductModal} className="productModal" onClose={() => context.setisOpenProductModal(false)}>
            <Button className='close_' onClick={() => context.setisOpenProductModal(false)}><MdClose /></Button>

            <h4 className="mb-1 font-weight-bold pr-5">{data?.name}</h4>

            <div className='d-flex align-items-center'>
                <div className='d-flex align-items-center mr-4'>
                    <span>Brand:</span>
                    <span className='ml-2'><b>{data?.brand}</b></span>
                </div>
                <Rating name="read-only" value={parseFloat(data?.rating || 0)} size="small" precision={0.5} readOnly />
            </div>

            <hr />

            <div className='row mt-2 productDetaileModal'>
                <div className='col-md-5'>
                    <ProductZoom images={data?.images || []} discount={data?.discount} />
                </div>

                <div className='col-md-7'>
                    <div className='d-flex info align-items-center mb-3'>
                        <span className='oldPrice lg mr-2'>{data?.oldPrice}$</span>
                        <span className='netPrice text-danger lg'>{data?.price}$</span>
                    </div>

                    <span className="badge bg-success">IN STOCK</span>
                    <p className='mt-3'>{data?.description}</p>

                    {productRam.length > 0 && (
                        <div className='productSize d-flex align-items-center'>
                            <span>RAM:</span>
                            <ul className={`list list-inline mb-0 pl-4 ${tabError ? 'error' : ''}`}>
                                {productRam.map((item, index) => (
                                    <li key={index} className='list-inline-item'>
                                        <a className={`tag ${activeSize === index ? 'active' : ''}`} onClick={() => handleSizeClick(index)}>{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {productSize.length > 0 && (
                        <div className='productSize d-flex align-items-center'>
                            <span>Size:</span>
                            <ul className={`list list-inline mb-0 pl-4 ${tabError ? 'error' : ''}`}>
                                {productSize.map((item, index) => (
                                    <li key={index} className='list-inline-item'>
                                        <a className={`tag ${activeSize === index ? 'active' : ''}`} onClick={() => handleSizeClick(index)}>{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {productWeight.length > 0 && (
                        <div className='productSize d-flex align-items-center'>
                            <span>Weight:</span>
                            <ul className={`list list-inline mb-0 pl-4 ${tabError ? 'error' : ''}`}>
                                {productWeight.map((item, index) => (
                                    <li key={index} className='list-inline-item'>
                                        <a className={`tag ${activeSize === index ? 'active' : ''}`} onClick={() => handleSizeClick(index)}>{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className='d-flex align-items-center actions_'>
                        <QuantityBox quantity={quantityHandler} item={data} />
                        <Button className='btn-blue bg-red btn-lg btn-big btn-round ml-3' onClick={addToCart}>
                            <IoCartSharp />
                            {context.addingInCart ? " Adding..." : " Add to cart"}
                        </Button>
                    </div>

                    <div className='d-flex align-items-center mt-5 actions'>
                        <Button className='btn-round btn-sml' variant="outlined" onClick={addToMyList}>
                            {isAddedToMyList
                                ? (<><FaHeart className="text-danger" /> &nbsp; ADDED TO WISHLIST</>)
                                : (<><IoIosHeartEmpty />&nbsp; ADD TO WISHLIST</>)
                            }
                        </Button>
                        <Button className='btn-round btn-sml ml-3' variant="outlined">
                            <MdOutlineCompareArrows /> &nbsp; COMPARE
                        </Button>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default ProductModal;
