import { useState } from "react";
import { createContactMessage } from "../../services/contact.service";
import "./FormContact.css";
import Button from "../ui/Button";

function ContactForm({
  showToast,
  placeholderN = "Nom et prenom",
  placeholderE = "votre@email.com",
  placeholderC = "Comment pouvons-nous vous aider ?",
  submitLabel = "Envoyer",
  loadingLabel = "Envoi en cours...",
}) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      const data = await createContactMessage(name, email, content);

      showToast?.(
        data.message || "Votre message a bien ete envoye.",
        "success"
      );
      setEmail("");
      setName("");
      setContent("");
    } catch (error) {
      showToast?.(
        error.response?.data?.message ||
          "Erreur lors de l'envoi du message.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-form__field">
        <label className="contact-form__label" htmlFor="contact-name">
          Votre nom
        </label>
        <input
          id="contact-name"
          type="text"
          className="contact-form__input"
          placeholder={placeholderN}
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </div>

      <div className="contact-form__field">
        <label className="contact-form__label" htmlFor="contact-email">
          Adresse e-mail
        </label>
        <input
          id="contact-email"
          type="email"
          className="contact-form__input"
          placeholder={placeholderE}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      <div className="contact-form__field">
        <label className="contact-form__label" htmlFor="contact-message">
          Votre message
        </label>
        <textarea
          id="contact-message"
          className="contact-form__textarea"
          placeholder={placeholderC}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          required
        ></textarea>
      </div>

      <Button
        type="submit"
        className="contact-form__button"
        disabled={isLoading}
      >
        {isLoading ? loadingLabel : submitLabel}
      </Button>
    </form>
  );
}

export default ContactForm;
