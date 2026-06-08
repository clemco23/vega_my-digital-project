import { useEffect, useState } from "react";
import { createBlog, updateBlog } from "../../../services/blog.service";
import {
  createCategory,
  getCategories,
} from "../../../services/category.service";
import "./BlogForm.css";

const createInitialFormState = (blog) => ({
  title: blog?.title || "",
  slug: blog?.slug || "",
  metaDescription: blog?.metaDescription || "",
  keywords: blog?.keywords || "",
  content: blog?.content || "",
  categoryId: blog?.categoryId ? String(blog.categoryId) : "",
  isActivated: Boolean(blog?.isActivated),
  picture: null,
});

const slugify = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function BlogForm({ blog, onClose, onSave }) {
  const [formData, setFormData] = useState(() => createInitialFormState(blog));
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [error, setError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [isSlugEdited, setIsSlugEdited] = useState(Boolean(blog?.slug));

  useEffect(() => {
    setFormData(createInitialFormState(blog));
    setIsSlugEdited(Boolean(blog?.slug));
  }, [blog]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        setCategoryError("");
        const data = await getCategories();
        setCategories(Array.isArray(data.data) ? data.data : []);
      } catch (currentError) {
        console.error(currentError);
        setCategoryError("Impossible de charger les catégories.");
      } finally {
        setLoadingCategories(false);
      }
    };

    void fetchCategories();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked, files } = event.target;

    if (type === "file") {
      setFormData((previousFormData) => ({
        ...previousFormData,
        picture: files?.[0] || null,
      }));
      return;
    }

    if (name === "title") {
      setFormData((previousFormData) => ({
        ...previousFormData,
        title: value,
        slug: isSlugEdited ? previousFormData.slug : slugify(value),
      }));
      return;
    }

    if (name === "slug") {
      setIsSlugEdited(true);
      setFormData((previousFormData) => ({
        ...previousFormData,
        slug: slugify(value),
      }));
      return;
    }

    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateCategory = async () => {
    const trimmedCategoryName = newCategoryName.trim();

    if (!trimmedCategoryName) {
      setCategoryError("Saisis un nom de catégorie.");
      return;
    }

    try {
      setCreatingCategory(true);
      setCategoryError("");
      const response = await createCategory({ name: trimmedCategoryName });
      const createdCategory = response.data;

      setCategories((previousCategories) => [
        ...previousCategories,
        createdCategory,
      ]);
      setFormData((previousFormData) => ({
        ...previousFormData,
        categoryId: String(createdCategory.id),
      }));
      setNewCategoryName("");
    } catch (currentError) {
      console.error(currentError);
      setCategoryError(
        currentError.response?.data?.message ||
          "Impossible de créer cette catégorie."
      );
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.categoryId) {
      setError("Choisis une catégorie avant d'enregistrer le blog.");
      return;
    }

    try {
      setLoading(true);

      const payload = new FormData();
      payload.append("title", formData.title.trim());
      payload.append("slug", formData.slug.trim());
      payload.append("metaDescription", formData.metaDescription.trim());
      payload.append("keywords", formData.keywords.trim());
      payload.append("content", formData.content.trim());
      payload.append("categoryId", formData.categoryId);
      payload.append("isActivated", String(formData.isActivated));

      if (formData.picture) {
        payload.append("picture", formData.picture);
      }

      const response = blog
        ? await updateBlog(blog.id, payload)
        : await createBlog(payload);

      onSave(response.data);
    } catch (currentError) {
      console.error(currentError);
      setError(
        currentError.response?.data?.message ||
          "Erreur lors de la sauvegarde du blog."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="blog-form-overlay">
      <div className="blog-form-modal">
        <div className="blog-form-header">
          <h2>{blog ? "Modifier le blog" : "Ajouter un blog"}</h2>
          <button
            type="button"
            className="blog-form-close"
            onClick={onClose}
            aria-label="Fermer"
          >
            x
          </button>
        </div>

        {error ? <p className="blog-form-error">{error}</p> : null}

        <div className="blog-form-body">
          <form onSubmit={handleSubmit}>
            <div className="blog-form-section">
              <h3>Informations générales</h3>

              <div className="blog-form-row">
                <div className="blog-form-field">
                  <label htmlFor="blog-title">Titre</label>
                  <input
                    id="blog-title"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="blog-form-field">
                  <label htmlFor="blog-slug">Slug</label>
                  <input
                    id="blog-slug"
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="blog-form-field">
                <label htmlFor="blog-meta-description">Meta description</label>
                <textarea
                  id="blog-meta-description"
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Résumé SEO visible dans Google."
                />
              </div>

              <div className="blog-form-field">
                <label htmlFor="blog-keywords">Mots-clés ciblés</label>
                <textarea
                  id="blog-keywords"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Sépare les mots-clés par des virgules."
                />
              </div>
            </div>

            <div className="blog-form-section">
              <h3>Publication</h3>

              <div className="blog-form-row">
                <div className="blog-form-field">
                  <label htmlFor="blog-category">Catégorie</label>
                  <select
                    id="blog-category"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    disabled={loadingCategories}
                    required
                  >
                    <option value="">
                      {loadingCategories
                        ? "Chargement..."
                        : "Sélectionner une catégorie"}
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="blog-form-field blog-form-field--checkbox">
                  <label htmlFor="blog-status">
                    <input
                      id="blog-status"
                      type="checkbox"
                      name="isActivated"
                      checked={formData.isActivated}
                      onChange={handleChange}
                    />
                    Publier immédiatement
                  </label>
                </div>
              </div>

              <div className="blog-form-category-inline">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(event) => setNewCategoryName(event.target.value)}
                  placeholder="Créer une nouvelle catégorie"
                />
                <button
                  type="button"
                  className="blog-form-category-button"
                  onClick={handleCreateCategory}
                  disabled={creatingCategory}
                >
                  {creatingCategory ? "Création..." : "Ajouter"}
                </button>
              </div>

              {categoryError ? (
                <p className="blog-form-category-error">{categoryError}</p>
              ) : null}

              <div className="blog-form-field">
                <label htmlFor="blog-picture">Image de couverture</label>
                <input
                  id="blog-picture"
                  type="file"
                  name="picture"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleChange}
                />
                {blog?.picture ? (
                  <a
                    className="blog-form-picture-link"
                    href={blog.picture}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Voir l'image actuelle
                  </a>
                ) : null}
              </div>
            </div>

            <div className="blog-form-section">
              <h3>Contenu</h3>
              <div className="blog-form-field">
                <label htmlFor="blog-content">Texte de l'article</label>
                <textarea
                  id="blog-content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={16}
                  required
                  placeholder="Tu peux coller ici ton article complet. Utilise **texte** pour mettre un passage en gras."
                />
                <p className="blog-form-help">
                  Utilise <code>**texte**</code> pour garder seulement un passage
                  en gras dans l&apos;article.
                </p>
              </div>
            </div>

            <button type="submit" className="blog-form-submit" disabled={loading}>
              {loading
                ? "Sauvegarde..."
                : blog
                  ? "Mettre à jour le blog"
                  : "Créer le blog"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BlogForm;
