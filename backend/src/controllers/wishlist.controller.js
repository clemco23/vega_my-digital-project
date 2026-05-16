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
        items: wishlist.items.map((item) => ({
          id: item.id,
          productVariant: {
            id: item.productVariant.id,
            size: item.productVariant.size,
            price: item.productVariant.price,
            product: {
              id: item.productVariant.product.id,
              name: item.productVariant.product.name,
              images: item.productVariant.product.images,
            },
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

    const item = await addToWishlist(req.user.id, productVariantId);
    return res.status(201).json({ message: "Produit ajouté à la wishlist.", data: item });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    await removeFromWishlist(id);
    return res.status(200).json({ message: "Produit retiré de la wishlist." });
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