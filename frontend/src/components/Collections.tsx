import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Collections.css";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  isNew?: boolean;
};

function Collections() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH PRODUCTS
  // =========================

  useEffect(() => {
    axios
      .get<Product[]>("https://lumora-dtb4.onrender.com/api/products")
      .then((response) => {
        const formattedProducts = response.data.map((product) => ({
          ...product,

          // Convert backend image path
          // into frontend asset path
          image: `/src/assets/products/${product.image
            .split("/")
            .pop()}`,
        }));

        setProducts(formattedProducts);
      })
      .catch((error) => {
        console.error(
          "Error fetching collection products:",
          error
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // =========================
  // COLLECTION CATEGORIES
  // =========================

  const categories = [
    {
      name: "JACKETS",
      title: "Jackets",
      type: "OUTERWEAR",
      description:
        "Structured silhouettes and modern layers designed for effortless everyday styling.",
    },
    {
      name: "FOOTWEAR",
      title: "Footwear",
      type: "EVERYDAY ESSENTIALS",
      description:
        "Clean and comfortable footwear made for everyday movement and effortless style.",
    },
    {
      name: "BAGS",
      title: "Bags",
      type: "ACCESSORIES",
      description:
        "Minimal accessories designed to complement your everyday wardrobe.",
    },
    {
      name: "KNITWEAR",
      title: "Knitwear",
      type: "ESSENTIALS",
      description:
        "Soft textures and timeless designs created for everyday comfort.",
    },
  ];

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="collections-page">

        <section className="collections-hero">

          <div className="collections-hero-text">

            <p className="collections-label">
              LUMORA COLLECTIONS
            </p>

            <h1>
              Curated
              <br />
              Collections
            </h1>

            <p className="collections-intro">
              Explore our carefully curated collections,
              designed with modern simplicity, comfort and
              timeless everyday style.
            </p>

          </div>

        </section>

        <section className="collections-section">
          <p>Loading collections...</p>
        </section>

      </main>
    );
  }

  // =========================
  // PAGE
  // =========================

  return (
    <main className="collections-page">

      {/* =========================
          HERO
      ========================= */}

      <section className="collections-hero">

        <div className="collections-hero-text">

          <p className="collections-label">
            LUMORA COLLECTIONS
          </p>

          <h1>
            Curated
            <br />
            Collections
          </h1>

          <p className="collections-intro">
            Explore our carefully curated collections,
            designed with modern simplicity, comfort and
            timeless everyday style.
          </p>

        </div>

      </section>


      {/* =========================
          COLLECTIONS
      ========================= */}

      <section className="collections-section">

        <div className="collections-section-header">

          <div>

            <p className="collections-small-label">
              EXPLORE
            </p>

            <h2>
              Our Collections
            </h2>

          </div>

          <p className="collections-header-description">
            Discover pieces created to become part of
            your everyday wardrobe.
          </p>

        </div>


        {/* =========================
            4 COLLECTION CARDS
        ========================= */}

        <div className="collections-grid">

          {categories.map((category) => {

            // Get products belonging to this category
            const categoryProducts = products.filter(
              (product) =>
                product.category.toUpperCase() ===
                category.name
            );

            // Show ONLY the first product
            const featuredProduct = categoryProducts[0];

            if (!featuredProduct) {
              return null;
            }

            return (
              <article
                className="collection-card"
                key={category.name}
              >

                {/* =========================
                    PRODUCT IMAGE
                ========================= */}

                <Link
                  to={`/collections/${category.name}`}
                  className="collection-image-link"
                >

                  <div className="collection-image">

                    <img
                      src={featuredProduct.image}
                      alt={featuredProduct.name}
                    />

                    {featuredProduct.isNew && (
                      <span className="collection-product-new">
                        NEW
                      </span>
                    )}

                    <span className="collection-overlay">
                      {category.name}
                    </span>

                  </div>

                </Link>


                {/* =========================
                    CARD CONTENT
                ========================= */}

                <div className="collection-card-content">

                  <p className="collection-category">
                    {category.type}
                  </p>

                  <h3>
                    {category.title}
                  </h3>

                  <p className="collection-description">
                    {category.description}
                  </p>

                  <Link
                    to={`/collections/${category.name}`}
                    className="collection-link"
                  >
                    VIEW COLLECTION
                    <span>→</span>
                  </Link>

                </div>

              </article>
            );
          })}

        </div>

      </section>


      {/* =========================
          EVERYDAY ESSENTIALS
      ========================= */}

      {products.length > 0 && (
        <section className="essentials-section">

          <div className="essentials-image">

            <img
              src={products[0].image}
              alt="Lumora everyday essentials"
            />

          </div>

          <div className="essentials-content">

            <p className="collections-small-label">
              LUMORA ESSENTIALS
            </p>

            <h2>
              Made for
              <br />
              everyday.
            </h2>

            <p>
              Our essentials collection focuses on
              simple silhouettes, comfortable materials
              and timeless pieces that fit naturally
              into your wardrobe.
            </p>

            <Link
              to="/shop"
              className="essentials-button"
            >
              EXPLORE THE SHOP
            </Link>

          </div>

        </section>
      )}


      {/* =========================
          FINAL CTA
      ========================= */}

      <section className="collections-cta">

        <p className="collections-small-label">
          DISCOVER LUMORA
        </p>

        <h2>
          Find Your
          <br />
          Everyday Style
        </h2>

        <Link
          to="/shop"
          className="collections-cta-button"
        >
          EXPLORE THE SHOP
        </Link>

      </section>

    </main>
  );
}

export default Collections;