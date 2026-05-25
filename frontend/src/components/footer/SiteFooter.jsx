import { Link } from "react-router-dom";
import haptoLogo from "../../assets/hapto.svg";
import { legalPages } from "../../data/legalPages";
import "./SiteFooter.css";

const footerColumns = [
  [
    { label: "Accueil", to: "/" },
    { label: "À propos", to: "/about" },
    { label: "Composer ma planche", to: "/la-planche" },
  ],
  [
    { label: "Revendeurs B2B", to: "/landing-page" },
    { label: "Blog", to: "/blog" },
    { label: "Contact", to: "/contact" },
  ],
];

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <Link
              to="/"
              className="site-footer__logo"
              aria-label="Retour à l&apos;accueil"
            >
              <img src={haptoLogo} alt="Hapto" />
            </Link>
            <p className="site-footer__tagline">Le design sensoriel</p>
          </div>

          <div className="site-footer__navs" aria-label="Liens du pied de page">
            {footerColumns.map((column, index) => (
              <nav className="site-footer__nav" key={`site-footer-column-${index}`}>
                {column.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="site-footer__link"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            ))}
          </div>
        </div>

        <div className="site-footer__bottom">
          <nav className="site-footer__legal" aria-label="Liens légaux">
            {legalPages.map(({ path, label }) => (
              <Link key={path} to={path} className="site-footer__legal-link">
                {label}
              </Link>
            ))}
          </nav>

          <p className="site-footer__copyright">
            © 2026 HAPTO - Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
