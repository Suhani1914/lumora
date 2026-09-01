import { Link } from "react-router-dom";
import "./OrderSuccess.css";

function OrderSuccess() {
    const orderNumber =
        "LM-" + Math.floor(100000 + Math.random() * 900000);

    return (
        <section className="order-success-page">

            <div className="order-success-content">

                <p className="success-brand">
                    LUMORA
                </p>

                <div className="success-icon">
                    ✓
                </div>

                <p className="success-label">
                    ORDER CONFIRMED
                </p>

                <h1>
                    Thank You For Your Order
                </h1>

                <p className="success-message">
                    Your order has been placed successfully.
                </p>

                <div className="order-number-box">

                    <p className="order-number-label">
                        ORDER NUMBER
                    </p>

                    <strong className="order-number">
                        {orderNumber}
                    </strong>

                </div>

                <p className="success-thank-you">
                    We appreciate your purchase and hope you enjoy
                    your Lumora collection.
                </p>

                <div className="success-actions">

                    <Link
                        to="/shop"
                        className="continue-shopping-button"
                    >
                        CONTINUE SHOPPING
                    </Link>

                    <Link
                        to="/"
                        className="back-home-button"
                    >
                        BACK TO HOME
                    </Link>

                </div>

            </div>

        </section>
    );
}

export default OrderSuccess;