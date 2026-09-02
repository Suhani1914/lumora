import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./CollectionsCategory.css";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  isNew?: boolean;
};

function CollectionCategory() {
  const { category } = useParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const currentCategory =
    category?.toUpperCase() || "";

  useEffect(() => {
    axios
      .get<Product[]>("https://lumora-dtb4.onrender.com/api/products")
      .then((response) => {

        const formattedProducts = response.data
          .map((product) => ({
            ...product,
            image: `/products/${product.image
              .split("/")
              .pop()}`,
          }))
          .filter(
            (product) =>
              product.category.toUpperCase() === currentCategory
          );

        setProducts(formattedProducts);
      })
      .catch((error) => {
        console.error(
          "Error fetching category products:",
          error
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentCategory]);

  const categoryTitles: Record<string, string> = {
    JACKETS: "Jackets",
    FOOTWEAR: "Footwear",
    BAGS: "Bags",
    KNITWEAR: "Knitwear",
  };

  const title =
    categoryTitles[currentCategory] || "Collection";

  if (loading) {
    return (
      <main className="category-page">

        <div className="category-header">

          <p>COLLECTION</p>

          <h1>
            {title}
          </h1>

        </div>

        <p className="category-loading">
          Loading products...
        </p>

      </main>
    );
  }

  return (
    <main className="category-page">

      {/* ================= HEADER ================= */}

      <section className="category-header">

        <Link
          to="/collections"
          className="back-to-collections"
        >
          ← BACK TO COLLECTIONS
        </Link>

        <p>
          LUMORA COLLECTION
        </p>

        <h1>
          {title}
        </h1>

        <span>
          {products.length} PRODUCTS
        </span>

      </section>


      {/* ================= PRODUCTS ================= */}

      {products.length > 0 ? (

        <section className="category-products-grid">

          {products.map((product) => (

            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="category-product-card"
            >

              <div className="category-product-image">

                <img
                  src={product.image}
                  alt={product.name}
                />

                {product.isNew && (
                  <span className="category-product-new">
                    NEW
                  </span>
                )}

              </div>

              <div className="category-product-info">

                <h2>
                  {product.name}
                </h2>

                <p>
                  ₹{product.price.toLocaleString("en-IN")}
                </p>

              </div>

            </Link>

          ))}

        </section>

      ) : (

        <div className="category-empty">

          <h2>
            Collection not found
          </h2>

          <Link to="/collections">
            BACK TO COLLECTIONS
          </Link>

        </div>

      )}

    </main>
  );
}

export default CollectionCategory;