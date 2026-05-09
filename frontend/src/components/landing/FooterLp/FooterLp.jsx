import "./FooterLp.css";

function FooterLp() {
  return (
    <footer className="footer-lp">
      <div className="footer-lp__inner">
        <div className="footer-lp__brand" aria-label="Hapto">
          <h2 className="footer-lp__logo">HAPTŌ</h2>
          <p className="footer-lp__tagline">Le design sensoriel</p>
        </div>

        <p className="footer-lp__copyright">
          © 2026 HAPTŌ — TOUS DROITS RÉSERVÉS
        </p>
      </div>
    </footer>
  );
}

export default FooterLp;
