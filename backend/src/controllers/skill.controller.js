const {
    getAllSkills,
    createSkill,
    deleteSkill,
    addSkillToProduct,
    removeSkillFromProduct,
  } = require("../services/skill.service");
  
  const getAll = async (req, res) => {
    try {
      const skills = await getAllSkills();
      return res.status(200).json({ data: skills });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur serveur." });
    }
  };
  
  const create = async (req, res) => {
    try {
      const { label } = req.body;
  
      if (!label) {
        return res.status(400).json({ message: "Label obligatoire." });
      }
  
      const skill = await createSkill(label);
      return res.status(201).json({ message: "Skill créé.", data: skill });
    } catch (error) {
      if (error.code === "P2002") {
        return res.status(409).json({ message: "Ce skill existe déjà." });
      }
      console.error(error);
      return res.status(500).json({ message: "Erreur serveur." });
    }
  };
  
  const remove = async (req, res) => {
    try {
      const { id } = req.params;
      await deleteSkill(id);
      return res.status(200).json({ message: "Skill supprimé." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur serveur." });
    }
  };
  
  const addToProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const { skillId } = req.body;
  
      if (!skillId) {
        return res.status(400).json({ message: "skillId obligatoire." });
      }
  
      const skill = await addSkillToProduct(id, skillId);
      return res.status(201).json({ message: "Skill ajouté au produit.", data: skill });
    } catch (error) {
      if (error.code === "P2002") {
        return res.status(409).json({ message: "Ce skill est déjà lié à ce produit." });
      }
      console.error(error);
      return res.status(500).json({ message: "Erreur serveur." });
    }
  };
  
  const removeFromProduct = async (req, res) => {
    try {
      const { id, skillId } = req.params;
      await removeSkillFromProduct(id, skillId);
      return res.status(200).json({ message: "Skill retiré du produit." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur serveur." });
    }
  };
  
  module.exports = { getAll, create, remove, addToProduct, removeFromProduct };