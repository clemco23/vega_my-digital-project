import "./CircularEconomySection.css";

const orbitNodes = [
  {
    id: "board",
    positionClass: "circular-economy-section__node--board-pos",
    toneClass: "circular-economy-section__node--olive",
    sizeClass: "circular-economy-section__node--xl",
  },
  {
    id: "share",
    positionClass: "circular-economy-section__node--share-pos",
    toneClass: "circular-economy-section__node--olive",
    sizeClass: "circular-economy-section__node--sm",
  },
  {
    id: "renew",
    positionClass: "circular-economy-section__node--renew-pos",
    toneClass: "circular-economy-section__node--burnt",
    sizeClass: "circular-economy-section__node--md",
  },
  {
    id: "resale",
    positionClass: "circular-economy-section__node--resale-pos",
    toneClass: "circular-economy-section__node--gold",
    sizeClass: "circular-economy-section__node--md",
  },
  {
    id: "community",
    positionClass: "circular-economy-section__node--community-pos",
    toneClass: "circular-economy-section__node--rose",
    sizeClass: "circular-economy-section__node--md",
  },
];

const cycleSteps = [
  {
    number: "1",
    toneClass: "circular-economy-section__step-badge--olive",
    title: "Achat de la planche",
    description:
      "Une structure noble, durable, avec vos premiers modules selon l\u2019age.",
  },
  {
    number: "2",
    toneClass: "circular-economy-section__step-badge--burnt",
    title: "Renouvellement des modules",
    description:
      "Ajoutez ou changez des modules au fil du developpement.",
  },
  {
    number: "3",
    toneClass: "circular-economy-section__step-badge--gold",
    title: "Reprise & bon d\u2019achat",
    description:
      "Retournez vos anciens modules contre un bon d\u2019achat. Zero gaspillage.",
  },
  {
    number: "4",
    toneClass: "circular-economy-section__step-badge--rose",
    title: "Faites partie de la communaute Hapto",
    description:
      "Echangez entre parents. La seconde vie du bois continue.",
  },
];

function CircularEconomySection() {
  return (
    <section className="circular-economy-section">
      <div className="circular-economy-section__inner">
        <div className="circular-economy-section__visual" aria-hidden="true">
          <div className="circular-economy-section__orbit">
            <div className="circular-economy-section__orbit-track" />

            <div className="circular-economy-section__orbit-rotation">
              {orbitNodes.map(({ id, positionClass, toneClass, sizeClass }) => (
                <span
                  key={id}
                  className={`circular-economy-section__node ${positionClass} ${toneClass} ${sizeClass}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="circular-economy-section__content">
          <p className="circular-economy-section__eyebrow">
            ECONOMIE CIRCULAIRE
          </p>

          <h2 className="circular-economy-section__title">
            Un jouet pense pour{" "}
            <span className="circular-economy-section__title-accent">
              durer,
            </span>{" "}
            <span className="circular-economy-section__title-accent">
              se partager
            </span>{" "}
            et se reinventer.
          </h2>

          <p className="circular-economy-section__description">
           Ce jouet ne s’inscrit pas comme un achat ponctuel et impulsif. Il représente une opportunité d’évolution tout au long du développement de l’enfant. Choisissez de renvoyer les anciens modules et procurez-vous ceux qui sauront combler les besoins de l’enfant.
          </p>

          <ol className="circular-economy-section__steps">
            {cycleSteps.map(({ number, toneClass, title, description }) => (
              <li className="circular-economy-section__step" key={number}>
                <span
                  className={`circular-economy-section__step-badge ${toneClass}`}
                >
                  {number}
                </span>

                <div className="circular-economy-section__step-copy">
                  <h3 className="circular-economy-section__step-title">{title}</h3>
                  <p className="circular-economy-section__step-description">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export default CircularEconomySection;
