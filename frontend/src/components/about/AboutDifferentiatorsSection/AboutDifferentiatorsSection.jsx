import { Leaf, Palette, Puzzle, UsersRound } from "lucide-react";
import "./AboutDifferentiatorsSection.css";

const differentiators = [
  {
    title: "Modularité",
    Icon: Puzzle,
    description:
      "Nos modules sont clipsables et interchangeables. La planche évolue en complexité au même rythme que votre enfant.",
  },
  {
    title: "Éco-conception",
    Icon: Leaf,
    description:
      "Bois certifié FSC, peintures conformes EN 71-3... Assemblé en France avec des matériaux nobles sourcés en Europe.",
  },
  {
    title: "Inclusivité",
    Icon: UsersRound,
    description:
      "Conçu pour tous les enfants, y compris neuroatypiques (TDAH, TSA, ...). Convient également aux adultes.",
  },
  {
    title: "Design esthétique",
    Icon: Palette,
    description:
      "Plus qu'un objet sensoriel, son design et ses matériaux nobles s'intégreront sans aucun problème à votre décoration d'intérieur.",
  },
];

function AboutDifferentiatorsSection() {
  return (
    <section
      className="about-differentiators"
      aria-labelledby="about-differentiators-title"
    >
      <div className="about-differentiators__inner">
        <h2
          className="about-differentiators__title"
          id="about-differentiators-title"
        >
          <span className="about-differentiators__title-primary">
            Ce qui nous rend
          </span>{" "}
          <span className="about-differentiators__title-accent">
            différents
          </span>
        </h2>

        <div className="about-differentiators__grid">
          {differentiators.map(({ title, Icon, description }) => (
            <article className="about-differentiators__card" key={title}>
              <div className="about-differentiators__icon-wrap" aria-hidden="true">
                <Icon className="about-differentiators__icon" strokeWidth={1.9} />
              </div>

              <h3 className="about-differentiators__card-title">{title}</h3>
              <p className="about-differentiators__description">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutDifferentiatorsSection;
