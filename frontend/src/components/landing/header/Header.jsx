import "./Header.css";
import "../../../index.css";
import haptoLogo from "../../../assets/hapto.svg";

function Header() {
  return (
    <header className="landing-header">
      <div className="landing-header__container">
        <a href="/landing-page" className="landing-header__logo">
          <img src={haptoLogo} alt="Hapto Logo" />
        </a>
      </div>
    </header>
  );
}

export default Header;
