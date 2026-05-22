import SiteFooter from "../../components/footer/SiteFooter";
import Navbar from "../../components/navbar/Navbar";
import HomeHeroSection from "../../components/home/HomeHeroSection";
import Intro from "../../components/home/Intro";
import TouchCta from "../../components/home/TouchCta";
import Banner from "../../components/landing/banner/Banner";
import ModulesMarqueeSection from "../../components/landing/ModulesMarqueeSection/ModulesMarqueeSection";
import CircularEconomySection from "../../components/landing/CircularEconomySection/CircularEconomySection";
import ReassuranceSection from "../../components/landing/ReassuranceSection/ReassuranceSection";
import "./HomePage.css";

function HomePage() {
  return (
    <div className="home-page">
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
