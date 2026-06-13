const {
  createPromoCode,
  deletePromoCode,
  getPromoCodeById,
  getPromoCodes,
  updatePromoCode,
} = require("../services/promoCode.service");
const { serializeForJson } = require("../utils/serialize");

const getAll = async (_req, res) => {
  try {
    const promoCodes = await getPromoCodes();

    return res.status(200).json({
      data: serializeForJson(promoCodes),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erreur serveur.",
    });
  }
};

const getOne = async (req, res) => {
  try {
    const promoCode = await getPromoCodeById(req.params.id);

    return res.status(200).json({
      data: serializeForJson(promoCode),
    });
  } catch (error) {
    const statusCode =
      error.message === "Code promo introuvable." ? 404 : 400;

    return res.status(statusCode).json({
      message: error.message,
    });
  }
};

const create = async (req, res) => {
  try {
    const promoCode = await createPromoCode(req.body);

    return res.status(201).json({
      message: "Code promo créé.",
      data: serializeForJson(promoCode),
    });
  } catch (error) {
    const statusCode =
      error.code === "P2002" ? 409 : 400;

    return res.status(statusCode).json({
      message:
        error.code === "P2002"
          ? "Ce code promo existe déjà."
          : error.message,
    });
  }
};

const update = async (req, res) => {
  try {
    const promoCode = await updatePromoCode(req.params.id, req.body);

    return res.status(200).json({
      message: "Code promo mis à jour.",
      data: serializeForJson(promoCode),
    });
  } catch (error) {
    const statusCode =
      error.code === "P2002"
        ? 409
        : error.message === "Code promo introuvable."
          ? 404
          : 400;

    return res.status(statusCode).json({
      message:
        error.code === "P2002"
          ? "Ce code promo existe déjà."
          : error.message,
    });
  }
};

const remove = async (req, res) => {
  try {
    await deletePromoCode(req.params.id);

    return res.status(200).json({
      message: "Code promo supprimé.",
    });
  } catch (error) {
    const statusCode =
      error.message === "ID de code promo invalide."
        ? 400
        : error.message === "Code promo introuvable."
          ? 404
          : 409;

    return res.status(statusCode).json({
      message: error.message,
    });
  }
};

module.exports = {
  create,
  getAll,
  getOne,
  remove,
  update,
};
