import React, { useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { IoBagCheckOutline } from "react-icons/io5";
import MyContext from "../../Context/MyContext";
import { fetchDataFromApi, postData } from "../../utils/api";
import "./Checkout.css";

const Checkout = () => {
  const [formFields, setFormFields] = useState({
    fullName: "",
    country: "",
    streetAddressLine1: "",
    streetAddressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    email: "",
  });

  const [cartData, setCartData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(true);
  const context = useContext(MyContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    context.setEnableFilterTab(false);
    loadCartData();
  }, []);

  const showError = (msg) =>
    context.setAlertBox({ open: true, error: true, msg });

  const onChangeInput = (e) => {
    setFormFields((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const loadCartData = async () => {
    try {
      setCartLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user?.userId) {
        showError("User not found. Please login again.");
        return;
      }

      const res = await fetchDataFromApi(`/api/cart?userId=${user.userId}`);

      if (Array.isArray(res) && res.length > 0) {
        setCartData(res);
        const total = res.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        setTotalAmount(total);
      } else {
        console.warn("Cart is empty or invalid response:", res);
        setCartData([]);
        setTotalAmount(0);
      }
    } catch (error) {
      console.error("Error loading cart data:", error);
      showError("Failed to load cart data. Please try again.");
      setCartData([]);
      setTotalAmount(0);
    } finally {
      setCartLoading(false);
    }
  };

  const validateForm = () => {
    const requiredFields = [
      { field: "fullName", label: "Full Name" },
      { field: "country", label: "Country" },
      { field: "streetAddressLine1", label: "Street Address" },
      { field: "city", label: "City" },
      { field: "state", label: "State" },
      { field: "zipCode", label: "ZIP Code" },
      { field: "phoneNumber", label: "Phone Number" },
      { field: "email", label: "Email Address" },
    ];

    for (let { field, label } of requiredFields) {
      if (!formFields[field] || formFields[field].trim() === "") {
        showError(`Please fill in ${label}`);
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formFields.email)) {
      showError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const checkout = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (cartData.length === 0) {
      showError("Your cart is empty. Please add items before checkout.");
      return;
    }

    setIsLoading(true);
    try {
      const customerInfo = {
        name: formFields.fullName.trim(),
        phoneNumber: formFields.phoneNumber.replace(/\s+/g, '').replace(/^0/, '+994'),
        address: `${formFields.streetAddressLine1.trim()}, ${formFields.streetAddressLine2.trim()}, ${formFields.city.trim()}, ${formFields.state.trim()}, ${formFields.zipCode.trim()}, ${formFields.country.trim()}`,
        email: formFields.email.trim(),
        zipCode: formFields.zipCode.trim(),
      };

      const items = cartData.map((item) => ({
        productId: item._id || item.productId,
        name: (item.productTitle || item.title || "Unnamed Product").substring(0, 100), 
        quantity: Number(item.quantity),
        price: Number(item.price),
        image: item.image || null,
      }));


      console.log("🛒 Items:", items);
      console.log("📦 Customer Info:", customerInfo);

      localStorage.setItem("cartData", JSON.stringify(cartData));
      localStorage.setItem("customerInfo", JSON.stringify(customerInfo));

      console.log("🛒 Items:", items);
      console.log("📦 Customer Info:", customerInfo);

      const res = await postData("/api/stripe/create-checkout-session", {
        items,
        customerInfo,
      });

      if (res?.url) {
        window.location.href = res.url;
      } else {
        showError("Stripe URL tapılmadı.");
      }
    } catch (error) {
      console.error("Checkout Error:", error);

      let errorMessage = "Payment processing failed. Please try again.";

      if (error.response?.status === 401) {
        errorMessage = "Authentication expired. Please login again.";
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid request. Please check your information.";
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Request timeout. Please check your connection.";
      }

      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) =>
    amount?.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

  if (cartLoading) {
    return (
      <section className="section">
        <div className="container">
          <div className="text-center">
            <p>Loading cart data...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <form className="checkoutForm" onSubmit={checkout}>
          <div className="row">
            <div className="col-md-8">
              <h2 className="hd">BILLING DETAILS</h2>

              <div className="row mt-3">
                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      label="Full Name *"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="fullName"
                      value={formFields.fullName}
                      onChange={onChangeInput}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      label="Country *"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="country"
                      value={formFields.country}
                      onChange={onChangeInput}
                      required
                    />
                  </div>
                </div>
              </div>

              <h6>Street address *</h6>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField
                      label="House number and street name *"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="streetAddressLine1"
                      value={formFields.streetAddressLine1}
                      onChange={onChangeInput}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <TextField
                      label="Apartment, suite, unit, etc. (optional)"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="streetAddressLine2"
                      value={formFields.streetAddressLine2}
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              </div>

              <h6>Town / City *</h6>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField
                      label="City *"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="city"
                      value={formFields.city}
                      onChange={onChangeInput}
                      required
                    />
                  </div>
                </div>
              </div>

              <h6>State / County *</h6>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField
                      label="State *"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="state"
                      value={formFields.state}
                      onChange={onChangeInput}
                      required
                    />
                  </div>
                </div>
              </div>

              <h6>Postcode / ZIP *</h6>

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField
                      label="ZIP Code *"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="zipCode"
                      value={formFields.zipCode}
                      onChange={onChangeInput}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      label="Phone Number *"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="phoneNumber"
                      value={formFields.phoneNumber}
                      onChange={onChangeInput}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      label="Email Address *"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="email"
                      type="email"
                      value={formFields.email}
                      onChange={onChangeInput}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card orderInfo">
                <h4 className="hd">YOUR ORDER</h4>
                <div className="table-responsive mt-3">
                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>

                    <tbody>
                      {cartData.length > 0 ? (
                        cartData.map((item, index) => (
                          <tr key={index}>
                            <td>
                              {item?.productTitle?.substring(0, 20)}
                              {item?.productTitle?.length > 20 ? "..." : ""}{" "}
                              <b>× {item?.quantity}</b>
                            </td>
                            <td>
                              {formatCurrency(item.price * item.quantity)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" className="text-center">
                            No items in cart
                          </td>
                        </tr>
                      )}

                      <tr>
                        <td><strong>Total</strong></td>
                        <td><strong>{formatCurrency(totalAmount)}</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <Button
                  type="submit"
                  className="btn-blue bg-red btn-lg btn-big"
                  disabled={isLoading || cartData.length === 0}
                >
                  {isLoading ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <IoBagCheckOutline /> &nbsp; Checkout
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Checkout;