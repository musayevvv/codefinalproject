import React, { useState, useEffect, useRef, useContext } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CircularProgress from "@mui/material/CircularProgress";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";
import ProductItem from "../../../Components/ProductItem/ProductItem";
import Banners from "../../../components/Banners/Banner";
import MyContext from "../../../Context/MyContext";

const HomeProductRow = ({
    bannerList = [],
    homeSideBanners = [],
    productsData = {},
    filterData = [],
    selectedCat,
    setSelectedCat,
    isLoading,
    filterSlider,
}) => {
    const context = useContext(MyContext);
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const selectCat = (cat) => {
        setSelectedCat(cat);
    };

    return (
        <div className="row homeProductsRow">
            <div className="col-md-3">
                <div className="sticky">
                    {homeSideBanners?.length > 0 &&
                        homeSideBanners.map((item, index) => (
                            <div className="banner mb-3" key={index}>
                                {item?.subCatId ? (
                                    <Link to={`/products/subCat/${item?.subCatId}`} className="box">
                                        <img
                                            src={item?.images[0]}
                                            className="w-100 transition"
                                            alt="banner img"
                                        />
                                    </Link>
                                ) : (
                                    <Link to={`/products/category/${item?.catId}`} className="box">
                                        <img
                                            src={item?.images[0]}
                                            className="cursor w-100 transition"
                                            alt="banner img"
                                        />
                                    </Link>
                                )}
                            </div>
                        ))}
                </div>
            </div>
            <div className="col-md-9 productRow">
                <div className="d-flex align-items-center res-flex-column">
                    <div className="info" style={{ width: "35%" }}>
                        <h3 className="mb-0 hd">Popular Products</h3>
                        <p className="text-light text-sml mb-0">
                            Do not miss the current offers until the end of March.
                        </p>
                    </div>

                    <div
                        className="ml-auto d-flex align-items-center justify-content-end res-full"
                        style={{ width: "65%" }}
                    >
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            className="filterTabs"
                        >
                            {context.categoryData?.map((item, index) => (
                                <Tab
                                    key={index}
                                    className="item"
                                    label={item.name}
                                    onClick={() => selectCat(item.name)}
                                />
                            ))}
                        </Tabs>
                    </div>
                </div>
                <div
                    className="product_row w-100 mt-2"
                    style={{ opacity: isLoading ? "0.5" : "1" }}
                >
                    {context.windowWidth > 992 ? (
                        <Swiper
                            ref={filterSlider}
                            slidesPerView={4}
                            spaceBetween={0}
                            navigation={true}
                            slidesPerGroup={3}
                            modules={[Navigation]}
                            className="mySwiper"
                        >
                            {filterData?.length > 0 &&
                                [...filterData].reverse().map((item, index) => (
                                    <SwiperSlide key={index}>
                                        <ProductItem item={item} />
                                    </SwiperSlide>
                                ))}

                            <SwiperSlide style={{ opacity: 0 }}>
                                <div className="productItem"></div>
                            </SwiperSlide>
                        </Swiper>
                    ) : (
                        <div className="productScroller">
                            {filterData?.length > 0 &&
                                [...filterData].reverse().map((item, index) => (
                                    <ProductItem key={index} item={item} />
                                ))}
                        </div>
                    )}
                </div>

                <div className="d-flex align-items-center mt-2">
                    <div className="info w-75">
                        <h3 className="mb-0 hd">NEW PRODUCTS</h3>
                        <p className="text-light text-sml mb-0">
                            New products with updated stocks.
                        </p>
                    </div>
                </div>

                {productsData?.products?.length === 0 && (
                    <div
                        className="d-flex align-items-center justify-content-center"
                        style={{ minHeight: "300px" }}
                    >
                        <CircularProgress />
                    </div>
                )}

                <div className="product_row productRow2 w-100 mt-4 d-flex productScroller ml-0 mr-0">
                    {productsData?.products?.length > 0 &&
                        [...productsData.products].reverse().map((item, index) => (
                            <ProductItem key={index} item={item} />
                        ))}
                </div>

                {bannerList?.length > 0 && <Banners data={bannerList} col={3} />}
            </div>
        </div>
    );
};

export default HomeProductRow;
