import { Link } from "react-router-dom";
import "./About.css";

function About() {
  return (
    <main className="about-page">

      {/* ================= HERO ================= */}

      <section className="about-hero">

        <div className="about-hero-content">

          <p className="about-label">
            ABOUT LUMORA
          </p>

          <h1>
            Designed for
            <br />
            everyday living.
          </h1>

          <p className="about-intro">
            Lumora is a modern fashion brand built around
            simplicity, comfort and timeless everyday style.
          </p>

        </div>

      </section>


      {/* ================= STORY ================= */}

      <section className="about-story">

        <div className="about-story-heading">

          <p className="about-small-label">
            OUR STORY
          </p>

          <h2>
            Less noise.
            <br />
            More style.
          </h2>

        </div>

        <div className="about-story-text">

          <p>
            Lumora was created with a simple idea:
            everyday clothing should feel effortless.
          </p>

          <p>
            We focus on clean silhouettes, thoughtful
            details and versatile pieces that can become
            a natural part of your wardrobe.
          </p>

          <p>
            From outerwear and knitwear to footwear and
            accessories, every collection is designed with
            modern simplicity in mind.
          </p>

        </div>

      </section>


      {/* ================= VALUES ================= */}

      <section className="about-values">

        <div className="about-values-header">

          <p className="about-small-label">
            WHAT WE BELIEVE
          </p>

          <h2>
            Our approach
          </h2>

        </div>

        <div className="about-values-grid">

          <div className="about-value">

            <span>01</span>

            <h3>
              SIMPLICITY
            </h3>

            <p>
              Clean designs that feel natural,
              versatile and easy to wear.
            </p>

          </div>

          <div className="about-value">

            <span>02</span>

            <h3>
              COMFORT
            </h3>

            <p>
              Pieces designed to move naturally
              with your everyday life.
            </p>

          </div>

          <div className="about-value">

            <span>03</span>

            <h3>
              TIMELESSNESS
            </h3>

            <p>
              Thoughtful styles made to remain
              relevant beyond a single season.
            </p>

          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}

      <section className="about-cta">

        <p className="about-small-label">
          DISCOVER LUMORA
        </p>

        <h2>
          Find pieces
          <br />
          made for you.
        </h2>

        <Link
          to="/shop"
          className="about-cta-button"
        >
          EXPLORE THE SHOP
        </Link>

      </section>

    </main>
  );
}

export default About;