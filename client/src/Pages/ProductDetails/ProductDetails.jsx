// ProductDetails.jsx
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import { BsCartFill } from "react-icons/bs";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { MdOutlineCompareArrows } from "react-icons/md";
import ProductZoom from "../../Components/ProductZoom/ProductZoom";
import QuantityBox from "../../Components/QuantityBox/QuantityBox";
import RelatedProducts from "./RelatedProducts/Related";
import ActiveTabs from "./ActiveTabs/ActiveTabs";
import { fetchDataFromApi, postData } from "../../utils/api";
import MyContext from "../../Context/MyContext";
import "./ProductDetails.css";

const ProductDetails = () => {
  const [activeSize, setActiveSize] = useState(null);
  const [activeTabs, setActiveTabs] = useState(0);
  const [productData, setProductData] = useState([]);
  const [relatedProductData, setRelatedProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reviewsData, setreviewsData] = useState([]);
  const [isAddedToMyList, setSsAddedToMyList] = useState(false);
  const [cartFields, setCartFields] = useState({});
  const [productQuantity, setProductQuantity] = useState();
  const [tabError, setTabError] = useState(false);
  const [rating, setRating] = useState(1);
  const [reviews, setReviews] = useState({
    productId: "",
    customerName: "",
    customerId: "",
    review: "",
    customerRating: 1,
  });

  const { id } = useParams();
  const context = useContext(MyContext);

  const isActive = (index) => {
    setActiveSize(index);
    setTabError(false);
  };

  useEffect(() => {
    if (!id) return;
    window.scrollTo(0, 0);
    setActiveSize(null);

    fetchDataFromApi(`/api/products/${id}`).then((res) => {
      setProductData(res);
      if (res?.productRam?.length === 0 && res?.productWeight?.length === 0 && res?.size?.length === 0) {
        setActiveSize(1);
      }

      fetchDataFromApi(`/api/products/subCatId?subCatId=${res?.subCatId}&location=${localStorage.getItem("location")}`)
        .then((res) => {
          const filteredData = res?.products?.filter((item) => item.id !== id);
          setRelatedProductData(filteredData);
        });
    });

    fetchDataFromApi(`/api/productReviews?productId=${id}`).then((res) => {
      setreviewsData(res);
    });

    const user = JSON.parse(localStorage.getItem("user"));
    fetchDataFromApi(`/api/my-list?productId=${id}&userId=${user?.userId}`).then((res) => {
      if (res.length !== 0) setSsAddedToMyList(true);
    });

    context.setEnableFilterTab(false);
  }, [id]);

  const onChangeInput = (e) => {
    setReviews({ ...reviews, [e.target.name]: e.target.value });
  };

  const changeRating = (e) => {
    setRating(e.target.value);
    setReviews((prev) => ({ ...prev, customerRating: e.target.value }));
  };

  const addReview = (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      context.setAlertBox({ open: true, error: true, msg: "Please Login first" });
      return;
    }
    if (reviews.review.trim() === "") {
      context.setAlertBox({ open: true, error: true, msg: "Please add a Review" });
      return;
    }
    const newReview = {
      ...reviews,
      customerName: user?.name,
      customerId: user?.userId,
      productId: id,
    };
    setIsLoading(true);
    postData("/api/productReviews/add", newReview).then(() => {
      setIsLoading(false);
      setReviews({ review: "", customerRating: 1 });
      fetchDataFromApi(`/api/productReviews?productId=${id}`).then(setreviewsData);
    });
  };

  const quantity = (val) => setProductQuantity(val);

  const addtoCart = () => {
    if (activeSize === null) return setTabError(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const fields = {
      productTitle: productData?.name,
      image: productData?.images[0],
      rating: productData?.rating,
      price: productData?.price,
      quantity: productQuantity,
      subTotal: parseInt(productData?.price * productQuantity),
      productId: productData?.id,
      countInStock: productData?.countInStock,
      userId: user?.userId,
    };
    setCartFields(fields);
    context.addToCart(fields);
  };

  const gotoReviews = () => {
    window.scrollTo({ top: 550, behavior: "smooth" });
    setActiveTabs(2);
  };

  const addToMyList = (id) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return context.setAlertBox({ open: true, error: true, msg: "Please Login to continue" });

    const data = {
      productTitle: productData?.name,
      image: productData?.images[0],
      rating: productData?.rating,
      price: productData?.price,
      productId: id,
      userId: user?.userId,
    };

    postData(`/api/my-list/add/`, data).then((res) => {
      if (res.status !== false) {
        context.setAlertBox({ open: true, error: false, msg: "the product added in my list" });
        fetchDataFromApi(`/api/my-list?productId=${id}&userId=${user?.userId}`).then((res) => {
          if (res.length !== 0) setSsAddedToMyList(true);
        });
      } else {
        context.setAlertBox({ open: true, error: true, msg: res.msg });
      }
    });
  };

  return (
    <section className="productDetails section">
      <div className="container">
        {productData?.length === 0 ? (
          <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "300px" }}>
            <CircularProgress />
          </div>
        ) : (
          <div className="row">
            <div className="col-md-4 pl-5 part1">
              <ProductZoom images={productData?.images} discount={productData?.discount} />
            </div>
            <div className="col-md-7 pl-5 pr-5 part2">
              <h2 className="hd text-capitalize">{productData?.name}</h2>
              <ul className="list list-inline d-flex align-items-center">
                <li className="list-inline-item">
                  <span className="text-light mr-2">Brands : </span>
                  <span>{productData?.brand}</span>
                </li>
                <li className="list-inline-item">
                  <Rating
                    name="read-only"
                    value={parseInt(productData?.rating)}
                    precision={0.5}
                    readOnly
                    size="small"
                  />
                  <span className="text-light cursor ml-2" onClick={gotoReviews}>
                    {reviewsData?.length} Review
                  </span>
                </li>
              </ul>
              <div className="d-flex info mb-3">
                <span className="oldPrice">{productData?.oldPrice}$</span>
                <span className="netPrice text-danger ml-2">{productData?.price}$</span>
              </div>
              <span className={`badge ${productData?.countInStock >= 1 ? "badge-success" : "badge-danger"}`}>
                {productData?.countInStock >= 1 ? "IN STOCK" : "OUT OF STOCK"}
              </span>
              <p className="mt-3">{productData?.description}</p>

              <QuantityBox quantity={quantity} item={productData} selectedItem={() => { }} />

              <div className="d-flex align-items-center mt-3 actions_">
                <Button className="btn-blue btn-lg btn-big btn-round bg-red" onClick={addtoCart}>
                  <BsCartFill /> &nbsp; {context.addingInCart ? "adding..." : " Add to cart"}
                </Button>

                <Tooltip title={isAddedToMyList ? "Added to Wishlist" : "Add to Wishlist"} placement="top">
                  <Button className="btn-blue btn-lg btn-big btn-circle ml-4" onClick={() => addToMyList(id)}>
                    {isAddedToMyList ? <FaHeart className="text-danger" /> : <FaRegHeart />}
                  </Button>
                </Tooltip>

                <Tooltip title="Add to Compare" placement="top">
                  <Button className="btn-blue btn-lg btn-big btn-circle ml-2">
                    <MdOutlineCompareArrows />
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>
        )}

        <br />
        <ActiveTabs
          activeTabs={activeTabs}
          setActiveTabs={setActiveTabs}
          productData={productData}
          reviewsData={reviewsData}
          reviews={reviews}
          rating={rating}
          isLoading={isLoading}
          onChangeInput={onChangeInput}
          changeRating={changeRating}
          addReview={addReview}
        />
        <br />

        {relatedProductData?.length !== 0 && <RelatedProducts title="RELATED PRODUCTS" data={relatedProductData} />}
      </div>
    </section>
  );
};

export default ProductDetails;
