import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import blogPlaceholder from "../../../assets/blog.png";
import { getPublishedBlogs } from "../../../services/blog.service";
import {
  formatBlogDate,
  getBlogCoverImage,
  getBlogExcerpt,
} from "../blog.utils";
import "./BlogPostsSection.css";

function BlogPostsSection() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getPublishedBlogs();
        setBlogs(Array.isArray(response.data) ? response.data : []);
      } catch (currentError) {
        console.error(currentError);
        setError("Impossible de charger les articles pour le moment.");
      } finally {
        setLoading(false);
      }
    };

    void fetchBlogs();
  }, []);

  return (
    <section className="blog-posts-section" aria-labelledby="blog-posts-title">
      <div className="blog-posts-section__inner">
        <div className="blog-posts-section__heading">
          <h2 id="blog-posts-title">Un blog pour les parents et leurs enfants</h2>
          <p>
            "Le carnet de bord de la communauté HAPTŌ. Découvrez nos astuces
            pour limiter les écrans, nos interviews d&apos;experts et nos
            inspirations design pour toute la famille."
          </p>
        </div>

        {loading ? (
          <p className="blog-posts-section__state">
            Chargement des articles...
          </p>
        ) : null}

        {!loading && error ? (
          <p className="blog-posts-section__state blog-posts-section__state--error">
            {error}
          </p>
        ) : null}

        {!loading && !error && blogs.length === 0 ? (
          <p className="blog-posts-section__state">
            Les premiers articles arrivent bientôt.
          </p>
        ) : null}

        {!loading && !error && blogs.length > 0 ? (
          <div className="blog-posts-section__grid">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                to={`/blog/${blog.slug}`}
                className="blog-post-card"
              >
                <div className="blog-post-card__media">
                  <img
                    src={getBlogCoverImage(blog, blogPlaceholder)}
                    alt={blog.title}
                    className="blog-post-card__image"
                  />
                </div>

                <div className="blog-post-card__content">
                  <p className="blog-post-card__date">
                    {formatBlogDate(blog.createdAt)}
                  </p>
                  <h3>{blog.title}</h3>
                  <p className="blog-post-card__excerpt">
                    {getBlogExcerpt(blog)}
                  </p>
                  <span className="blog-post-card__link">Voir plus</span>
                </div>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default BlogPostsSection;
