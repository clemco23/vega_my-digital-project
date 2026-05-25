import imgHome from "../../assets/img_home.png";
import SiteFooter from "../../components/footer/SiteFooter";
import Navbar from "../../components/navbar/Navbar";
import HomeHeroSection from "../../components/home/HomeHeroSection";
import PageSeo from "../../components/seo/PageSeo";
import Intro from "../../components/home/Intro";
import TouchCta from "../../components/home/TouchCta";
import Banner from "../../components/landing/banner/Banner";
import ModulesMarqueeSection from "../../components/landing/ModulesMarqueeSection/ModulesMarqueeSection";
import CircularEconomySection from "../../components/landing/CircularEconomySection/CircularEconomySection";
import ReassuranceSection from "../../components/landing/ReassuranceSection/ReassuranceSection";
import "./HomePage.css";

const canonicalUrl = "https://haptokids.fr/";
const seoTitle = "HAPTO | Planche sensorielle evolutive en bois pour enfant";
const seoDescription =
  "HAPTO cree des planches sensorielles evolutives en bois pour enfant, avec des modules interchangeables, un design durable et une inspiration Montessori.";
const seoImage = `https://haptokids.fr${imgHome}`;

function HomePage() {
  return (
    <div className="home-page">
      <PageSeo
        title={seoTitle}
        description={seoDescription}
        url={canonicalUrl}
        image={seoImage}
        imageAlt="Planche sensorielle evolutive HAPTO pour enfant"
      />

      <Navbar />

      <main className="home-page__content">
        <HomeHeroSection />
        <Banner />
        <Intro />
        <ModulesMarqueeSection />
        <CircularEconomySection />
        <TouchCta />
        <ReassuranceSection />
      </main>
      <SiteFooter />
    </div>
  );
}

export default HomePage;
