import NewsletterForm from "../components/newsletter/NewsletterForm";

function LandingPage() {
  return (
    <main>
      <section>
        <h1>Bienvenue sur Hapto</h1>
        <p>Inscris-toi pour être informé du lancement.</p>
      </section>

      <section>
        <h2>Newsletter</h2>
        <NewsletterForm />
      </section>
    </main>
  );
}

export default LandingPage;