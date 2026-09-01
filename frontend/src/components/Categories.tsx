import "./Categories.css";

import apparelImg from "../assets/apparel.jpeg";
import footwearImg from "../assets/footwear.jpeg";
import accessoriesImg from "../assets/accessories.jpeg";
import lifestyleImg from "../assets/lifestyle.jpeg";

function Categories() {
  return (
    <section className="categories">
      <div className="categories-header">
        <p>DISCOVER LUMORA</p>
        <h2>
          EXPLORE THE
          <br />
          COLLECTIONS
        </h2>
      </div>

      <div className="category-grid">

        <a href="#apparel" className="category-card apparel">
          <img src={apparelImg} alt="Apparel collection" />

          <div className="category-overlay">
            <span>01</span>
            <h3>APPAREL</h3>
          </div>
        </a>

        <a href="#footwear" className="category-card footwear">
          <img src={footwearImg} alt="Footwear collection" />

          <div className="category-overlay">
            <span>02</span>
            <h3>FOOTWEAR</h3>
          </div>
        </a>

        <a href="#accessories" className="category-card accessories">
          <img src={accessoriesImg} alt="Accessories collection" />

          <div className="category-overlay">
            <span>03</span>
            <h3>ACCESSORIES</h3>
          </div>
        </a>

        <a href="#lifestyle" className="category-card lifestyle">
          <img src={lifestyleImg} alt="Lifestyle collection" />

          <div className="category-overlay">
            <span>04</span>
            <h3>LIFESTYLE</h3>
          </div>
        </a>

      </div>
    </section>
  );
}

export default Categories;