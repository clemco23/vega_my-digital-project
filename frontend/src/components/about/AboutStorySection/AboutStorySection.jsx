import { Link } from "react-router-dom";
import aboutChildren from "../../../assets/about_children.png";
import "./AboutStorySection.css";

function AboutStorySection() {
  return (
    <section className="about-story" aria-labelledby="about-story-title">
      <div className="about-story__inner">
        <div className="about-story__media">
          <img
            src={aboutChildren}
            alt="Jeune enfant assis sur un canape avec un ecran dans les mains"
            className="about-story__image"
          />
        </div>

        <div className="about-story__content">
          <h2 className="about-story__title" id="about-story-title">
            <span className="about-story__title-line">
              Tout a commenc&eacute; avec un
            </span>
            <span className="about-story__title-line">
              &eacute;cran pos&eacute; sur un canap&eacute;
            </span>
          </h2>

          <p className="about-story__paragraph">
            En 2025, Lorena — cofondatrice de Hapto et jeune maman, pose son
            t&eacute;l&eacute;phone devant son fils de 14 mois &quot;juste
            pour 10 minutes&quot;. Ces 10 minutes deviennent 40. Et la
            culpabilit&eacute; s&apos;installe.
          </p>

          <p className="about-story__paragraph">
            En cherchant une alternative, elle r&eacute;alise que le march&eacute;
            offre deux options : des jouets bas de gamme abandonn&eacute;s en
            une semaine, ou des jouets traditionnels en bois co&ucirc;teux et
            peu stimulants. Aucune option &eacute;volutive.
          </p>

          <p className="about-story__paragraph">
            Avec Cl&eacute;ment, ils d&eacute;cident de concevoir ce qui
            n&apos;existe pas encore : une planche sensorielle vraiment
            modulaire, qui grandit avec l&apos;enfant, en bois, fabriqu&eacute;e
            en France.
          </p>

          <Link to="/" className="about-story__link">
            DECOUVRIR
          </Link>
        </div>
      </div>
    </section>
  );
}

export default AboutStorySection;
