import BlogHeroSection from "../../components/blog/BlogHeroSection/BlogHeroSection";
import SiteFooter from "../../components/footer/SiteFooter";
import Navbar from "../../components/navbar/Navbar";
import "./BlogPage.css";

function BlogPage() {
  return (
    <div className="blog-page">
      <Navbar />

      <main className="blog-page__content">
        <BlogHeroSection />
      </main>

      <SiteFooter />
    </div>
  );
}

export default BlogPage;
