import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ProductCard from "./ProductCard";
import "./FeaturedProducts.css";

type Product = {
    id: number;
    name: string;
    price: number;
    category: string;
    image: string;
};

function FeaturedProducts() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        axios
            .get<Product[]>("https://lumora-dtb4.onrender.com/api/products")
            .then((response) => {
                setProducts(
                    response.data.map((product) => ({
                        ...product,
                        image: `/products/${product.image
                            .split("/")
                            .pop()}`,
                    }))
                );
            })
            .catch((error) => {
                console.error(
                    "Error fetching featured products:",
                    error
                );
            });
    }, []);

    return (
        <section className="featured-products">
            <div className="featured-header">
                <div>
                    <p>CURATED FOR YOU</p>
                    <h2>
                        FEATURED
                        <br />
                        PRODUCTS
                    </h2>
                </div>

                <Link to="/shop" className="view-all">
                    VIEW ALL →
                </Link>
            </div>

            <div className="products-grid">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>
        </section>
    );
}

export default FeaturedProducts;