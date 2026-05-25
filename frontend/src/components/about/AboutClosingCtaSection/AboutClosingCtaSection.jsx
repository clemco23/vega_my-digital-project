import { Link } from "react-router-dom";
import bgHapto from "../../../assets/bg_hapto.png";
import "./AboutClosingCtaSection.css";

function AboutClosingCtaSection() {
  return (
    <section
      className="about-closing-cta"
      aria-labelledby="about-closing-cta-title"
    >
      <div className="about-closing-cta__inner">
        <img
          className="about-closing-cta__backdrop"
          src={bgHapto}
          alt=""
          aria-hidden="true"
        />

        <div className="about-closing-cta__content">
          <h2
            className="about-closing-cta__title"
            id="about-closing-cta-title"
          >
            Offrez le meilleur à votre enfant
          </h2>

          <p className="about-closing-cta__description">
            Composez la planche Hapto sur-mesure pour votre enfant, des
            aujourd&apos;hui.
          </p>
        </div>

        <div className="about-closing-cta__divider" aria-hidden="true" />

        <Link to="/la-planche" className="about-closing-cta__button">
          Composer ma planche
        </Link>
      </div>
    </section>
  );
}

export default AboutClosingCtaSection;
