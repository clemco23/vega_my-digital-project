import lorenaPortrait from "../../../assets/lorena.jpeg";
import clementPortrait from "../../../assets/clement.jpeg";
import clessyPortrait from "../../../assets/clessy.jpeg";
import williamPortrait from "../../../assets/william.jpeg";
import inesPortrait from "../../../assets/ines.jpeg";
import "./AboutTeamSection.css";

const teamMembers = [
  {
    name: "Lorena Ville Peguy",
    role: "Fondatrice - Directrice",
    image: lorenaPortrait,
    alt: "Portrait de Lorena Ville Peguy",
    imagePosition: "50% 34%",
    description:
      "Directrice artistique de formation et maman d'un petit garçon, soucieuse du développement des enfants au plus loin des écrans. Elle lance Hapto avec Clement en 2025.",
  },
  {
    name: "Clement Boscher",
    role: "Co-fondateur - Développeur",
    image: clementPortrait,
    alt: "Portrait de Clement Boscher",
    imagePosition: "50% 24%",
    description:
      "L'architecte digital du projet et co-fondateur d'Hapto avec Lorena. Il veille à ce que votre expérience en ligne soit aussi fluide qu'à travers la planche sensorielle.",
  },
  {
    name: "Clessy Zhou",
    role: "Directrice marketing",
    image: clessyPortrait,
    alt: "Portrait de Clessy Zhou",
    imagePosition: "50% 22%",
    description:
      "Formée en marketing et communication, et maman d'une petite fille, elle réfléchit au développement de la marque en accord avec nos valeurs et les vôtres.",
  },
  {
    name: "William Anguile-Diop",
    role: "Commercial",
    image: williamPortrait,
    alt: "Portrait de William Anguile-Diop",
    imagePosition: "50% 22%",
    description:
      "Éducateur spécialisé auprès d'enfants en difficulté, il pratique son métier conjointement avec notre marque afin d'augmenter la présence d'Hapto au sein des écoles et crèches.",
  },
  {
    name: "Ines Schlegel",
    role: "Relation client",
    image: inesPortrait,
    alt: "Portrait d'Ines Schlegel",
    imagePosition: "50% 30%",
    description:
      "Diplômée de sociologie, elle se préoccupe de la place du digital au sein des foyers. En charge de la relation client, elle vous aidera à y voir plus clair et répondra à vos questions.",
  },
];

function AboutTeamSection() {
  return (
    <section className="about-team" aria-labelledby="about-team-title">
      <div className="about-team__inner">
        <p className="about-team__eyebrow">L&apos;ÉQUIPE</p>

        <h2 className="about-team__title" id="about-team-title">
          <span className="about-team__title-primary">
            Les visages derrière
          </span>{" "}
          <span className="about-team__title-accent">Hapto</span>
        </h2>

        <p className="about-team__intro">
          Nous travaillons tous à élaborer une solution plus saine et durable
          pour l&apos;avenir : nos enfants.
        </p>

        <div className="about-team__grid">
          {teamMembers.map(
            ({ name, role, image, alt, description, imagePosition }) => (
              <article className="about-team__card" key={name}>
                <img
                  className="about-team__photo"
                  src={image}
                  alt={alt}
                  style={{ objectPosition: imagePosition }}
                />

                <div className="about-team__card-body">
                  <h3 className="about-team__name">{name}</h3>
                  <p className="about-team__role">{role}</p>
                  <p className="about-team__description">{description}</p>
                </div>
              </article>
            )
          )}
        </div>
      </div>
    </section>
  );
}

export default AboutTeamSection;
