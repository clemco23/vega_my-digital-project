import SiteFooter from "../../components/footer/SiteFooter";
import Navbar from "../../components/navbar/Navbar";
import Configurator from "../../components/configurator/Configurator";
import "./BoardPage.css";

function BoardPage() {
  return (
    <div className="board-page">
      <Navbar />

      <main className="board-page__content">
        <Configurator />
      </main>

      <SiteFooter />
    </div>
  );
}

export default BoardPage;
