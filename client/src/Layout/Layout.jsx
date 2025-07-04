import Home from "../Pages/Home/Home";
import Listing from "../Pages/Listing/Listing.jsx";
import ProductDetails from "../Pages/ProductDetails/ProductDetails";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import ProductModal from "../Components/ProductModal/ProductModal";
import Cart from "../Pages/Cart/Cart";
import SignIn from "../Pages/SignIn/SignIn";
import SignUp from "../Pages/SignUp/SignUp";
import MyList from "../Pages/MyList/MyList";
import Checkout from "../Pages/Checkout/Checkout";
import Orders from "../Pages/Orders/Orders";
import MyAccount from "../Pages/MyAccount/MyAccount";
import SearchPage from "../Pages/Search/Search";
import VerifyOTP from "../Pages/VerifyOTP/VerifyOTP";
import ChangePassword from "../Pages/ChangePassword/ChangePassword";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useContext } from "react";
import MyContext from "../Context/MyContext.jsx";
import NotFound from "../Pages/NotFound/NotFound.jsx";
import { Routes, Route } from "react-router-dom";

function Layout() {
    const { isHeaderFooterShow, isOpenProductModal, productData, alertBox, setAlertBox } = useContext(MyContext);

    const handleClose = (event, reason) => {
        if (reason === "clickaway") return;
        setAlertBox((prev) => ({ ...prev, open: false }));
    };

    return (
        <>
            <Snackbar open={alertBox.open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={alertBox.error ? "error" : "success"} variant="filled" sx={{ width: "100%" }}>
                    {alertBox.msg}
                </Alert>
            </Snackbar>

            {isHeaderFooterShow && <Header />}

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products/category/:id" element={<Listing />} />
                <Route path="/products/subCat/:id" element={<Listing />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/signIn" element={<SignIn />} />
                <Route path="/signUp" element={<SignUp />} />
                <Route path="/my-list" element={<MyList />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/my-account" element={<MyAccount />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/verifyOTP" element={<VerifyOTP />} />
                <Route path="/changePassword" element={<ChangePassword />} />
                <Route path="*" element={<NotFound />} />

            </Routes>

            {isHeaderFooterShow && <Footer />}
            {isOpenProductModal && <ProductModal data={productData} />}
        </>
    );
}

export default Layout