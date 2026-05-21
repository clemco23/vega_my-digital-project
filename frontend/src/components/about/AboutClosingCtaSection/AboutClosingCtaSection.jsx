import { Link } from "react-router-dom";
import "./AboutClosingCtaSection.css";

function AboutClosingCtaSection() {
  return (
    <section
      className="about-closing-cta"
      aria-labelledby="about-closing-cta-title"
    >
      <div className="about-closing-cta__inner">
        <div className="about-closing-cta__backdrop" aria-hidden="true">
          HAPTO
        </div>

        <div className="about-closing-cta__content">
          <h2
            className="about-closing-cta__title"
            id="about-closing-cta-title"
          >
            Offrez le meilleur a votre enfant
          </h2>

          <p className="about-closing-cta__description">
            Composez la planche Hapto sur-mesure pour votre enfant, des
            aujourd&apos;hui.
          </p>
        </div>

        <div className="about-closing-cta__divider" aria-hidden="true" />

        <Link to="/" className="about-closing-cta__button">
          Composer ma planche
        </Link>
      </div>
    </section>
  );
}

export default AboutClosingCtaSection;
