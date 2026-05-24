import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/auth.service";
import { apiBaseUrl } from "../../services/apiBase";
import "./LoginPage.css";
import PasswordInput from "../../components/ui/PasswordInput/PasswordInput";
import haptoLogo from "../../assets/hapto.svg";
import google from "../../assets/google.png"


function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    window.location.href = `${apiBaseUrl}/auth/google`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const data = await login(formData.email, formData.password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.data));
      navigate("/accueil");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la connexion.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-logo">
          <a href="/" >
                    <img src={haptoLogo} alt="Hapto Logo" />
                  </a>
          <p>Le design sensoriel</p>
        </div>

        <h1>Connexion</h1>
        <p className="login-subtitle">
          Entrez vos coordonnées pour accéder à votre compte.
        </p>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label>Adresse mail</label>
            <input
              type="email"
              name="email"
              placeholder="hello@haptokids.fr"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="login-field">
          <PasswordInput
            name="password"
            label="Mot de passe"
            placeholder="*************"
            value={formData.password}
            onChange={handleChange}
            />
          </div>

          <Link to="/forgot-password" className="login-forgot">
            Mot de passe oublié ?
          </Link>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Connexion..." : "Connexion"}
          </button>

          <button
            type="button"
            className="login-google-btn"
            onClick={handleGoogleLogin}
          >
          <img src={google} alt="Google" />
          Continuer avec Google
          </button>
        </form>

        <p className="login-register">
          Pas encore de compte ?{" "}
          <Link to="/register">Inscrivez vous</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
