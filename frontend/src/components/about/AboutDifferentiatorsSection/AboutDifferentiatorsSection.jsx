import { Leaf, Palette, Puzzle, UsersRound } from "lucide-react";
import "./AboutDifferentiatorsSection.css";

const differentiators = [
  {
    title: "Modularite",
    Icon: Puzzle,
    description:
      "Nos modules sont clipsables et interchangeables. La planche evolue en complexite au meme rythme que votre enfant.",
  },
  {
    title: "Eco-conception",
    Icon: Leaf,
    description:
      "Bois certifie FSC, peintures conformes EN 71-3... Assemble en France avec des materiaux nobles sources en Europe.",
  },
  {
    title: "Inclusivite",
    Icon: UsersRound,
    description:
      "Concu pour tous les enfants, y compris neuroatypiques (TDAH, TSA, ...). Convient egalement aux adultes.",
  },
  {
    title: "Design esthetique",
    Icon: Palette,
    description:
      "Plus qu'un objet sensoriel, son design et ses materiaux nobles s'integreront sans aucun probleme a votre decoration d'interieur.",
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
            differents
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
