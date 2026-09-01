import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import "./Checkout.css";

function Checkout() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    state: "",
  });

  const [error, setError] = useState("");

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setError("");
  };

  const handlePlaceOrder = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const {
      name,
      email,
      phone,
      address,
      city,
      pincode,
      state,
    } = formData;

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    const phonePattern = /^[6-9]\d{9}$/;

    if (!phonePattern.test(phone)) {
      setError(
        "Please enter a valid 10-digit Indian phone number."
      );
      return;
    }

    if (!address.trim()) {
      setError("Please enter your address.");
      return;
    }

    if (!city.trim()) {
      setError("Please enter your city.");
      return;
    }

    if (!pincode.trim()) {
      setError("Please enter your pincode.");
      return;
    }

    const pincodePattern = /^\d{6}$/;

    if (!pincodePattern.test(pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }

    if (!state.trim()) {
      setError("Please enter your state.");
      return;
    }

    const token = localStorage.getItem("lumora-token");

    if (!token) {
      setError("Please login before placing your order.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name,
            email,
            phone,
            address,
            city,
            pincode,
            state,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Failed to place order."
        );
        return;
      }

      clearCart();

      navigate("/order-success");
    } catch (error) {
      console.error("Place order error:", error);

      setError(
        "Unable to connect to the server."
      );
    }
  };

  if (cartItems.length === 0) {
    return (
      <section className="checkout-page">
        <p className="checkout-label">
          CHECKOUT
        </p>

        <h1>Your bag is empty</h1>

        <Link
          to="/shop"
          className="checkout-back"
        >
          CONTINUE SHOPPING
        </Link>
      </section>
    );
  }

  return (
    <section className="checkout-page">

      <div className="checkout-header">

        <div>
          <p className="checkout-label">
            CHECKOUT
          </p>

          <h1>
            Complete Your Order
          </h1>
        </div>

        <Link
          to="/cart"
          className="back-to-bag"
        >
          ← BACK TO BAG
        </Link>

      </div>

      <div className="checkout-content">

        {/* FORM */}

        <form
          className="checkout-form"
          onSubmit={handlePlaceOrder}
        >

          <h2>
            CONTACT INFORMATION
          </h2>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />

          <h2>
            SHIPPING ADDRESS
          </h2>

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />

          <div className="form-row">

            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
            />

            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={formData.pincode}
              onChange={handleChange}
            />

          </div>

          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
          />

          <h2>
            PAYMENT
          </h2>

          <div className="payment-box">
            <p>
              Cash on Delivery
            </p>

            <span>
              Pay when your order arrives.
            </span>
          </div>

          {error && (
            <p className="checkout-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="place-order"
          >
            PLACE ORDER
          </button>

        </form>


        {/* ORDER SUMMARY */}

        <div className="order-summary">

          <p className="summary-label">
            YOUR ORDER
          </p>

          {cartItems.map((item) => (

            <div
              className="summary-item"
              key={`${item.product.id}-${item.size}`}
            >

              <img
                src={item.product.image}
                alt={item.product.name}
              />

              <div className="summary-product-info">

                <h3>
                  {item.product.name}
                </h3>

                <p>
                  Size: {item.size}
                </p>

                <p>
                  Quantity: {item.quantity}
                </p>

              </div>

              <strong>
                ₹
                {(
                  item.product.price *
                  item.quantity
                ).toLocaleString("en-IN")}
              </strong>

            </div>

          ))}

          <div className="summary-total">

            <span>
              TOTAL
            </span>

            <strong>
              ₹{total.toLocaleString("en-IN")}
            </strong>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Checkout;