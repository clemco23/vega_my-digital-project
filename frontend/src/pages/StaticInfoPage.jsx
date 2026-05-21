import FooterLp from "../components/landing/FooterLp/FooterLp";
import "./StaticInfoPage.css";

function StaticInfoPage({
  title,
  summary,
  sections = [],
  statusCode = null,
}) {
  return (
    <div className="static-info-page">
      <main className="static-info-page__main">
        <article className="static-info-page__content">
          <a href="/" className="static-info-page__back-link">
            Retour a l'accueil
          </a>

          <header className="static-info-page__header">
            {statusCode ? (
              <p className="static-info-page__status">{statusCode}</p>
            ) : (
              <p className="static-info-page__eyebrow">Informations</p>
            )}

            <h1 className="static-info-page__title">{title}</h1>

            {summary ? (
              <p className="static-info-page__summary">{summary}</p>
            ) : null}
          </header>

          {sections.length > 0 ? (
            <div className="static-info-page__sections">
              {sections.map((section) => (
                <section
                  className="static-info-page__section"
                  key={section.heading}
                >
                  <h2 className="static-info-page__section-title">
                    {section.heading}
                  </h2>

                  {section.paragraphs?.map((paragraph) => (
                    <p
                      className="static-info-page__paragraph"
                      key={paragraph}
                    >
                      {paragraph}
                    </p>
                  ))}

                  {section.items?.length ? (
                    <dl className="static-info-page__definition-list">
                      {section.items.map((item) => (
                        <div
                          className="static-info-page__definition-row"
                          key={`${section.heading}-${item.label}`}
                        >
                          <dt className="static-info-page__term">
                            {item.label}
                          </dt>
                          <dd className="static-info-page__description">
                            {item.content}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                </section>
              ))}
            </div>
          ) : null}
        </article>
      </main>

      <FooterLp />
    </div>
  );
}

export default StaticInfoPage;
