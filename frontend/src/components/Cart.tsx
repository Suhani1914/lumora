import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Cart.css";

function Cart() {
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
    } = useCart();

    const total = cartItems.reduce(
        (sum, item) =>
            sum + item.product.price * item.quantity,
        0
    );

    // EMPTY CART
    if (cartItems.length === 0) {
        return (
            <section className="cart-page">
                <div className="empty-cart">
                    <p className="cart-label">
                        YOUR BAG
                    </p>

                    <h1>Your bag is empty</h1>

                    <Link
                        to="/shop"
                        className="continue-shopping"
                    >
                        CONTINUE SHOPPING
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="cart-page">

            {/* HEADER */}
            <div className="cart-header">

                <div>
                    <p className="cart-label">
                        YOUR BAG
                    </p>

                    <h1>SHOPPING BAG</h1>
                </div>

            </div>

            {/* MAIN CONTENT */}
            <div className="cart-content">

                {/* LEFT SIDE */}
                <div className="cart-items">

                    {cartItems.map((item) => (

                        <div
                            className="cart-item"
                            key={`${item.product.id}-${item.size}`}
                        >

                            {/* PRODUCT IMAGE */}
                            <div className="cart-image-wrapper">

                                {item.product.isNew && (
                                    <span className="cart-new-badge">
                                        NEW
                                    </span>
                                )}

                                <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                />

                            </div>

                            {/* PRODUCT INFORMATION */}
                            <div className="cart-item-info">

                                <p className="cart-category">
                                    {item.product.category}
                                </p>

                                <h2>
                                    {item.product.name}
                                </h2>

                                <p className="cart-size">
                                    Size: {item.size}
                                </p>

                                {/* QUANTITY */}
                                <div className="quantity-section">

                                    <span className="quantity-label">
                                        Quantity
                                    </span>

                                    <div className="quantity-controls">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateQuantity(
                                                    item.product.id,
                                                    item.size,
                                                    item.quantity - 1
                                                )
                                            }
                                        >
                                            −
                                        </button>

                                        <span>
                                            {item.quantity}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateQuantity(
                                                    item.product.id,
                                                    item.size,
                                                    item.quantity + 1
                                                )
                                            }
                                        >
                                            +
                                        </button>

                                    </div>

                                </div>

                                {/* ITEM PRICE */}
                                <strong className="cart-item-price">
                                    ₹
                                    {(
                                        item.product.price *
                                        item.quantity
                                    ).toLocaleString("en-IN")}
                                </strong>

                                {/* REMOVE */}
                                <button
                                    className="remove-button"
                                    type="button"
                                    onClick={() =>
                                        removeFromCart(
                                            item.product.id,
                                            item.size
                                        )
                                    }
                                >
                                    REMOVE
                                </button>

                            </div>

                        </div>

                    ))}

                    {/* CONTINUE SHOPPING */}
                    <Link
                        to="/shop"
                        className="continue-shopping-link"
                    >
                        ← &nbsp; CONTINUE SHOPPING
                    </Link>

                </div>

                {/* RIGHT SIDE - SUMMARY */}
                <div className="cart-summary">

                    <p className="summary-label">
                        TOTAL
                    </p>

                    <h2>
                        ₹{total.toLocaleString("en-IN")}
                    </h2>

                    <div className="summary-divider"></div>

                    <Link
                        to="/checkout"
                        className="checkout-button"
                    >
                        CHECKOUT
                    </Link>

                    {/* EXTRA INFORMATION */}
                    <div className="cart-benefits">

                        <div className="benefit">

                            <span className="benefit-icon">
                                ♢
                            </span>

                            <div>
                                <strong>
                                    Secure Checkout
                                </strong>
                            </div>

                        </div>

                        <div className="benefit">

                            <span className="benefit-icon">
                                ♧
                            </span>

                            <div>
                                <strong>
                                    Free Shipping
                                </strong>

                                <p>
                                    On orders above ₹1999
                                </p>
                            </div>

                        </div>

                        <div className="benefit">

                            <span className="benefit-icon">
                                ↻
                            </span>

                            <div>
                                <strong>
                                    Easy Returns
                                </strong>

                                <p>
                                    7-day returns
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}

export default Cart;