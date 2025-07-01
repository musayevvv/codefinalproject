import React, { useState, useEffect } from "react";
import MyContext from "./MyContext";
import axios from "axios";
import { fetchDataFromApi, postData } from "../utils/api";

const MyContextProvider = ({ children }) => {
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setselectedCountry] = useState("");
  const [isOpenProductModal, setisOpenProductModal] = useState(false);
  const [isHeaderFooterShow, setisHeaderFooterShow] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [productData, setProductData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [subCategoryData, setsubCategoryData] = useState([]);
  const [addingInCart, setAddingInCart] = useState(false);
  const [cartData, setCartData] = useState();
  const [searchData, setSearchData] = useState([]);
  const [isOpenNav, setIsOpenNav] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [enableFilterTab, setEnableFilterTab] = useState(false);
  const [isOpenFilters, setIsOpenFilters] = useState(false);
  const [isBottomShow, setIsBottomShow] = useState(true);
  const [alertBox, setAlertBox] = useState({
    msg: "",
    error: false,
    open: false,
  });
  const [user, setUser] = useState({
    name: "",
    email: "",
    userId: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.userId) {
      fetchDataFromApi(`/api/cart?userId=${user?.userId}`).then(setCartData);
    }
  }, [isLogin]);

  useEffect(() => {
    getCountry("https://countriesnow.space/api/v0.1/countries/");

    fetchDataFromApi("/api/category").then((res) => {
      setCategoryData(res.categoryList || []);
      const subCatArr = [];
      res.categoryList?.forEach((cat) =>
        cat.children?.forEach((subCat) => subCatArr.push(subCat))
      );
      setsubCategoryData(subCatArr);
    });

    const location = localStorage.getItem("location");
    setselectedCountry(location || "All");
    if (!location) localStorage.setItem("location", "All");

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getCountry = async (url) => {
    const res = await axios.get(url);
    setCountryList(res.data.data);
  };

  const getCartData = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    fetchDataFromApi(`/api/cart?userId=${user?.userId}`).then(setCartData);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLogin(true);
      setUser(JSON.parse(localStorage.getItem("user")));
    } else {
      setIsLogin(false);
    }
  }, [isLogin]);

  const openProductDetailsModal = (id, status) => {
    fetchDataFromApi(`/api/products/${id}`).then((res) => {
      setProductData(res);
      setisOpenProductModal(status);
    });
  };

  const addToCart = (data) => {
    if (isLogin) {
      setAddingInCart(true);
      postData(`/api/cart/add`, data).then((res) => {
        setAlertBox({
          open: true,
          error: !res.status,
          msg: res.status ? "Item is added in the cart" : res.msg,
        });
        setAddingInCart(false);
        if (res.status) getCartData();
      });
    } else {
      setAlertBox({
        open: true,
        error: true,
        msg: "Please login first",
      });
    }
  };

  const values = {
    countryList,
    setselectedCountry,
    selectedCountry,
    isOpenProductModal,
    setisOpenProductModal,
    isHeaderFooterShow,
    setisHeaderFooterShow,
    isLogin,
    setIsLogin,
    user,
    setUser,
    categoryData,
    setCategoryData,
    subCategoryData,
    setsubCategoryData,
    openProductDetailsModal,
    alertBox,
    setAlertBox,
    addToCart,
    addingInCart,
    setAddingInCart,
    cartData,
    setCartData,
    getCartData,
    searchData,
    setSearchData,
    windowWidth,
    isOpenNav,
    setIsOpenNav,
    setEnableFilterTab,
    enableFilterTab,
    setIsOpenFilters,
    isOpenFilters,
    setIsBottomShow,
    isBottomShow,
    productData,
  };

  return <MyContext.Provider value={values}>{children}</MyContext.Provider>;
};

export default MyContextProvider;
