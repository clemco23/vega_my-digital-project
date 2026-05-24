import "./Intro.css";

function Intro() {
  return (
    <section className="intro" aria-labelledby="intro-title">
      <div className="intro__inner">
        <div className="intro__lead">
         
          <p className="intro__eyebrow">Le constat</p>

          <h2 className="intro__title" id="intro-title">
            <span className="intro__title-line">Les enfants</span>
            <span className="intro__title-line">evoluent mais</span>
            <span className="intro__title-line intro__title-line--final">
              pas <span className="intro__title-accent">leurs jouets.</span>
            </span>
          </h2>
        </div>

        <div className="intro__divider" aria-hidden="true" />

        <div className="intro__content">
          <div className="intro__text">
            <p className="intro__paragraph">
              D&apos;un cote, on retrouve les jeux en plastique peu esthetiques.
              De l&apos;autre, des jouets en bois onereux mais vite abandonnes. Ni
              l&apos;un ni l&apos;autre ne grandit avec votre enfant.
            </p>

            <p className="intro__paragraph">
              HAPTO est une planche sensorielle modulaire dont les activites
              evoluent au fil du developpement de votre enfant. Un objet pense
              pour durer et pour habiter votre interieur avec elegance.
            </p>
          </div>

          <blockquote className="intro__quote">
            <p className="intro__quote-text">
              &laquo; Verbatim a reprendre dans un questionnaire quali &raquo;
            </p>
            <footer className="intro__quote-author">
              - Julie, 34 ans, dir. de projet -
              <br />
              Maman de Jade (3 ans)
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}

export default Intro;
