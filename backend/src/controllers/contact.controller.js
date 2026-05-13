const {
  getAllContacts,
  getContactById,
  createContact,
} = require("../services/contact.service");

// Express ne peut pas renvoyer un BigInt en JSON, donc on convertit l'id en string.
const serializeContact = (contact) => ({
  ...contact,
  id: contact.id.toString(),
});

const createContactMessage = async (req, res) => {
  const { name, email, content } = req.body;

  try {
    const contact = await createContact({ name, email, content });

    return res.status(201).json({
      success: true,
      data: serializeContact(contact),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la creation du message de contact",
    });
  }
};

const getContacts = async (req, res) => {
  try {
    const contacts = await getAllContacts();

    return res.status(200).json({
      success: true,
      // On serialise chaque contact avant la reponse pour eviter le 500 sur l'id BigInt.
      data: contacts.map(serializeContact),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la recuperation des contacts",
    });
  }
};

const getContactOne = async (req, res) => {
  const { id } = req.params;

  try {
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID invalide",
      });
    }

    const contact = await getContactById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact non trouve",
      });
    }

    return res.status(200).json({
      success: true,
      data: serializeContact(contact),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la recuperation du contact",
    });
  }
};

module.exports = {
  getContacts,
  getContactOne,
  createContactMessage,
};
