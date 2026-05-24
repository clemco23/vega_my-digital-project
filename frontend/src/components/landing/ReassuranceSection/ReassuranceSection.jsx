import certificationIcon from "../../../assets/certification.png";
import chemistryIcon from "../../../assets/chemistry.png";
import circularityIcon from "../../../assets/circularity.png";
import materialsIcon from "../../../assets/material.png";
import fabricationIcon from "../../../assets/tool.png";
import "./ReassuranceSection.css";

const reassuranceItems = [
  {
    id: "certification",
    icon: certificationIcon,
    eyebrow: "CERTIFICATION",
    text: "Marquage CE\n& EN 71-3",
  },
  {
    id: "materials",
    icon: materialsIcon,
    eyebrow: "MATERIAUX",
    text: "Bois FSC\ncertifie",
  },
  {
    id: "fabrication",
    icon: fabricationIcon,
    eyebrow: "FABRICATION",
    text: "Assemble\nen France",
  },
  {
    id: "chemistry",
    icon: chemistryIcon,
    eyebrow: "CHIMIE",
    text: "Conforme\nREACH",
  },
  {
    id: "circularity",
    icon: circularityIcon,
    eyebrow: "CIRCULARITE",
    text: "Reprise\ndes modules",
  },
];

function ReassuranceSection() {
  return (
    <section className="reassurance-section" aria-label="Engagements produit">
      <div className="reassurance-section__panel">
        {reassuranceItems.map(({ id, icon, eyebrow, text }) => (
          <article className="reassurance-section__item" key={id}>
            <img
              src={icon}
              alt=""
              aria-hidden="true"
              className="reassurance-section__icon"
            />
            <p className="reassurance-section__eyebrow">{eyebrow}</p>
            <p className="reassurance-section__text">{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ReassuranceSection;
