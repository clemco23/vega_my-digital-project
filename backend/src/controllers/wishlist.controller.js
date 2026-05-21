const {
  getOrCreateWishlist,
  addToWishlist,
  removeFromWishlist,
  getAllWishlists,
} = require("../services/wishlist.service");

const getWishlist = async (req, res) => {
  try {
    const wishlist = await getOrCreateWishlist(req.user.id);

    return res.status(200).json({
      data: {
        id: wishlist.id,
        items: wishlist.variants.map((variant) => ({
          id: variant.id,
          size: variant.size,
          price: variant.price,
          product: {
            id: variant.product.id,
            name: variant.product.name,
            images: variant.product.images,
          },
        })),
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

    const wishlist = await addToWishlist(req.user.id, productVariantId);
    return res.status(201).json({ message: "Produit ajouté à la wishlist.", data: wishlist });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { variantId } = req.params;
    const wishlist = await removeFromWishlist(req.user.id, variantId);

    return res.status(200).json({
      message: "Produit retiré de la wishlist.",
      data: {
        id: wishlist.id,
        items: wishlist.variants.map((variant) => ({
          id: variant.id,
          size: variant.size,
          price: variant.price,
          product: {
            id: variant.product.id,
            name: variant.product.name,
            images: variant.product.images,
          },
        })),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

const getAllWishlistsAdmin = async (req, res) => {
  try {
    const wishlists = await getAllWishlists();
    return res.status(200).json({ data: wishlists });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = { getWishlist, addItem, deleteItem, getAllWishlistsAdmin };