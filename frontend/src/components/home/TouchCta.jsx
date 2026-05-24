import { Link } from "react-router-dom";
import "./TouchCta.css";

function TouchCta() {
  return (
    <section className="touch-cta" aria-labelledby="touch-cta-title">
      <div className="touch-cta__inner">
        <h2 className="touch-cta__title" id="touch-cta-title">
          <span className="touch-cta__title-line">L'attention se cultive</span>
          <span className="touch-cta__title-line touch-cta__title-line--accent">
            par le toucher.
          </span>
        </h2>

        <p className="touch-cta__description">
          <span className="touch-cta__description-line">
            Composez la planche qui correspond a votre enfant. Un cadeau pense
          </span>
          <span className="touch-cta__description-line">
            pour grandir avec lui - de ses premiers gestes a ses plus grandes
          </span>
          <span className="touch-cta__description-line">decouvertes.</span>
        </p>

        <Link to="/la-planche" className="touch-cta__button">
          Composer ma planche
        </Link>
      </div>
    </section>
  );
}

export default TouchCta;
