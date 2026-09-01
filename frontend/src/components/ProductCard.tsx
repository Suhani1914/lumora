import { Link } from "react-router-dom";
import "./ProductCard.css";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  isNew?: boolean;
};

type ProductCardProps = {
  product: Product;
};

function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-image">
        {product.isNew && <span className="new-badge">NEW</span>}

        <img src={product.image} alt={product.name} />
      </div>

      <div className="product-info">
        <div>
          <p className="product-category">{product.category}</p>
          <h3>{product.name}</h3>
        </div>

        <p className="product-price">₹{product.price}</p>
      </div>
    </Link>
  );
}

export default ProductCard;