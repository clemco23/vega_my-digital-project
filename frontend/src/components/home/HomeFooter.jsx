import { Link } from "react-router-dom";
import haptoLogo from "../../assets/hapto.svg";
import "./HomeFooter.css";

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

function HomeFooter() {
  return (
    <footer className="home-footer">
      <div className="home-footer__inner">
        <div className="home-footer__top">
          <div className="home-footer__brand">
            <Link to="/" className="home-footer__logo" aria-label="Retour a l'accueil">
              <img src={haptoLogo} alt="Hapto" />
            </Link>
            <p className="home-footer__tagline">Le design sensoriel</p>
          </div>

          <div className="home-footer__navs" aria-label="Liens du pied de page">
            {footerColumns.map((column, index) => (
              <nav className="home-footer__nav" key={`footer-column-${index}`}>
                {column.map((item) => (
                  <Link key={item.label} to={item.to} className="home-footer__link">
                    {item.label}
                  </Link>
                ))}
              </nav>
            ))}
          </div>
        </div>

        <div className="home-footer__bottom">
          <nav className="home-footer__legal" aria-label="Liens legaux">
            {legalLinks.map((item) => (
              <Link key={item.label} to={item.to} className="home-footer__legal-link">
                {item.label}
              </Link>
            ))}
          </nav>

          <p className="home-footer__copyright">
            © 2026 HAPTO - Tous droits reserves
          </p>
        </div>
      </div>
    </footer>
  );
}

export default HomeFooter;
