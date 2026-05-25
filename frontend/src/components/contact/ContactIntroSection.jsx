import contactChildrenImage from "../../assets/contact_children.png";
import "./ContactIntroSection.css";

function ContactIntroSection() {
  return (
    <section className="contact-intro-section" aria-labelledby="contact-intro-title">
      <div className="contact-intro-section__inner">
        <div className="contact-intro-section__content">
          <h2 className="contact-intro-section__title" id="contact-intro-title">
            <span className="contact-intro-section__title-line">Une question ?</span>
            <span className="contact-intro-section__title-line">
              Contactez-nous.
            </span>
          </h2>

          <p className="contact-intro-section__text">
            Nous sommes à votre écoute pour accompagner chaque étape du
            développement de vos tout-petits avec nos créations artisanales
            françaises.
          </p>
        </div>

        <div className="contact-intro-section__media">
          <img
            src={contactChildrenImage}
            alt="Un enfant joue avec une planche sensorielle"
            className="contact-intro-section__image"
          />
        </div>
      </div>
    </section>
  );
}

export default ContactIntroSection;
