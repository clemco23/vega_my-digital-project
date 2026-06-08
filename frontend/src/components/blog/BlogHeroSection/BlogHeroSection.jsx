import "./BlogHeroSection.css";

function BlogHeroSection() {
  return (
    <section className="blog-hero" aria-labelledby="blog-hero-title">
      <div className="blog-hero__inner">
        <h1 className="blog-hero__title" id="blog-hero-title">
          <span className="blog-hero__title-line">Le journal de</span>
          <span className="blog-hero__title-line blog-hero__title-line--accent">
            l&apos;attention
          </span>
        </h1>

        <p className="blog-hero__description">
          R&eacute;flexions sur le design sensoriel, la d&eacute;connexion et
          l&apos;&eacute;veil au naturel.
        </p>
      </div>
    </section>
  );
}

export default BlogHeroSection;
