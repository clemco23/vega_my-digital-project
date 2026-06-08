const {
  getAllBlogs,
  getAllBlogsAdmin,
  getBlogBySlug,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../services/blog.service");

const parseBooleanInput = (value) => {
  if (typeof value === "boolean") {
    return value;
  }

  return value === "true";
};

const parseOptionalText = (value) => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmedValue = value.trim();
  return trimmedValue ? trimmedValue : null;
};

const getAll = async (_req, res) => {
  try {
    const blogs = await getAllBlogs();
    return res.status(200).json({ data: blogs });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

const getAllAdmin = async (_req, res) => {
  try {
    const blogs = await getAllBlogsAdmin();
    return res.status(200).json({ data: blogs });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

const getOne = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await getBlogBySlug(slug);

    if (!blog) {
      return res.status(404).json({ message: "Blog introuvable." });
    }

    return res.status(200).json({ data: blog });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

const getOneById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await getBlogById(Number(id));

    if (!blog) {
      return res.status(404).json({ message: "Blog introuvable." });
    }

    return res.status(200).json({ data: blog });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

const create = async (req, res) => {
  try {
    const {
      title,
      slug,
      metaDescription,
      keywords,
      content,
      isActivated,
      categoryId,
    } = req.body;
    const picture = req.file ? req.file.path : null;
    const parsedCategoryId = Number.parseInt(categoryId, 10);

    if (!title || !slug || !content || Number.isNaN(parsedCategoryId)) {
      return res.status(400).json({ message: "Champs obligatoires manquants." });
    }

    const blog = await createBlog({
      title: title.trim(),
      slug: slug.trim(),
      metaDescription: parseOptionalText(metaDescription),
      keywords: parseOptionalText(keywords),
      content: content.trim(),
      picture,
      isActivated: parseBooleanInput(isActivated),
      categoryId: parsedCategoryId,
    });

    return res.status(201).json({ message: "Blog créé.", data: blog });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Ce slug existe déjà." });
    }

    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      metaDescription,
      keywords,
      content,
      isActivated,
      categoryId,
    } = req.body;

    const data = {};

    if (title !== undefined) data.title = title.trim();
    if (slug !== undefined) data.slug = slug.trim();
    if (metaDescription !== undefined) {
      data.metaDescription = parseOptionalText(metaDescription);
    }
    if (keywords !== undefined) {
      data.keywords = parseOptionalText(keywords);
    }
    if (content !== undefined) data.content = content.trim();
    if (req.file) data.picture = req.file.path;
    if (isActivated !== undefined) {
      data.isActivated = parseBooleanInput(isActivated);
    }
    if (categoryId !== undefined) {
      const parsedCategoryId = Number.parseInt(categoryId, 10);

      if (Number.isNaN(parsedCategoryId)) {
        return res.status(400).json({ message: "Catégorie invalide." });
      }

      data.categoryId = parsedCategoryId;
    }

    const blog = await updateBlog(id, data);
    return res.status(200).json({ message: "Blog mis à jour.", data: blog });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Ce slug existe déjà." });
    }

    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteBlog(id);
    return res.status(200).json({ message: "Blog supprimé." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = {
  getAll,
  getAllAdmin,
  getOne,
  getOneById,
  create,
  update,
  remove,
};
