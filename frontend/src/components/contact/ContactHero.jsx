import "./ContactHero.css";

function ContactHero() {
  return (
    <section className="contact-hero" aria-labelledby="contact-hero-title">
      <div className="contact-hero__inner">
        <h1 className="contact-hero__title" id="contact-hero-title">
          <span className="contact-hero__title-line">L'attention se cultive</span>
          <span className="contact-hero__title-line contact-hero__title-line--accent">
            par le toucher.
          </span>
        </h1>
      </div>
    </section>
  );
}

export default ContactHero;
