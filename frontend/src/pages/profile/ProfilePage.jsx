import Navbar from "../../components/navbar/Navbar";
import "../home/HomePage.css";

function ProfilePage() {
  return (
    <div className="home-page">
      <Navbar />

      <main className="home-page__content">
        <div className="home-page__placeholder">
          <p className="home-page__eyebrow">PROFIL</p>
          <h1>Modifier mon profil</h1>
          <p>
            Cette page est prete pour votre futur formulaire de profil. Le lien
            est deja branche dans la navbar.
          </p>
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;
