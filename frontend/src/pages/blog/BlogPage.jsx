import BlogHeroSection from "../../components/blog/BlogHeroSection/BlogHeroSection";
import BlogPostsSection from "../../components/blog/BlogPostsSection/BlogPostsSection";
import SiteFooter from "../../components/footer/SiteFooter";
import Navbar from "../../components/navbar/Navbar";
import PageSeo from "../../components/seo/PageSeo";
import blogPlaceholder from "../../assets/blog.png";
import "./BlogPage.css";

const canonicalUrl = "https://haptokids.fr/blog";
const seoTitle = "Le journal de l'attention | HAPTO";
const seoDescription =
  "Découvrez les articles HAPTO sur le design sensoriel, l'éveil des enfants, la déconnexion et les inspirations pour toute la famille.";
const seoImage = `https://haptokids.fr${blogPlaceholder}`;

function BlogPage() {
  return (
    <div className="blog-page">
      <PageSeo
        title={seoTitle}
        description={seoDescription}
        url={canonicalUrl}
        image={seoImage}
        imageAlt="Lecture du blog HAPTO autour de l'éveil sensoriel"
      />

      <Navbar />

      <main className="blog-page__content">
        <BlogHeroSection />
        <BlogPostsSection />
      </main>

      <SiteFooter />
    </div>
  );
}

export default BlogPage;
