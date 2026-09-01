import './Hero.css'

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-label">THE NEW COLLECTION</p>

        <h1>
          WEAR YOUR
          <br />
          OWN STORY.
        </h1>

        <p className="hero-description">
          Curated pieces for people who
          <br />
          don't follow the ordinary.
        </p>

        <button className="hero-button">
          EXPLORE COLLECTION
        </button>
      </div>
    </section>
  )
}

export default Hero