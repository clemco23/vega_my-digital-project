const {
  getOrCreateCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  calculateTotal,
} = require("../services/order.service");

// ============ PANIER ============

const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    const total = calculateTotal(cart.orderVariants || []);

    return res.status(200).json({
      data: {
        id: cart.id,
        items: (cart.orderVariants || []).map((ov) => ({
          id: ov.productVariantId,
          quantity: ov.quantity,
          size: ov.productVariant.size,
          price: ov.productVariant.price,
          product: {
            id: ov.productVariant.product.id,
            name: ov.productVariant.product.name,
            productType: ov.productVariant.product.productType,
            images: ov.productVariant.product.images,
          },
        })),
        total: total.toFixed(2),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

const addItem = async (req, res) => {
  try {
    const { productVariantId } = req.body;

    if (!productVariantId) {
      return res.status(400).json({ message: "productVariantId obligatoire." });
    }

    const cart = await addToCart(req.user.id, productVariantId);
    return res.status(200).json({ message: "Produit ajouté au panier.", data: cart });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const removeItem = async (req, res) => {
  try {
    const { variantId } = req.params;
    const cart = await removeFromCart(req.user.id, variantId);
    return res.status(200).json({ message: "Produit retiré du panier.", data: cart });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const emptyCart = async (req, res) => {
  try {
    await clearCart(req.user.id);
    return res.status(200).json({ message: "Panier vidé." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// ============ COMMANDES ============

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

const updateItem = async (req, res) => {
  try {
    const { variantId } = req.params;
    const { quantity } = req.body;

    if (!quantity) {
      return res.status(400).json({ message: "Quantité obligatoire." });
    }

    const cart = await updateCartItem(req.user.id, variantId, quantity);
    return res.status(200).json({ message: "Quantité mise à jour.", data: cart });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { getCart, addItem, updateItem, removeItem, emptyCart, create, getAll, getOne, updateStatus, getAllAdmin };

