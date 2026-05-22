import useToast from "../../hooks/useToast";
import Toast from "../../components/ui/Toast/Toast";
import ContactFaqSection from "../../components/contact/ContactFaqSection";
import ContactFormSection from "../../components/contact/ContactFormSection";
import ContactHero from "../../components/contact/ContactHero";
import ContactIntroSection from "../../components/contact/ContactIntroSection";
import SiteFooter from "../../components/footer/SiteFooter";
import Navbar from "../../components/navbar/Navbar";
import "../contact/ContactPage.css";
import ReassuranceSection from "../../components/landing/ReassuranceSection/ReassuranceSection";

function ContactPage() {
  const { toast, showToast, hideToast } = useToast();

  return (
    <div className="contact-page">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
      <Navbar />

      <main className="contact-page__content">
        <ContactHero />
        <ContactIntroSection />
        <ContactFormSection showToast={showToast} />
        <ContactFaqSection />
        <ReassuranceSection />
      </main>
      <SiteFooter />
    </div>
  );
}

export default ContactPage;
