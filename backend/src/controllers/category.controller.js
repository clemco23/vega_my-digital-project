const {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = require("../services/category.service");
  
  const getAll = async (req, res) => {
    try {
      const categories = await getAllCategories();
      return res.status(200).json({ data: categories });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur serveur." });
    }
  };
  
  const create = async (req, res) => {
    try {
      const { name } = req.body;
  
      if (!name) {
        return res.status(400).json({ message: "Le nom est obligatoire." });
      }
  
      const category = await createCategory(name);
      return res.status(201).json({ message: "Catégorie créée.", data: category });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur serveur." });
    }
  };

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const {name } = req.body;
    
        const data = {};
        if (name !== undefined) data.name = name;
    
        const category = await updateCategory(id, data);
        return res.status(200).json({ message: "Catégorie mis à jour.", data: category });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur." });
      }
}; 

  const remove = async (req, res) => {
    try {
      const { id } = req.params;
      await deleteCategory(id);
      return res.status(200).json({ message: "Catégorie supprimée." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur serveur." });
    }
  };
  
  module.exports = { getAll, create,update, remove };