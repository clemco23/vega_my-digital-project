import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyEmail, resendVerification} from "../../services/auth.service";
import useToast from "../../hooks/useToast";
import Toast from "../../components/ui/Toast/Toast";
import "./VerifyEmailPage.css";
import haptoLogo from "../../assets/hapto.svg";

function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const { toast, showToast, hideToast } = useToast();

  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      await verifyEmail(email, token);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Code invalide.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendVerification(email);
      showToast("Code renvoyé avec succès !", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Erreur lors du renvoi.", "error");
    }
  };
  

  return (
    <div className="verify-page">
        {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
      <div className="verify-container">
         <div className="login-logo">
            <a href="/" >
                      <img src={haptoLogo} alt="Hapto Logo" />
                    </a>
            <p>Le design sensoriel</p>
          </div>

        <h1>Vérification de votre email</h1>
        <p className="verify-subtitle">
          Un code de vérification a été envoyé à <strong>{email}</strong>.
          Entrez-le ci-dessous pour activer votre compte.
        </p>

        {error && <p className="verify-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="verify-field">
            <label>Votre code de vérification</label>
            <input
              type="text"
              placeholder="123456"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="verify-btn" disabled={loading}>
            {loading ? "Vérification..." : "Vérifier mon compte"}
          </button>
        </form>

        <p className="verify-resend">
          Vous n'avez pas reçu le code ?{" "}
          <span className="verify-resend-link" onClick={handleResend}>
            Renvoyer le code
            </span>
        </p>
      </div>
    </div>
  );
}

export default VerifyEmailPage;