import productIntroImage from "../../../assets/productIntroSection.svg";
import ModulesMarqueeSection from "../ModulesMarqueeSection/ModulesMarqueeSection";

import "./ProductIntroSection.css";

function ProductIntroSection() {
  return (
    <section className="product-intro-section">
      <div className="product-intro-section__inner">
        <div className="product-intro-section__media">
          <img
            src={productIntroImage}
            alt="Planche sensorielle modulaire en bois avec plusieurs modules d'eveil"
            className="product-intro-section__image"
          />
        </div>

        <div className="product-intro-section__content">
          <h2 className="product-intro-section__title">
            Un objet conçu pour durer et les faire évoluer loin des écrans.
          </h2>

          <p className="product-intro-section__description">
            Ils grandissent, HAPTŌ s’adapte.  Ajoutez ou remplacez les modules de la planche au fil de leur développement. 
Un objet pensé pour durer, de leurs
premiers gestes à leurs plus grandes découvertes.
          </p>
        </div>
      </div>

      <ModulesMarqueeSection />
    </section>
  );
}

export default ProductIntroSection;
