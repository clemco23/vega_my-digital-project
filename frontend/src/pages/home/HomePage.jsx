import Navbar from "../../components/navbar/Navbar";
import "./HomePage.css";

function HomePage() {
  return (
    <div className="home-page">
      <Navbar />

      <main className="home-page__content">
        <div className="home-page__placeholder">
          <p className="home-page__eyebrow">HOME PAGE</p>
          <h1>La home du site sera ici.</h1>
          <p>
            La navbar est maintenant un composant separe, independant de la
            landing page et pret a etre reutilise sur les autres pages du site.
          </p>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
