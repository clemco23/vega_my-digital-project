import "./ContactFaqSection.css";

const faqItems = [
  {
    title: "Délai de livraison",
    content:
      "Toutes sont modulables, vous choisissez vos articles et nous les expédions dans la journée. Comptez environ 10 jours ouvrés pour une livraison à votre domicile.",
  },
  {
    title: "Livraison internationale",
    content:
      "Nous expédions actuellement la planche sensorielle ainsi que ses modules dans toute l&apos;Union européenne.",
  },
  {
    title: "Entretien du bois",
    content:
      "Un simple chiffon doux et humide suffira. Nos bois sont protégés par des huiles naturelles certifiées contact alimentaire.",
  },
  {
    title: "Retour & échange",
    content:
      "Vous disposez de 14 jours après réception pour nous retourner un article s&apos;il ne convient pas à votre petit explorateur.",
  },
];

function ContactFaqSection() {
  return (
    <section className="contact-faq-section" aria-labelledby="contact-faq-title">
      <div className="contact-faq-section__inner">
        <h2 className="contact-faq-section__title" id="contact-faq-title">
          Questions fréquentes
        </h2>

        <div className="contact-faq-section__grid">
          {faqItems.map((item) => (
            <article className="contact-faq-section__card" key={item.title}>
              <h3 className="contact-faq-section__card-title">{item.title}</h3>
              <p className="contact-faq-section__card-text">{item.content}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ContactFaqSection;
