import Navbar from "../../components/navbar/Navbar";
import "./AboutPage.css";

function AboutPage() {
  return (
    <div className="about-page">
      <Navbar />

      <main className="about-page__content">
        <div className="about-page__placeholder">
          <p className="about-page__eyebrow">ABOUT PAGE</p>
          <h1>La page à propos du site sera ici.</h1>
          <p>
            La navbar est maintenant un composant separe, independant de la
            landing page et pret a etre reutilise sur les autres pages du site.
          </p>
        </div>
      </main>
    </div>
  );
}

export default AboutPage;
