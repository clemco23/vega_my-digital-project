import SiteFooter from "../../components/footer/SiteFooter";
import Navbar from "../../components/navbar/Navbar";
import "../home/HomePage.css";

function BlogPage() {
  return (
    <div className="home-page">
      <Navbar />

      <main className="home-page__content">
        <div className="home-page__placeholder">
          <p className="home-page__eyebrow">BLOG</p>
          <h1>Le blog arrive bientôt</h1>
          <p>
            Cette page est prête pour accueillir vos articles, conseils et
            actualités autour de l&apos;univers Hapto.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

export default BlogPage;
