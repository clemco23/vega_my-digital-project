import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../../services/auth.service";
import Toast from "../../components/ui/Toast/Toast";
import useToast from "../../hooks/useToast";
import "./ForgotPasswordPage.css";

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await forgotPassword(email);
      showToast("Code de réinitialisation envoyé !", "success");
      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 2000);
    } catch (err) {
      showToast(err.response?.data?.message || "Erreur lors de l'envoi.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
      <div className="forgot-container">
        <div className="forgot-logo">
          <img src="/logo.png" alt="Hapto" />
          <p>Le design sensoriel</p>
        </div>

        <h1>Mot de passe oublié</h1>
        <p className="forgot-subtitle">
          Entrez votre adresse mail pour recevoir un code de réinitialisation.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="forgot-field">
            <label>Adresse mail</label>
            <input
              type="email"
              placeholder="hello@haptokids.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="forgot-btn" disabled={loading}>
            {loading ? "Envoi..." : "Envoyer le code"}
          </button>
        </form>

        <p className="forgot-login">
          Vous vous souvenez de votre mot de passe ?{" "}
          <Link to="/login">Connectez-vous</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;