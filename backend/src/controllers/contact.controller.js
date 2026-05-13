const {
    getAllContacts
  } = require("../services/contact.service");

  const getContacts = async (req, res) => {
    try {
      const contacts = await getAllContacts();
  
      return res.status(200).json({
        success: true,
        data: contacts,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des contacts",
      });
    }
  };
  
  module.exports = {
    getContacts,
  };