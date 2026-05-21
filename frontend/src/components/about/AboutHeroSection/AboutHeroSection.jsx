import aboutEye from "../../../assets/about_eye.png";
import "./AboutHeroSection.css";

function AboutHeroSection() {
  return (
    <section className="about-hero">
      <div className="about-hero__shell">
        <div className="about-hero__copy">
          <p className="about-hero__eyebrow">A PROPOS DE NOUS</p>

          <h1 className="about-hero__title">
            <span className="about-hero__title-line">N&eacute;e d&apos;une</span>
            <span className="about-hero__title-line about-hero__title-line--accent">
              pr&eacute;occupation
            </span>
            <span className="about-hero__title-line">de parents</span>
          </h1>

          <p className="about-hero__description">
            Hapto est n&eacute; d&apos;un constat simple : les enfants
            m&eacute;ritent mieux qu&apos;un &eacute;cran pour s&apos;&eacute;veiller.
            Les jouets doivent s&apos;adapter &agrave; eux et non l&apos;inverse.
          </p>
        </div>

        <div className="about-hero__media">
          <img
            src={aboutEye}
            alt="Gros plan sur l'oeil d'un enfant"
            className="about-hero__image"
          />
        </div>
      </div>
    </section>
  );
}

export default AboutHeroSection;
