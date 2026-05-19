import Navbar from "../../components/navbar/Navbar";
import "../home/HomePage.css";

function DashboardPage() {
  return (
    <div className="home-page">
      <Navbar />

      <main className="home-page__content">
        <div className="home-page__placeholder">
          <p className="home-page__eyebrow">ADMIN</p>
          <h1>Dashboard</h1>
          <p>
            Cette page est prete pour votre futur dashboard administrateur.
          </p>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
