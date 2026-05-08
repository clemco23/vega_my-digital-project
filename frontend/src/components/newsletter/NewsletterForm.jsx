import { useState } from "react";
import { subscribeToNewsletter } from "../../services/newsletter.service";
import "./newsletterForm.css";
import "../../index.css";
import Button from "../ui/Button";

function NewsletterForm({
  placeholder = "Votre adresse email",
  submitLabel = "S'inscrire",
  loadingLabel = "Inscription...",
}) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      setMessage("");

      const data = await subscribeToNewsletter(email);

      setMessage(data.message);
      setEmail("");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="newsletter-form" onSubmit={handleSubmit}>
      <input
        type="email"
        className="newsletter-form__input"
        placeholder={placeholder}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <Button
        type="submit"
        className="newsletter-form__button"
        disabled={isLoading}
      >
        {isLoading ? loadingLabel : submitLabel}
      </Button>

      {message && <p className="newsletter-form__message">{message}</p>}
    </form>
  );
}

export default NewsletterForm;
