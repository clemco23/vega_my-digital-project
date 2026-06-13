const {
  addToCart,
  applyPromoCodeToCart,
  clearCart,
  createOrder,
  getAllOrders,
  getOrCreateCart,
  getOrderById,
  getUserOrders,
  removeFromCart,
  removePromoCodeFromCart,
  updateCartItem,
  updateOrderStatus,
} = require("../services/order.service");
const { serializeForJson } = require("../utils/serialize");

const mapPackItem = (setItem) => ({
  id: setItem.id,
  quantity: setItem.quantity,
  size: setItem.productVariant.size,
  price: setItem.productVariant.price,
  holesCount: setItem.productVariant.holesCount,
  holesRequired: setItem.productVariant.holesRequired,
  product: {
    id: setItem.productVariant.product.id,
    name: setItem.productVariant.product.name,
    productType: setItem.productVariant.product.productType,
    images: setItem.productVariant.product.images,
  },
});

const mapCartItem = (orderVariant) => ({
  id: orderVariant.productVariantId,
  quantity: orderVariant.quantity,
  size: orderVariant.productVariant.size,
  price: orderVariant.productVariant.price,
  product: {
    id: orderVariant.productVariant.product.id,
    name: orderVariant.productVariant.product.name,
    productType: orderVariant.productVariant.product.productType,
    images: orderVariant.productVariant.product.images,
  },
  packItems:
    orderVariant.productVariant.product.productType === "SET_PREDEFINED"
      ? (orderVariant.productVariant.setVariantItems || []).map(mapPackItem)
      : [],
});

const mapPromoCode = (promoCode) => {
  if (!promoCode) {
    return null;
  }

  return {
    id: promoCode.id,
    code: promoCode.code,
    discountType: promoCode.discountType,
    discountValue: promoCode.discountValue,
    minAmount: promoCode.minAmount,
    maxUses: promoCode.maxUses,
    currentUses: promoCode.currentUses,
    expiresAt: promoCode.expiresAt,
    isActive: promoCode.isActive,
  };
};

const buildCartResponse = (cart) => ({
  id: cart.id,
  items: (cart.orderVariants || []).map(mapCartItem),
  promoCode: mapPromoCode(cart.promoCode),
  subtotal: Number(cart.subtotalAmount || 0).toFixed(2),
  discountAmount: Number(cart.discountAmount || 0).toFixed(2),
  total: Number(cart.totalAmount || 0).toFixed(2),
});

const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);

    return res.status(200).json({
      data: serializeForJson(buildCartResponse(cart)),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

const addItem = async (req, res) => {
  try {
    const { productVariantId, quantity = 1 } = req.body;

    if (!productVariantId) {
      return res.status(400).json({ message: "productVariantId obligatoire." });
    }

    const cart = await addToCart(req.user.id, productVariantId, quantity);

    return res.status(200).json({
      message: "Produit ajouté au panier.",
      data: serializeForJson(cart),
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const removeItem = async (req, res) => {
  try {
    const { variantId } = req.params;
    const cart = await removeFromCart(req.user.id, variantId);

    return res.status(200).json({
      message: "Produit retiré du panier.",
      data: serializeForJson(cart),
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const emptyCart = async (req, res) => {
  try {
    await clearCart(req.user.id);
    return res.status(200).json({ message: "Panier vide." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

const applyPromoCode = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Code promo obligatoire." });
    }

    const cart = await applyPromoCodeToCart(req.user.id, code);

    return res.status(200).json({
      message: "Code promo appliqué.",
      data: serializeForJson(buildCartResponse(cart)),
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const removePromoCode = async (req, res) => {
  try {
    const cart = await removePromoCodeFromCart(req.user.id);

    return res.status(200).json({
      message: "Code promo retiré.",
      data: serializeForJson(buildCartResponse(cart)),
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { addressId } = req.body;

    if (!addressId) {
      return res.status(400).json({ message: "Adresse obligatoire." });
    }

    const order = await createOrder(req.user.id, addressId);

    return res.status(201).json({
      message: "Commande créée.",
      data: serializeForJson(order),
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const orders = await getUserOrders(req.user.id);
    return res.status(200).json({ data: serializeForJson(orders) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await getOrderById(id, req.user.id);
    return res.status(200).json({ data: serializeForJson(order) });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "PENDING",
      "PAID",
      "PREPARING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
      "REFUNDED",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Statut invalide." });
    }

    const order = await updateOrderStatus(id, status);

    return res.status(200).json({
      message: "Statut mis à jour.",
      data: serializeForJson(order),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

const getAllAdmin = async (req, res) => {
  try {
    const orders = await getAllOrders();
    return res.status(200).json({ data: serializeForJson(orders) });
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

    return res.status(200).json({
      message: "Quantité mise à jour.",
      data: serializeForJson(cart),
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  addItem,
  applyPromoCode,
  create,
  emptyCart,
  getAll,
  getAllAdmin,
  getCart,
  getOne,
  removeItem,
  removePromoCode,
  updateItem,
  updateStatus,
};
