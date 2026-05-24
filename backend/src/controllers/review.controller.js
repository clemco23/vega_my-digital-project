const {
  getProductReviews,
  createReview,
  moderateReview,
  getAllReviews,
} = require("../services/review.service");

const getByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await getProductReviews(productId);
    return res.status(200).json({ data: reviews });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

const create = async (req, res) => {
  try {
    const { productId, note, description } = req.body;

    if (!productId || !note || !description) {
      return res.status(400).json({ message: "Champs obligatoires manquants." });
    }

    const review = await createReview(req.user.id, productId, note, description);
    return res.status(201).json({ message: "Avis envoyé, en attente de modération.", data: review });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const moderate = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["APPROVED", "REJECTED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Statut invalide." });
    }

    const review = await moderateReview(id, status);
    return res.status(200).json({ message: "Avis modéré.", data: review });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

const getAll = async (req, res) => {
  try {
    const reviews = await getAllReviews();
    return res.status(200).json({ data: reviews });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = { getByProduct, create, moderate, getAll };