const {
    getAllBlogs,
    getBlogBySlug,
    createBlog,
    updateBlog,
    deleteBlog,
  } = require("../services/blog.service");
  
  const getAll = async (req, res) => {
    try {
      const blogs = await getAllBlogs();
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
  
  const create = async (req, res) => {
    console.log("req.file:", req.file);
  console.log("req.body:", req.body);
    try {
      const { title, slug, content, isActivated, categoryId } = req.body;
      const picture = req.file ? req.file.path : null; // ← l'URL cloudinary
  
      if (!title || !slug || !content || !categoryId) {
        return res.status(400).json({ message: "Champs obligatoires manquants." });
      }
  
      const blog = await createBlog({
        title,
        slug,
        content,
        picture,
        isActivated: isActivated === "true",  // convertit en boolean
        categoryId: parseInt(categoryId),      // convertit en nombre
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
      const { title, slug, content, isActivated, categoryId } = req.body;
      const picture = req.file ? req.file.path : null; // ← l'URL cloudinary
  
      const data = {};
      if (title !== undefined) data.title = title;
      if (slug !== undefined) data.slug = slug;
      if (content !== undefined) data.content = content;
      if (picture !== undefined) data.picture = picture;
      if (isActivated !== undefined) data.isActivated = isActivated === "true";
      if (categoryId !== undefined) data.categoryId = parseInt(categoryId);
  
      const blog = await updateBlog(id, data);
      return res.status(200).json({ message: "Blog mis à jour.", data: blog });
    } catch (error) {
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
  
  module.exports = { getAll, getOne, create, update, remove };