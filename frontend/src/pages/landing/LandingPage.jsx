import Banner from "../../components/landing/banner/Banner";
import CircularEconomySection from "../../components/landing/CircularEconomySection/CircularEconomySection";
import FooterLp from "../../components/landing/FooterLp/FooterLp";
import Header from "../../components/landing/header/Header";
import HeroSection from "../../components/landing/HeroSection/HeroSection";
import LaunchNewsletterSection from "../../components/landing/LaunchNewsletterSection/LaunchNewsletterSection";
import ProductIntroSection from "../../components/landing/ProductIntroSection/ProductIntroSection";
import ReassuranceSection from "../../components/landing/ReassuranceSection/ReassuranceSection";
// import ModelsSection from "../components/landing/ModelsSection/ModelsSection";
// import ValuesSection from "../components/landing/ValuesSection/ValuesSection";
// import Footer from "../components/landing/Footer/Footer";
import "./LandingPage.css";

function LandingPage() {
  return (
    <div className="landing-page">
      <Header />
      <HeroSection />
      <Banner />
      <ProductIntroSection />
      <CircularEconomySection />
      <LaunchNewsletterSection />
      <ReassuranceSection />
      <FooterLp />
      {/* <ModelsSection />
      <ValuesSection />
      */}
    </div>
  );
}

export default LandingPage;
