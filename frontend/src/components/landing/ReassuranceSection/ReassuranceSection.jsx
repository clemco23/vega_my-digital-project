import "./ReassuranceSection.css";

const reassuranceItems = [
  {
    id: "certification",
    eyebrow: "CERTIFICATION",
    text: "Marquage CE\n& EN 71-3",
  },
  {
    id: "materials",
    eyebrow: "MATERIAUX",
    text: "Bois FSC\ncertifie",
  },
  {
    id: "fabrication",
    eyebrow: "FABRICATION",
    text: "Assemblé\nen France",
  },
  {
    id: "chemistry",
    eyebrow: "CHIMIE",
    text: "Conforme\nREACH",
  },
  {
    id: "circularity",
    eyebrow: "CIRCULARITE",
    text: "Reprise\ndes modules",
  },
];

function ReassuranceSection() {
  return (
    <section className="reassurance-section" aria-label="Engagements produit">
      <div className="reassurance-section__panel">
        {reassuranceItems.map(({ id, eyebrow, text }) => (
          <article className="reassurance-section__item" key={id}>
            <p className="reassurance-section__eyebrow">{eyebrow}</p>
            <p className="reassurance-section__text">{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ReassuranceSection;
