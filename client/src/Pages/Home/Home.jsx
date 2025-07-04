import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import HomeBanner from "../../Components/HomeBanner/HomeBanner";
import ProductItem from "../../Components/ProductItem/ProductItem";
import HomeCat from "../../Components/HomeCat/HomeCat";
import Banners from "../../Components/Banners/Banner";
import Button from "@mui/material/Button";
import { IoIosArrowRoundForward } from "react-icons/io";
import MyContext from "../../Context/MyContext";
import { fetchDataFromApi } from "../../utils/api";
import homeBannerPlaceholder from "../../assets/images/homeBannerPlaceholder.jpg";
import HomeProductRow from "./HomeProductRow/HomeProductRow";
import "./Home.css";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [selectedCat, setSelectedCat] = useState();
  const [filterData, setFilterData] = useState([]);
  const [homeSlides, setHomeSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bannerList, setBannerList] = useState([]);
  const [randomCatProducts, setRandomCatProducts] = useState([]);
  const [homeSideBanners, setHomeSideBanners] = useState([]);
  const [homeBottomBanners, setHomeBottomBanners] = useState([]);

  const context = useContext(MyContext);
  const filterSlider = useRef();

  useEffect(() => {
    window.scrollTo(0, 0);
    context.setisHeaderFooterShow(true);
    context.setEnableFilterTab(false);
    context.setIsBottomShow(true);

    const location = localStorage.getItem("location");
    if (location) {
      fetchDataFromApi(`/api/products/featured?location=${location}`).then(setFeaturedProducts);
      fetchDataFromApi(`/api/products/All?page=1&perPage=16&location=${location}`).then(setProductsData);
    }

    fetchDataFromApi("/api/homeBanner").then(setHomeSlides);
    fetchDataFromApi("/api/banners").then(setBannerList);
    fetchDataFromApi("/api/homeSideBanners").then(setHomeSideBanners);
    fetchDataFromApi("/api/homeBottomBanners").then(setHomeBottomBanners);
  }, []);

  useEffect(() => {
    if (context.categoryData?.length > 0) {
      const firstCat = context.categoryData[0];
      setSelectedCat(firstCat.name);

      const randomIndex = Math.floor(Math.random() * context.categoryData.length);
      const randomCat = context.categoryData[randomIndex];

      fetchDataFromApi(
        `/api/products/catId?catId=${randomCat?.id}&location=${localStorage.getItem("location")}`
      ).then((res) => {
        setRandomCatProducts({
          catName: randomCat?.name,
          catId: randomCat?.id,
          products: res?.products,
        });
      });
    }
  }, [context.categoryData]);

  useEffect(() => {
    if (selectedCat) {
      setIsLoading(true);
      const location = localStorage.getItem("location");
      fetchDataFromApi(`/api/products/catName?catName=${selectedCat}&location=${location}`).then((res) => {
        setFilterData(res.products);
        setIsLoading(false);
        filterSlider?.current?.swiper?.slideTo(0);
      });
    }
  }, [selectedCat]);

  return (
    <>
      {homeSlides?.length > 0 ? (
        <HomeBanner data={homeSlides} />
      ) : (
        <div className="container mt-3">
          <div className="homeBannerSection">
            <img src={homeBannerPlaceholder} className="w-100" alt="placeholder" />
          </div>
        </div>
      )}

      {context.categoryData?.length > 0 && <HomeCat catData={context.categoryData} />}

      <section className="homeProducts pb-0">
        <div className="container">
          <HomeProductRow
            homeSideBanners={homeSideBanners}
            selectedCat={selectedCat}
            setSelectedCat={setSelectedCat}
            filterData={filterData}
            isLoading={isLoading}
            filterSlider={filterSlider}
            productsData={productsData}
            bannerList={bannerList}
          />

          {featuredProducts?.length > 0 && (
            <>
              <div className="d-flex align-items-center mt-4">
                <div className="info">
                  <h3 className="mb-0 hd">Featured Products</h3>
                  <p className="text-light text-sml mb-0">Do not miss the current offers until the end of March.</p>
                </div>
              </div>
              <div className="product_row w-100 mt-2">
                {context.windowWidth > 992 ? (
                  <Swiper
                    slidesPerView={4}
                    spaceBetween={0}
                    navigation
                    slidesPerGroup={3}
                    modules={[Navigation]}
                    className="mySwiper"
                    breakpoints={{
                      300: { slidesPerView: 1, spaceBetween: 5 },
                      400: { slidesPerView: 2, spaceBetween: 5 },
                      600: { slidesPerView: 3, spaceBetween: 5 },
                      750: { slidesPerView: 5, spaceBetween: 5 },
                    }}
                  >
                    {featuredProducts.slice().reverse().map((item, index) => (
                      <SwiperSlide key={index}><ProductItem item={item} /></SwiperSlide>
                    ))}
                    <SwiperSlide style={{ opacity: 0 }}><div className="productItem"></div></SwiperSlide>
                  </Swiper>
                ) : (
                  <div className="productScroller">
                    {featuredProducts.slice().reverse().map((item, index) => (
                      <ProductItem item={item} key={index} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {homeBottomBanners?.length > 0 && <Banners data={homeBottomBanners} col={3} />}
        </div>
      </section>

      <div className="container">
        {randomCatProducts?.products?.length > 0 && (
          <>
            <div className="d-flex align-items-center mt-1 pr-3">
              <div className="info">
                <h3 className="mb-0 hd">{randomCatProducts?.catName}</h3>
                <p className="text-light text-sml mb-0">Do not miss the current offers until the end of March.</p>
              </div>
              <Link to={`/products/category/${randomCatProducts?.catId}`} className="ml-auto">
                <Button className="viewAllBtn">View All <IoIosArrowRoundForward /></Button>
              </Link>
            </div>
            <div className="product_row w-100 mt-2">
              {context.windowWidth > 992 ? (
                <Swiper
                  slidesPerView={5}
                  spaceBetween={0}
                  navigation
                  slidesPerGroup={3}
                  modules={[Navigation]}
                  className="mySwiper"
                  breakpoints={{
                    300: { slidesPerView: 1, spaceBetween: 5 },
                    400: { slidesPerView: 2, spaceBetween: 5 },
                    600: { slidesPerView: 4, spaceBetween: 5 },
                    750: { slidesPerView: 5, spaceBetween: 5 },
                  }}
                >
                  {randomCatProducts.products.slice().reverse().map((item, index) => (
                    <SwiperSlide key={index}><ProductItem item={item} /></SwiperSlide>
                  ))}
                  <SwiperSlide style={{ opacity: 0 }}><div className="productItem"></div></SwiperSlide>
                </Swiper>
              ) : (
                <div className="productScroller">
                  {randomCatProducts.products.slice().reverse().map((item, index) => (
                    <ProductItem item={item} key={index} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Home;
