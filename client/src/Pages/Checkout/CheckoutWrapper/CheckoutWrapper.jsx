import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../../../utils/stripe";
import Checkout from "../Checkout";

const CheckoutWrapper = () => {
    return (
        <Elements stripe={stripePromise} options={{ locale: "auto" }}>
            <Checkout />
        </Elements>
    );
};

export default CheckoutWrapper;
