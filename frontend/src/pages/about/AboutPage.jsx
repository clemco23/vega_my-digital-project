import AboutClosingCtaSection from "../../components/about/AboutClosingCtaSection/AboutClosingCtaSection";
import AboutFooter from "../../components/about/AboutFooter/AboutFooter";
import AboutHeroSection from "../../components/about/AboutHeroSection/AboutHeroSection";
import AboutDifferentiatorsSection from "../../components/about/AboutDifferentiatorsSection/AboutDifferentiatorsSection";
import AboutStorySection from "../../components/about/AboutStorySection/AboutStorySection";
import AboutTeamSection from "../../components/about/AboutTeamSection/AboutTeamSection";
import ReassuranceSection from "../../components/landing/ReassuranceSection/ReassuranceSection";
import Navbar from "../../components/navbar/Navbar";
import "./AboutPage.css";

function AboutPage() {
  return (
    <div className="about-page">
      <Navbar />

      <main className="about-page__content">
        <AboutHeroSection />
        <AboutStorySection />
        <AboutTeamSection />
        <AboutDifferentiatorsSection />
        <AboutClosingCtaSection />
        <ReassuranceSection />
      </main>

    </div>
  );
}

export default AboutPage;
