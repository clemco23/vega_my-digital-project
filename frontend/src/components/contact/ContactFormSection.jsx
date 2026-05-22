import FormContact from "./FormContact";
import "./ContactFormSection.css";

function ContactFormSection({ showToast }) {
  return (
    <section
      className="contact-form-section"
      aria-label="Formulaire de contact"
    >
      <div className="contact-form-section__inner">
        <div className="contact-form-section__form-shell">
          <FormContact showToast={showToast} />
        </div>
      </div>
    </section>
  );
}

export default ContactFormSection;
