import imgHome from "../../assets/img_home.png";
import SiteFooter from "../../components/footer/SiteFooter";
import Navbar from "../../components/navbar/Navbar";
import Configurator from "../../components/configurator/Configurator";
import PageSeo from "../../components/seo/PageSeo";
import ModulesMarqueeSection from "../../components/landing/ModulesMarqueeSection/ModulesMarqueeSection";
import RecommendationsSection from "../../components/board/RecommendationsSection/RecommendationsSection";
import "./BoardPage.css";

const canonicalUrl = "https://haptokids.fr/la-planche";
const seoTitle = "Planche sensorielle enfant evolutive en bois | HAPTO";
const seoDescription =
  "Composez une planche sensorielle enfant en bois avec des modules interchangeables. Un jouet evolutif inspire Montessori, pense pour durer et assemble en France.";
const seoImage = `https://haptokids.fr${imgHome}`;

function BoardPage() {
  return (
    <div className="board-page">
      <PageSeo
        title={seoTitle}
        description={seoDescription}
        url={canonicalUrl}
        image={seoImage}
        imageAlt="Planche sensorielle enfant HAPTO"
      />

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
