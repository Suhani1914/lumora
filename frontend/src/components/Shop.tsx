import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "./ProductCard";
import "./Shop.css";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  isNew?: boolean;
};

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("default");

  /* ============================= */
  /* SEARCH */
  /* ============================= */

  const searchQuery =
    searchParams.get("search")?.toLowerCase().trim() || "";

  /* ============================= */
  /* CATEGORY */
  /* ============================= */

  const category =
    searchParams.get("category")?.toUpperCase().trim() || "";

  /* ============================= */
  /* FETCH PRODUCTS */
  /* ============================= */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>(
          "http://localhost:5000/api/products"
        );

        const formattedProducts = response.data.map(
          (product) => ({
            ...product,
            image: `/src/assets/products/${product.image
              .split("/")
              .pop()}`,
          })
        );

        setProducts(formattedProducts);
      } catch (error) {
        console.error(
          "Error fetching products:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ============================= */
  /* CATEGORY CHANGE */
  /* ============================= */

  const handleCategoryChange = (
    selectedCategory: string
  ) => {
    if (selectedCategory === "ALL") {
      searchParams.delete("category");
    } else {
      searchParams.set(
        "category",
        selectedCategory
      );
    }

    setSearchParams(searchParams);
  };

  /* ============================= */
  /* FILTER PRODUCTS */
  /* ============================= */

  let filteredProducts = products.filter(
    (product) => {
      const matchesSearch =
        !searchQuery ||
        product.name
          .toLowerCase()
          .includes(searchQuery) ||
        product.category
          .toLowerCase()
          .includes(searchQuery);

      const matchesCategory =
        !category ||
        product.category.toUpperCase() ===
          category;

      return (
        matchesSearch &&
        matchesCategory
      );
    }
  );

  /* ============================= */
  /* SORT PRODUCTS */
  /* ============================= */

  if (sort === "price-low") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => a.price - b.price
    );
  }

  if (sort === "price-high") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => b.price - a.price
    );
  }

  if (sort === "newest") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) =>
        Number(b.isNew) - Number(a.isNew)
    );
  }

  /* ============================= */
  /* PAGE */
  /* ============================= */

  return (
    <main className="shop-page">

      {/* ============================= */}
      {/* HERO */}
      {/* ============================= */}

      <section className="shop-hero">

        <div className="shop-hero-content">

          <p className="shop-label">
            LUMORA SHOP
          </p>

          <h1>
            Discover
            <br />
            Lumora
          </h1>

          <p className="shop-intro">
            Explore carefully selected
            pieces designed for modern
            everyday living.
          </p>

        </div>

      </section>


      {/* ============================= */}
      {/* SHOP PRODUCTS */}
      {/* ============================= */}

      <section className="shop-products-section">

        {/* ============================= */}
        {/* LOADING */}
        {/* ============================= */}

        {loading ? (

          <div className="shop-loading">
            <p>Loading products...</p>
          </div>

        ) : (

          <>

            {/* ============================= */}
            {/* HEADER */}
            {/* ============================= */}

            <div className="shop-toolbar">

              <div>

                <p className="shop-small-label">
                  {searchQuery
                    ? "SEARCH RESULTS"
                    : "SHOP ALL"}
                </p>

                <h2>
                  {category
                    ? category
                    : searchQuery
                    ? `"${searchQuery}"`
                    : "All Products"}
                </h2>

              </div>

              <p className="product-count">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1
                  ? "PRODUCT"
                  : "PRODUCTS"}
              </p>

            </div>


            {/* ============================= */}
            {/* FILTERS + SORT */}
            {/* ============================= */}

            <div className="shop-controls">

              <div className="category-filters">

                {[
                  "ALL",
                  "JACKETS",
                  "FOOTWEAR",
                  "BAGS",
                  "KNITWEAR",
                ].map((item) => (

                  <button
                    key={item}
                    type="button"
                    className={
                      (!category &&
                        item === "ALL") ||
                      category === item
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      handleCategoryChange(item)
                    }
                  >
                    {item}
                  </button>

                ))}

              </div>


              {/* SORT */}

              <div className="sort-wrapper">

                <label htmlFor="sort">
                  SORT BY
                </label>

                <select
                  id="sort"
                  value={sort}
                  onChange={(e) =>
                    setSort(e.target.value)
                  }
                >

                  <option value="default">
                    Featured
                  </option>

                  <option value="newest">
                    New Arrivals
                  </option>

                  <option value="price-low">
                    Price: Low to High
                  </option>

                  <option value="price-high">
                    Price: High to Low
                  </option>

                </select>

              </div>

            </div>


            {/* ============================= */}
            {/* PRODUCTS */}
            {/* ============================= */}

            {filteredProducts.length > 0 ? (

              <div className="products-grid">

                {filteredProducts.map(
                  (product) => (

                    <ProductCard
                      key={product.id}
                      product={product}
                    />

                  )
                )}

              </div>

            ) : (

              <div className="no-products">

                <h3>
                  No products found
                </h3>

                <p>
                  {searchQuery
                    ? `We couldn't find anything matching "${searchQuery}".`
                    : `There are no products in this collection.`}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    handleCategoryChange("ALL")
                  }
                >
                  VIEW ALL PRODUCTS
                </button>

              </div>

            )}

          </>

        )}

      </section>


      {/* ============================= */}
      {/* BOTTOM CTA */}
      {/* ============================= */}

      {!loading && (
        <section className="shop-cta">

          <p className="shop-small-label">
            LUMORA
          </p>

          <h2>
            Everyday pieces.
            <br />
            Made simply.
          </h2>

        </section>
      )}

    </main>
  );
}

export default Shop;