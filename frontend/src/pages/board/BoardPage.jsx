import SiteFooter from "../../components/footer/SiteFooter";
import Navbar from "../../components/navbar/Navbar";
import Configurator from "../../components/configurator/Configurator";
import "./BoardPage.css";
import ModulesMarqueeSection from "../../components/landing/ModulesMarqueeSection/ModulesMarqueeSection";
import RecommendationsSection from "../../components/board/RecommendationsSection/RecommendationsSection";

function BoardPage() {
  return (
    <div className="board-page">
      <Navbar />

      <main className="board-page__content">
        <Configurator />
        <ModulesMarqueeSection />
        <RecommendationsSection />
      </main>

      <SiteFooter />
    </div>
  );
}

export default BoardPage;
