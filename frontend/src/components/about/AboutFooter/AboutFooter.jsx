import { Link } from "react-router-dom";
import haptoLogo from "../../../assets/hapto.svg";
import "./AboutFooter.css";

const footerColumns = [
  [
    { label: "Accueil", to: "/" },
    { label: "A propos", to: "/about" },
    { label: "Composer ma planche", to: "/login" },
  ],
  [
    { label: "Revendeurs B2B", to: "/" },
    { label: "Blog", to: "/" },
    { label: "Contact", to: "/" },
  ],
];

const legalLinks = [
  { label: "Mentions legales", to: "/" },
  { label: "RGPD", to: "/" },
  { label: "Accessibilite", to: "/" },
];

function AboutFooter() {
  return (
    <footer className="about-footer">
      <div className="about-footer__inner">
        <div className="about-footer__top">
          <div className="about-footer__brand">
            <Link
              to="/"
              className="about-footer__logo"
              aria-label="Retour a l'accueil"
            >
              <img src={haptoLogo} alt="Hapto" />
            </Link>

            <p className="about-footer__tagline">Le design sensoriel</p>
          </div>

          <div className="about-footer__navs" aria-label="Liens du pied de page">
            {footerColumns.map((column, index) => (
              <nav className="about-footer__nav" key={`about-footer-column-${index}`}>
                {column.map((item) => (
                  <Link key={item.label} to={item.to} className="about-footer__link">
                    {item.label}
                  </Link>
                ))}
              </nav>
            ))}
          </div>
        </div>

        <div className="about-footer__bottom">
          <nav className="about-footer__legal" aria-label="Liens legaux">
            {legalLinks.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="about-footer__legal-link"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <p className="about-footer__copyright">
            © 2026 HAPTO - Tous droits reserves
          </p>
        </div>
      </div>
    </footer>
  );
}

export default AboutFooter;
