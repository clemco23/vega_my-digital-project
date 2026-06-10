const {
  getOrCreateWishlist,
  addToWishlist,
  removeFromWishlist,
  getAllWishlists,
} = require("../services/wishlist.service");
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

const mapWishlistItem = (variant) => ({
  id: variant.id,
  quantity: 1,
  size: variant.size,
  price: variant.price,
  holesCount: variant.holesCount,
  holesRequired: variant.holesRequired,
  product: {
    id: variant.product.id,
    name: variant.product.name,
    productType: variant.product.productType,
    images: variant.product.images,
  },
  packItems:
    variant.product.productType === "SET_PREDEFINED"
      ? (variant.setVariantItems || []).map(mapPackItem)
      : [],
});

const serializeWishlist = (wishlist) =>
  serializeForJson({
    id: wishlist.id,
    items: (wishlist.variants || []).map(mapWishlistItem),
  });

const getWishlist = async (req, res) => {
  try {
    const wishlist = await getOrCreateWishlist(req.user.id);

    return res.status(200).json({
      data: serializeWishlist(wishlist),
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

    const wishlist = await addToWishlist(req.user.id, productVariantId);

    return res.status(201).json({
      message: "Produit ajoute a la wishlist.",
      data: serializeWishlist(wishlist),
    });
  } catch (error) {
    if (error.code === "WISHLIST_DUPLICATE") {
      return res.status(409).json({ message: error.message });
    }

    return res.status(400).json({ message: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { variantId } = req.params;
    const wishlist = await removeFromWishlist(req.user.id, variantId);

    return res.status(200).json({
      message: "Produit retire de la wishlist.",
      data: serializeWishlist(wishlist),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

const getAllWishlistsAdmin = async (req, res) => {
  try {
    const wishlists = await getAllWishlists();
    return res.status(200).json({ data: serializeForJson(wishlists) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = { getWishlist, addItem, deleteItem, getAllWishlistsAdmin };
