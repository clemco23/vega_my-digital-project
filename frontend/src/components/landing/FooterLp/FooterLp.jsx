import { Link } from "react-router-dom";
import { legalPages } from "../../../data/legalPages";
import "./FooterLp.css";

function FooterLp() {
  return (
    <footer className="footer-lp">
      <div className="footer-lp__inner">
        <div className="footer-lp__brand" aria-label="Hapto">
          <h2 className="footer-lp__logo">{"HAPT\u014C"}</h2>
          <p className="footer-lp__tagline">Le design sensoriel</p>
        </div>

        <div className="footer-lp__meta">
          <nav className="footer-lp__legal-nav" aria-label="Liens legaux">
            {legalPages.map(({ path, label }) => (
              <Link className="footer-lp__legal-link" to={path} key={path}>
                {label}
              </Link>
            ))}
          </nav>

          <p className="footer-lp__copyright">
            {"\u00A9 2026 HAPT\u014C \u2014 TOUS DROITS R\u00C9SERV\u00C9S"}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default FooterLp;
