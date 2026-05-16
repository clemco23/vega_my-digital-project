const {
    getOrCreateCart,
    addToCart,
    updateCartItem,
    deleteCartItem,
    clearCart,
    calculateTotal,
    checkVariantStock
  } = require("../services/cart.service");
  
  const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    const total = calculateTotal(cart.items);

    return res.status(200).json({
      data: {
        id: cart.id,
        items: cart.items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          productVariant: {
            id: item.productVariant.id,
            size: item.productVariant.size,
            price: item.productVariant.price,
            product: {
              id: item.productVariant.product.id,
              name: item.productVariant.product.name,
              productType: item.productVariant.product.productType,
              images: item.productVariant.product.images,
            },
            // Si c'est un SET_PREDEFINED on affiche le contenu
            setItems: item.productVariant.setVariantItems.length > 0
              ? item.productVariant.setVariantItems.map((setItem) => ({
                  quantity: setItem.quantity,
                  productVariant: {
                    id: setItem.productVariant.id,
                    size: setItem.productVariant.size,
                    price: setItem.productVariant.price,
                    product: {
                      name: setItem.productVariant.product.name,
                    },
                  },
                }))
              : [],
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
      const { productVariantId, quantity } = req.body;
  
      if (!productVariantId || !quantity) {
        return res.status(400).json({ message: "Champs obligatoires manquants." });
      }
  
      if (quantity < 1) {
        return res.status(400).json({ message: "La quantité doit être supérieure à 0." });
      }
  
      
      await checkVariantStock(productVariantId, quantity);
      
  
      const item = await addToCart(req.user.id, productVariantId, quantity);
      return res.status(201).json({ message: "Article ajouté au panier.", data: item });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur serveur." });
    }
  };
  
  const updateItem = async (req, res) => {
    try {
      const { itemId } = req.params;
      const { quantity } = req.body;
  
      if (!quantity || quantity < 1) {
        return res.status(400).json({ message: "Quantité invalide." });
      }
  
      const item = await updateCartItem(itemId, quantity);
      return res.status(200).json({ message: "Quantité mise à jour.", data: item });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur serveur." });
    }
  };
  
  const deleteItem = async (req, res) => {
    try {
      const { itemId } = req.params;
      await deleteCartItem(itemId);
      return res.status(200).json({ message: "Article supprimé du panier." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur serveur." });
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
  
  module.exports = { getCart, addItem, updateItem, deleteItem, emptyCart };