import NewsletterForm from "../../newsletter/NewsletterForm";
import HeroBoard from "./HeroBoard";

import "./HeroSection.css";
import "../../../index.css";

import picto1 from "../../../assets/pictoFSC.svg";
import picto2 from "../../../assets/pictoNorme.svg";
import picto3 from "../../../assets/pictoTime.svg";

function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-section__left">
        <div className="hero-section__content">
          <div className="content-title">
            <h1 className="hero-section__title">
              <span className="hero-section__title-line">Le premier jouet</span>
              <span className="hero-section__title-line hero-section__title-line--accent">
                qui grandit
              </span>
              <span className="hero-section__title-line">avec votre enfant.</span>
            </h1>
          </div>

          <div className="content-description">
            <p className="hero-section__description">
              Une planche d&apos;éveil sensorielle modulaire, éco-conçue et
              inspirée de la pédagogie Montessori. Des modules clipsables qui
              évoluent au rythme de votre enfant, de 9 mois à 6 ans.
            </p>
          </div>

          <NewsletterForm
            placeholder="votre@email.com"
            submitLabel="ME NOTIFIER"
            loadingLabel="ENVOI..."
          />

          <ul className="hero-section__highlights">
            <li className="hero-section__highlight-item">
              <img src={picto1} alt="" className="hero-section__highlight-icon" />
              <span>Normes CE strictes</span>
            </li>
            <li className="hero-section__highlight-item">
              <img src={picto2} alt="" className="hero-section__highlight-icon" />
              <span>Bois certifié FSC</span>
            </li>
            <li className="hero-section__highlight-item">
              <img src={picto3} alt="" className="hero-section__highlight-icon" />
              <span>Durée de vie 9 mois - 6 ans</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="hero-section__right">
        <div className="hero-section__visual">
          <HeroBoard />
          <div className="hero-section__badge">30+ modules disponibles</div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
