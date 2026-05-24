import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "../../services/auth.service";
import Toast from "../../components/ui/Toast/Toast";
import useToast from "../../hooks/useToast";
import haptoLogo from "../../assets/hapto.svg";

import "./ResetPasswordPage.css";

function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const { toast, showToast, hideToast } = useToast();

  const [formData, setFormData] = useState({
    token: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      showToast("Les mots de passe ne correspondent pas.", "error");
      return;
    }

    if (formData.newPassword.length < 8) {
      showToast("Le mot de passe doit faire au moins 8 caractères.", "error");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email, formData.token, formData.newPassword);
      showToast("Mot de passe réinitialisé avec succès !", "success");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      showToast(err.response?.data?.message || "Erreur lors de la réinitialisation.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
      <div className="reset-container">
        <div className="login-logo">
            <a href="/" >
                  <img src={haptoLogo} alt="Hapto Logo" />
                </a>
              <p>Le design sensoriel</p>
          </div>

        <h1>Réinitialisation du mot de passe</h1>
        <p className="reset-subtitle">
          Entrez le code reçu par mail ainsi que votre nouveau mot de passe.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="reset-field">
            <label>Code de réinitialisation</label>
            <input
              type="number"
              name="token"
              placeholder="123456"
              value={formData.token}
              onChange={handleChange}
              required
            />
          </div>

          <div className="reset-field">
            <label>Nouveau mot de passe</label>
            <input
              type="password"
              name="newPassword"
              placeholder="Motdepasse123*$"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="reset-field">
            <label>Confirmer le mot de passe</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="***************"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="reset-btn" disabled={loading}>
            {loading ? "Réinitialisation..." : "Réinitialiser mon mot de passe"}
          </button>
        </form>

        <p className="reset-login">
          Vous vous souvenez de votre mot de passe ?{" "}
          <Link to="/login">Connectez-vous</Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPasswordPage;