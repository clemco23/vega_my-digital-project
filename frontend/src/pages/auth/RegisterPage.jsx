import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/auth.service";
import { apiBaseUrl } from "../../services/apiBase";
import "./RegisterPage.css";
import PasswordInput from "../../components/ui/PasswordInput/PasswordInput";
import google from "../../assets/google.png"
import hapto from "../../assets/hapto.svg"


function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    firstname: "",
    email: "",
    password: "",
    confirmPassword: "",
    cgv: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleGoogleLogin = () => {
    window.location.href = `${apiBaseUrl}/auth/google`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (!formData.cgv) {
      setError("Vous devez accepter les CGV.");
      return;
    }

    try {
      setLoading(true);
      await register(formData.name, formData.firstname, formData.email, formData.password);
      navigate("/verify-email", { state: { email: formData.email } });
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-logo">
          <img src={hapto} alt="Hapto" />
          <p>Le design sensoriel</p>
        </div>

        <h1>Inscription</h1>
        <p className="register-subtitle">
          Entrez vos coordonnées pour créer votre compte personnel.
        </p>

        {error && <p className="register-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="register-row">
            <div className="register-field">
              <label>Votre nom</label>
              <input
                type="text"
                name="name"
                placeholder="Ex: Petit Explorateur"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="register-field">
              <label>Votre adresse mail</label>
              <input
                type="email"
                name="email"
                placeholder="hello@haptokids.fr"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="register-field">
            <label>Votre prénom</label>
            <input
              type="text"
              name="firstname"
              placeholder="Léo"
              value={formData.firstname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-field">
            <PasswordInput
                name="password"
                label="Mot de passe"
                placeholder="Min. 8 caractères"
                value={formData.password}
                onChange={handleChange}
                />
          </div>

          <div className="register-field">
            <PasswordInput
                name="confirmPassword"
                label="Confirmer votre Mot de passe"
                placeholder="***************"
                value={formData.confirmPassword}
                onChange={handleChange}
            />
          </div>

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? "Chargement..." : "Créer votre compte"}
          </button>

          <div className="register-cgv">
            <input
              type="checkbox"
              name="cgv"
              id="cgv"
              checked={formData.cgv}
              onChange={handleChange}
              img={google}
            />
            <label htmlFor="cgv">
              J'ai lu et accepte les{" "}
              <Link to="/cgv">Conditions Générales de Vente</Link>
            </label>
          </div>
        </form>

        <p className="register-login">
  Vous disposez déjà d'un compte ?{" "}
  <Link to="/login">Connectez-vous</Link>
</p>

<div className="register-socials">
  <button
    type="button"
    className="register-social-btn register-google-btn"
    onClick={handleGoogleLogin}
  >
    <img src={google} alt="Google" className="register-google-icon" />
    Continuer avec Google
  </button>
</div>
        
      </div>
    </div>
  );
}

export default RegisterPage;
