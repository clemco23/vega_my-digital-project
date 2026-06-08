import { useEffect, useState } from "react";
import { deleteBlog, getBlogsAdmin } from "../../../services/blog.service";
import "./BlogsList.css";

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString("fr-FR");
};

function BlogsList({ onAdd, onEdit, refreshToken }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await getBlogsAdmin();
        setBlogs(Array.isArray(data.data) ? data.data : []);
        setFeedback({ type: "", message: "" });
      } catch (error) {
        console.error(error);
        setFeedback({
          type: "error",
          message: "Impossible de charger les blogs.",
        });
      } finally {
        setLoading(false);
      }
    };

    void fetchBlogs();
  }, [refreshToken]);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce blog ?")) {
      return;
    }

    try {
      await deleteBlog(id);
      setBlogs((previousBlogs) =>
        previousBlogs.filter((blog) => blog.id !== id)
      );
      setFeedback({
        type: "success",
        message: "Blog supprimé.",
      });
    } catch (error) {
      console.error(error);
      setFeedback({
        type: "error",
        message:
          error.response?.data?.message || "Impossible de supprimer ce blog.",
      });
    }
  };

  if (loading) {
    return <p className="blogs-loading">Chargement des blogs...</p>;
  }

  return (
    <div className="blogs-list">
      <div className="blogs-list__header">
        <h2>Blogs</h2>
        <button className="btn-add" onClick={onAdd}>
          + Ajouter un blog
        </button>
      </div>

      {feedback.message ? (
        <p
          className={`blogs-feedback ${feedback.type === "error" ? "blogs-feedback--error" : "blogs-feedback--success"}`}
        >
          {feedback.message}
        </p>
      ) : null}

      <div className="blogs-table-shell">
        <table className="blogs-table">
          <thead>
            <tr>
              <th>Article</th>
              <th>Catégorie</th>
              <th>SEO</th>
              <th>Statut</th>
              <th>Mis à jour</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.id}>
                <td>
                  <div className="blogs-table__title-cell">
                    <strong>{blog.title}</strong>
                    <span>/{blog.slug}</span>
                  </div>
                </td>
                <td>{blog.category?.name || "-"}</td>
                <td>
                  <div className="blogs-table__seo-cell">
                    <span>{blog.metaDescription || "Aucune meta description"}</span>
                    <small>{blog.keywords || "Aucun mot-clé saisi"}</small>
                  </div>
                </td>
                <td>
                  <span
                    className={`badge ${blog.isActivated ? "badge--active" : "badge--inactive"}`}
                  >
                    {blog.isActivated ? "Publié" : "Brouillon"}
                  </span>
                </td>
                <td>{formatDate(blog.updatedAt)}</td>
                <td className="blogs-table__actions">
                  <button className="btn-edit" onClick={() => onEdit(blog)}>
                    Modifier
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(blog.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {blogs.length === 0 ? (
        <p className="blogs-empty">Aucun blog pour l'instant.</p>
      ) : null}
    </div>
  );
}

export default BlogsList;
