const {
  getUserAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  getUserAddressesById,
} = require("../services/address.service");
const { serializeForJson } = require("../utils/serialize");

const getAll = async (req, res) => {
  try {
    const addresses = await getUserAddresses(req.user.id);
    return res.status(200).json({ data: serializeForJson(addresses) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

const getByuserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (isNaN(userId)) {
      return res.status(400).json({ message: "ID utilisateur invalide." });
    }

    const addresses = await getUserAddressesById(userId);
    return res.status(200).json({ data: serializeForJson(addresses) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

const create = async (req, res) => {
  try {
    const {
      street,
      city,
      postalCode,
      country,
      addressType,
      relayPointId,
      relayName,
    } = req.body;

    if (addressType === "RELAY_POINT") {
      if (!relayPointId || !relayName || !city || !postalCode) {
        return res.status(400).json({
          message: "Champs obligatoires manquants pour le point relais.",
        });
      }
    } else if (!street || !city || !postalCode) {
      return res.status(400).json({
        message: "Champs obligatoires manquants.",
      });
    }

    const address = await createAddress(req.user.id, {
      street,
      city,
      postalCode,
      country,
      addressType,
      relayPointId,
      relayName,
    });

    return res.status(201).json({
      message: "Adresse ajoutee.",
      data: serializeForJson(address),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { street, city, postalCode, country, addressType } = req.body;

    const data = {};
    if (street) data.street = street;
    if (city) data.city = city;
    if (postalCode) data.postalCode = postalCode;
    if (country) data.country = country;
    if (addressType) data.addressType = addressType;

    const address = await updateAddress(id, req.user.id, data);

    return res.status(200).json({
      message: "Adresse mise a jour.",
      data: serializeForJson(address),
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteAddress(id, req.user.id);
    return res.status(200).json({ message: "Adresse supprimee." });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { getAll, getByuserId, create, update, remove };
