import "./ContactFaqSection.css";

const faqItems = [
  {
    title: "Delai de livraison",
    content:
      "Toutes sont modulables, vous choisissez vos articles et nous les expedions dans la journee. Comptez environ 10 jours ouvres pour une livraison a votre domicile.",
  },
  {
    title: "Livraison internationale",
    content:
      "Nous expedions actuellement la planche sensorielle ainsi que ses modules dans toute l'Union Europeenne.",
  },
  {
    title: "Entretien du bois",
    content:
      "Un simple chiffon doux et humide suffiront. Nos bois sont proteges par des huiles naturelles certifiees contact alimentaire.",
  },
  {
    title: "Retour & echange",
    content:
      "Vous disposez de 14 jours apres reception pour nous retourner un article s'il ne convient pas a votre petit explorateur.",
  },
];

function ContactFaqSection() {
  return (
    <section className="contact-faq-section" aria-labelledby="contact-faq-title">
      <div className="contact-faq-section__inner">
        <h2 className="contact-faq-section__title" id="contact-faq-title">
          Questions frequentes
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
