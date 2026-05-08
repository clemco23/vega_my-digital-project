import { useState } from "react";
import { subscribeToNewsletter } from "../../services/newsletter.service";

function NewsletterForm() {
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
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Votre adresse email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Inscription..." : "S'inscrire"}
      </button>

      {message && <p>{message}</p>}
    </form>
  );
}

export default NewsletterForm;