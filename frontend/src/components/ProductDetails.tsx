import {
  useEffect,
  useState,
} from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import "./ProductDetails.css";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description?: string;
  isNew?: boolean;
};

const sizes = [
  "S",
  "M",
  "L",
  "XL",
];

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const [product, setProduct] =
    useState<Product | null>(null);

  const [selectedSize, setSelectedSize] =
    useState("L");

  const [loading, setLoading] =
    useState(true);

  const [toast, setToast] =
    useState("");

  /* ================================
     FETCH PRODUCT
  ================================= */

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response =
          await axios.get<Product[]>(
            "http://localhost:5000/api/products"
          );

        const foundProduct =
          response.data.find(
            (item) =>
              item.id === Number(id)
          );

        if (foundProduct) {
          setProduct({
            ...foundProduct,
            image: `/src/assets/products/${foundProduct.image
              .split("/")
              .pop()}`,
          });
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error(
          "Error fetching product:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* ================================
     TOAST
  ================================= */

  const showToast = (
    message: string
  ) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2500);
  };

  /* ================================
     ADD TO CART
  ================================= */

  const handleAddToCart = async () => {
    if (!product) {
      return;
    }

    const token =
      localStorage.getItem(
        "lumora-token"
      );

    /*
      USER NOT LOGGED IN
    */

    if (!token) {
      showToast("Please login first");

      return;
    }

    /*
      ADD PRODUCT
    */

    const success =
      await addToCart(
        product,
        selectedSize
      );

    if (!success) {
      showToast("Please login first");

      return;
    }

    showToast(
      `${product.name} added to bag`
    );
  };

  /* ================================
     LOADING
  ================================= */

  if (loading) {
    return (
      <main className="product-details-page">
        <div className="product-loading">
          Loading product...
        </div>
      </main>
    );
  }

  /* ================================
     PRODUCT NOT FOUND
  ================================= */

  if (!product) {
    return (
      <main className="product-details-page">
        <div className="product-not-found">
          <h2>
            Product not found
          </h2>

          <button
            onClick={() =>
              navigate("/shop")
            }
          >
            BACK TO SHOP
          </button>
        </div>
      </main>
    );
  }

  /* ================================
     PAGE
  ================================= */

  return (
    <main className="product-details-page">

      <section className="product-details">

        {/* ================================
           IMAGE
        ================================= */}

        <div className="product-details-image">

          <img
            src={product.image}
            alt={product.name}
          />

          {product.isNew && (
            <span className="product-new-badge">
              NEW
            </span>
          )}

        </div>


        {/* ================================
           INFORMATION
        ================================= */}

        <div className="product-details-info">

          <p className="product-details-category">
            {product.category}
          </p>

          <h1>
            {product.name}
          </h1>

          <p className="product-details-price">
            ₹{product.price.toLocaleString("en-IN")}
          </p>

          <p className="product-details-description">
            {product.description ||
              "Designed with a focus on modern simplicity, comfort and timeless everyday style. A versatile piece created for the Lumora collection."}
          </p>


          {/* ================================
             SIZE
          ================================= */}

          <div className="size-section">

            <p className="size-label">
              SELECT SIZE
            </p>

            <div className="size-options">

              {sizes.map(
                (size) => (
                  <button
                    key={size}
                    type="button"
                    className={
                      selectedSize === size
                        ? "size-button active"
                        : "size-button"
                    }
                    onClick={() =>
                      setSelectedSize(size)
                    }
                  >
                    {size}
                  </button>
                )
              )}

            </div>

          </div>


          {/* ================================
             ADD TO BAG
          ================================= */}

          <button
            type="button"
            className="add-to-bag-button"
            onClick={
              handleAddToCart
            }
          >
            ADD TO BAG
          </button>

        </div>

      </section>


      {/* ================================
         TOAST
      ================================= */}

      {toast && (
        <div
          className="lumora-toast"
        >
          <div className="toast-icon">
            {toast ===
            "Please login first"
              ? "!"
              : "✓"}
          </div>

          <div className="toast-content">

            <strong>
              {toast ===
              "Please login first"
                ? "LOGIN REQUIRED"
                : "ADDED TO BAG"}
            </strong>

            <p>
              {toast}
            </p>

          </div>
        </div>
      )}

    </main>
  );
}

export default ProductDetails;