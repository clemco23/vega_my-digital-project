import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import blogPlaceholder from "../../assets/blog.png";
import SiteFooter from "../../components/footer/SiteFooter";
import Navbar from "../../components/navbar/Navbar";
import PageSeo from "../../components/seo/PageSeo";
import { getPublishedBlogBySlug } from "../../services/blog.service";
import {
  buildBlogContentBlocks,
  formatBlogDate,
  getBlogCoverImage,
} from "../../components/blog/blog.utils";
import "./BlogArticlePage.css";

function BlogArticlePage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getPublishedBlogBySlug(slug);
        setBlog(response.data || null);
      } catch (currentError) {
        console.error(currentError);
        setError("Impossible de charger cet article pour le moment.");
      } finally {
        setLoading(false);
      }
    };

    void fetchBlog();
  }, [slug]);

  const canonicalUrl = `https://haptokids.fr/blog/${slug}`;
  const seoTitle = blog?.title
    ? `${blog.title} | HAPTO`
    : "Article du blog | HAPTO";
  const seoDescription =
    blog?.metaDescription ||
    "Découvrez un article du journal HAPTO autour du design sensoriel et de l'éveil des enfants.";
  const seoImage = blog?.picture || `https://haptokids.fr${blogPlaceholder}`;
  const contentBlocks = buildBlogContentBlocks(blog?.content);

  return (
    <div className="blog-article-page">
      <PageSeo
        title={seoTitle}
        description={seoDescription}
        url={canonicalUrl}
        image={seoImage}
        imageAlt={blog?.title || "Article du blog HAPTO"}
        type="article"
      />

      <Navbar />

      <main className="blog-article-page__content">
        {loading ? (
          <section className="blog-article-page__state-shell">
            <div className="blog-article-page__state">
              Chargement de l&apos;article...
            </div>
          </section>
        ) : null}

        {!loading && error ? (
          <section className="blog-article-page__state-shell">
            <div className="blog-article-page__state blog-article-page__state--error">
              <p>{error}</p>
              <Link to="/blog">Retour au blog</Link>
            </div>
          </section>
        ) : null}

        {!loading && !error && blog ? (
          <article className="blog-article">
            <div className="blog-article__shell">
              <Link to="/blog" className="blog-article__back-link">
                Retour au journal
              </Link>

              <header className="blog-article__header">
                <div className="blog-article__meta">
                  <p className="blog-article__date">
                    {formatBlogDate(blog.createdAt)}
                  </p>
                  {blog.category?.name ? (
                    <p className="blog-article__category">{blog.category.name}</p>
                  ) : null}
                </div>

                <h1>{blog.title}</h1>

                {blog.metaDescription ? (
                  <p className="blog-article__description">
                    {blog.metaDescription}
                  </p>
                ) : null}
              </header>

              <div className="blog-article__cover">
                <img
                  src={getBlogCoverImage(blog, blogPlaceholder)}
                  alt={blog.title}
                />
              </div>

              <div className="blog-article__reading-panel">
                <div className="blog-article__body">
                  {contentBlocks.map((block, index) => {
                    if (block.type === "heading") {
                      return <h2 key={`${block.type}-${index}`}>{block.value}</h2>;
                    }

                    if (block.type === "subheading") {
                      return <h3 key={`${block.type}-${index}`}>{block.value}</h3>;
                    }

                    if (block.type === "quote") {
                      return (
                        <blockquote key={`${block.type}-${index}`}>
                          {block.value}
                        </blockquote>
                      );
                    }

                    if (block.type === "list") {
                      return (
                        <ul key={`${block.type}-${index}`} className="blog-article__list">
                          {block.items.map((item, itemIndex) => (
                            <li key={`${block.type}-${index}-${itemIndex}`}>{item}</li>
                          ))}
                        </ul>
                      );
                    }

                    if (block.type === "table") {
                      return (
                        <div
                          key={`${block.type}-${index}`}
                          className="blog-article__table-shell"
                        >
                          <table className="blog-article__table">
                            <thead>
                              <tr>
                                {block.headers.map((header, headerIndex) => (
                                  <th key={`${block.type}-${index}-${headerIndex}`}>
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {block.rows.map((row, rowIndex) => (
                                <tr key={`${block.type}-${index}-${rowIndex}`}>
                                  {row.map((cell, cellIndex) => (
                                    <td
                                      key={`${block.type}-${index}-${rowIndex}-${cellIndex}`}
                                    >
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    }

                    if (block.type === "image") {
                      return (
                        <figure
                          key={`${block.type}-${index}`}
                          className="blog-article__inline-media"
                        >
                          <img src={block.src} alt={block.alt} />
                        </figure>
                      );
                    }

                    return (
                      <p
                        key={`${block.type}-${index}`}
                        className={`blog-article__paragraph ${block.isLead ? "blog-article__paragraph--lead" : ""}`}
                      >
                        {block.value}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          </article>
        ) : null}
      </main>

      <SiteFooter />
    </div>
  );
}

export default BlogArticlePage;
