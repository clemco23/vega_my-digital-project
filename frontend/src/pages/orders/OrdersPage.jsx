import Navbar from "../../components/navbar/Navbar";
import "../home/HomePage.css";

function OrdersPage() {
  return (
    <div className="home-page">
      <Navbar />

      <main className="home-page__content">
        <div className="home-page__placeholder">
          <p className="home-page__eyebrow">COMMANDES</p>
          <h1>Mes commandes</h1>
          <p>
            Cette page est prete pour accueillir l'historique des commandes de
            l'utilisateur.
          </p>
        </div>
      </main>
    </div>
  );
}

export default OrdersPage;
