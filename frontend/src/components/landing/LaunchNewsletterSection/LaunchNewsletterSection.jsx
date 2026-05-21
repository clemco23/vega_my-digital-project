import NewsletterForm from "../../newsletter/NewsletterForm";
import bgHapto from "../../../assets/bg_hapto.png";
import "./LaunchNewsletterSection.css";

function LaunchNewsletterSection() {
  return (
    <section
      className="launch-newsletter-section"
      aria-labelledby="launch-newsletter-title"
    >
      <img
        src={bgHapto}
        alt=""
        aria-hidden="true"
        className="launch-newsletter-section__background"
      />

      <div className="launch-newsletter-section__inner">
        <h2
          id="launch-newsletter-title"
          className="launch-newsletter-section__title"
        >
          Offrez le meilleur &agrave; votre enfant
        </h2>

        <p className="launch-newsletter-section__description">
          Inscrivez-vous d&egrave;s maintenant pour &ecirc;tre inform&eacute;.e
          du lancement
        </p>

        <div className="launch-newsletter-section__form-shell">
          <NewsletterForm
            placeholder="votre@mail.fr"
            submitLabel="ME NOTIFIER"
            loadingLabel="ENVOI..."
          />
        </div>
      </div>
    </section>
  );
}

export default LaunchNewsletterSection;
