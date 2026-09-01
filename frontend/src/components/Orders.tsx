import { useEffect, useState } from "react";
import "./Orders.css";

// =====================================================
// PRODUCT IMAGES
// =====================================================

const productImages = import.meta.glob(
    "../assets/products/*",
    {
        eager: true,
        query: "?url",
        import: "default",
    }
) as Record<string, string>;


// =====================================================
// TYPES
// =====================================================

type OrderItem = {
    productId: number;
    name: string;
    price: number;
    image: string;
    size: string;
    quantity: number;
};

type Shipping = {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
    state: string;
};

type Order = {
    _id: string;
    items: OrderItem[];
    shipping?: Shipping;
    total: number;
    status: string;
    createdAt: string;
};


// =====================================================
// COMPONENT
// =====================================================

function Orders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);


    // =================================================
    // FETCH ORDERS
    // =================================================

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token =
                    localStorage.getItem("lumora-token");

                // -----------------------------------------
                // NOT LOGGED IN
                // -----------------------------------------

                if (!token) {
                    setError(
                        "Please login to view your orders"
                    );

                    setLoading(false);
                    return;
                }


                // -----------------------------------------
                // API CALL
                // -----------------------------------------

                const response = await fetch(
                    "https://lumora-dtb4.onrender.com/api/orders",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();


                // -----------------------------------------
                // API ERROR
                // -----------------------------------------

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to fetch orders"
                    );
                }


                // -----------------------------------------
                // SAVE ORDERS
                // -----------------------------------------

                setOrders(data);

            } catch (error) {
                console.error(
                    "Orders error:",
                    error
                );

                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to load orders"
                );

            } finally {
                setLoading(false);
            }
        };


        fetchOrders();
    }, []);


    // =================================================
    // GET IMAGE PATH
    // =================================================

    const getImagePath = (image: string) => {
        if (!image) {
            return "";
        }

        const fileName =
            image.split("/").pop();

        if (!fileName) {
            return "";
        }

        const imageEntry =
            Object.entries(productImages).find(
                ([path]) =>
                    path.endsWith(
                        `/${fileName}`
                    )
            );

        return imageEntry
            ? imageEntry[1]
            : "";
    };


    // =================================================
    // LOADING
    // =================================================

    if (loading) {
        return (
            <section className="orders-page">

                <div className="orders-heading">

                    <p className="orders-label">
                        MY ORDERS
                    </p>

                    <h1>
                        Your Orders
                    </h1>

                </div>

                <div className="empty-orders">
                    <p>
                        Loading your orders...
                    </p>
                </div>

            </section>
        );
    }


    // =================================================
    // ERROR
    // =================================================

    if (error) {
        return (
            <section className="orders-page">

                <div className="orders-heading">

                    <p className="orders-label">
                        MY ORDERS
                    </p>

                    <h1>
                        Your Orders
                    </h1>

                </div>

                <div className="empty-orders">
                    <p>
                        {error}
                    </p>
                </div>

            </section>
        );
    }


    // =================================================
    // NO ORDERS
    // =================================================

    if (orders.length === 0) {
        return (
            <section className="orders-page">

                <div className="orders-heading">

                    <p className="orders-label">
                        MY ORDERS
                    </p>

                    <h1>
                        Your Orders
                    </h1>

                </div>

                <div className="empty-orders">

                    <p>
                        No orders yet.
                    </p>

                </div>

            </section>
        );
    }


    // =================================================
    // ORDERS
    // =================================================

    return (
        <section className="orders-page">

            {/* =========================================
                PAGE HEADING
            ========================================= */}

            <div className="orders-heading">

                <p className="orders-label">
                    MY ORDERS
                </p>

                <h1>
                    Your Orders
                </h1>

            </div>


            {/* =========================================
                ORDER LIST
            ========================================= */}

            <div className="orders-list">

                {orders.map((order) => (

                    <div
                        key={order._id}
                        className="order-card"
                    >

                        {/* =================================
                            ORDER HEADER
                        ================================= */}

                        <div className="order-header">

                            <div>

                                <p className="order-number-label">
                                    ORDER
                                </p>

                                <h2>
                                    #{order._id}
                                </h2>

                                <span className="order-status">
                                    {order.status}
                                </span>

                            </div>

                            <p className="order-date">
                                {new Date(
                                    order.createdAt
                                ).toLocaleDateString(
                                    "en-IN",
                                    {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    }
                                )}
                            </p>

                        </div>


                        {/* =================================
                            PRODUCTS
                        ================================= */}

                        <div className="order-products">

                            {order.items.map(
                                (item, index) => {

                                    const image =
                                        getImagePath(
                                            item.image
                                        );

                                    return (
                                        <div
                                            key={`${item.productId}-${item.size}-${index}`}
                                            className="order-item"
                                        >

                                            {/* IMAGE */}

                                            <div className="order-image-wrapper">

                                                {image ? (

                                                    <img
                                                        src={image}
                                                        alt={item.name}
                                                        className="order-item-image"
                                                    />

                                                ) : (

                                                    <div className="order-image-placeholder">
                                                        NO IMAGE
                                                    </div>

                                                )}

                                            </div>


                                            {/* INFORMATION */}

                                            <div className="order-item-info">

                                                <p className="order-item-category">
                                                    LUMORA
                                                </p>

                                                <h3>
                                                    {item.name}
                                                </h3>

                                                <p>
                                                    Size:{" "}
                                                    {item.size}
                                                </p>

                                                <p>
                                                    Quantity:{" "}
                                                    {item.quantity}
                                                </p>

                                            </div>


                                            {/* PRICE */}

                                            <p className="order-item-price">
                                                ₹
                                                {(
                                                    item.price *
                                                    item.quantity
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </p>

                                        </div>
                                    );
                                }
                            )}

                        </div>


                        {/* =================================
                            SHIPPING DETAILS
                        ================================= */}

                        {order.shipping && (

                            <div className="shipping-details">

                                <p className="shipping-label">
                                    SHIPPING DETAILS
                                </p>

                                <div className="shipping-grid">

                                    <div>
                                        <span>
                                            NAME
                                        </span>

                                        <p>
                                            {order.shipping.name}
                                        </p>
                                    </div>

                                    <div>
                                        <span>
                                            EMAIL
                                        </span>

                                        <p>
                                            {order.shipping.email}
                                        </p>
                                    </div>

                                    <div>
                                        <span>
                                            PHONE
                                        </span>

                                        <p>
                                            {order.shipping.phone}
                                        </p>
                                    </div>

                                    <div>
                                        <span>
                                            ADDRESS
                                        </span>

                                        <p>
                                            {order.shipping.address}
                                        </p>
                                    </div>

                                    <div>
                                        <span>
                                            CITY
                                        </span>

                                        <p>
                                            {order.shipping.city}
                                        </p>
                                    </div>

                                    <div>
                                        <span>
                                            STATE
                                        </span>

                                        <p>
                                            {order.shipping.state}
                                        </p>
                                    </div>

                                    <div>
                                        <span>
                                            PINCODE
                                        </span>

                                        <p>
                                            {order.shipping.pincode}
                                        </p>
                                    </div>

                                </div>

                            </div>

                        )}


                        {/* =================================
                            TOTAL
                        ================================= */}

                        <div className="order-footer">

                            <span>
                                TOTAL
                            </span>

                            <strong>
                                ₹
                                {order.total.toLocaleString(
                                    "en-IN"
                                )}
                            </strong>

                        </div>

                    </div>

                ))}

            </div>

        </section>
    );
}

export default Orders;