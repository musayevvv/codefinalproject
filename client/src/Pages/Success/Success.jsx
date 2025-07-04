import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import MyContext from "../../Context/MyContext";
import axios from "axios";
import "./Success.css";

const Success = () => {
    const navigate = useNavigate();
    const { setCartItems, setCustomerInfo, setAlertBox } = useContext(MyContext);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");
        const cartData = JSON.parse(localStorage.getItem("cartData")) || [];
        const customerInfo = JSON.parse(localStorage.getItem("customerInfo")) || {};

        const createOrder = async () => {
            try {
                if (!cartData.length) {
                    console.error("❌ No cart data found.");
                    return;
                }

                const products = cartData.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                    subTotal: item.price * item.quantity,
                }));

                const amount = products.reduce((sum, item) => sum + item.subTotal, 0);
                await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/orders/create`,
                    {
                        name: customerInfo.name,
                        phoneNumber: customerInfo.phoneNumber,
                        address: customerInfo.address,
                        email: customerInfo.email,
                        pincode: customerInfo?.zipCode || "0000",
                        amount,
                        paymentId: "stripe_mock_id",
                        userid: user.userId,
                        products,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                await axios.delete(
                    `${import.meta.env.VITE_API_URL}/api/cart/clear/${user.userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setCartItems([]);
                setCustomerInfo(null);
                localStorage.removeItem("cartData");
                localStorage.removeItem("customerInfo");

                setAlertBox({
                    open: true,
                    error: false,
                    msg: "Payment completed successfully!",
                });

                setTimeout(() => {
                    navigate("/orders");
                }, 3000);
            } catch (err) {
                console.error("❌ Order creation failed:", err.response?.data || err.message || err);
                if (err.response?.data?.errors) {
                    console.table(err.response.data.errors);
                }
                setAlertBox({
                    open: true,
                    error: true,
                    msg: "Order could not be completed!",
                });
            }
        };

        createOrder();
    }, []);


    return (
        <div className="success-container">
            <h2>✅ Payment Successful!</h2>
            <p>Your order has been placed. Redirecting...</p>
        </div>
    );
};

export default Success;
