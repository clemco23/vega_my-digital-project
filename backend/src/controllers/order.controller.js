const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
} = require("../services/order.service");

const create = async (req, res) => {
  try {
    const { addressId } = req.body;

    if (!addressId) {
      return res.status(400).json({ message: "Adresse obligatoire." });
    }

    const order = await createOrder(req.user.id, addressId);
    return res.status(201).json({ message: "Commande créée.", data: order });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const orders = await getUserOrders(req.user.id);
    return res.status(200).json({ data: orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await getOrderById(id, req.user.id);
    return res.status(200).json({ data: order });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["PENDING", "PAID", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Statut invalide." });
    }

    const order = await updateOrderStatus(id, status);
    return res.status(200).json({ message: "Statut mis à jour.", data: order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

const getAllAdmin = async (req, res) => {
  try {
    const orders = await getAllOrders();
    return res.status(200).json({ data: orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = { create, getAll, getOne, updateStatus, getAllAdmin };