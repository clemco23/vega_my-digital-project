import { Link } from "react-router-dom";
import imgHome from "../../assets/img_home.png";
import pictoFSC from "../../assets/pictoFSC.svg";
import pictoNorme from "../../assets/pictoNorme.svg";
import pictoTime from "../../assets/pictoTime.svg";
import "./HomeHeroSection.css";

const heroHighlights = [
  {
    icon: pictoNorme,
    label: "Normes CE strictes",
  },
  {
    icon: pictoFSC,
    label: "Bois certifie FSC",
  },
  {
    icon: pictoTime,
    label: "Duree de vie 9 mois-6 ans",
  },
];

function HomeHeroSection() {
  return (
    <section className="home-hero">
      <div className="home-hero__copy">
        <div className="home-hero__content">
          <p className="home-hero__eyebrow">Design sensoriel - Assemble en France</p>

          <h1 className="home-hero__title">
            <span className="home-hero__title-line">Le premier jouet</span>
            <span className="home-hero__title-line home-hero__title-line--accent">
              qui grandit
            </span>
            <span className="home-hero__title-line">avec votre enfant.</span>
          </h1>

          <p className="home-hero__description">
            Une planche d'eveil sensorielle modulaire, eco-concue et inspiree de
            la pedagogie Montessori. Des modules clipsables qui evoluent au rythme
            de votre enfant, au plus loin des ecrans.
          </p>

          <Link to="/la-planche" className="home-hero__cta">
            Composer ma planche
          </Link>

          <ul className="home-hero__highlights" aria-label="Points forts du produit">
            {heroHighlights.map((item) => (
              <li className="home-hero__highlight" key={item.label}>
                <img src={item.icon} alt="" className="home-hero__highlight-icon" />
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="home-hero__media">
        <img
          src={imgHome}
          alt="Un enfant joue a cote d'une boite Hapto posee sur une table"
          className="home-hero__image"
        />
      </div>
    </section>
  );
}

export default HomeHeroSection;
