const prisma = require("../config/prisma");

const getOrCreateCart = async (userId) => {
  let cart = await prisma.cart.findFirst({
    where: { userId: BigInt(userId) },
    include: {
      items: {
        include: {
          productVariant: {
            include: {
              product: {
                include: { images: true },
              },
              setVariantItems: {  
                include: {
                  productVariant: {
                    include: {
                      product: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: BigInt(userId) },
      include: {
        items: {
          include: {
            productVariant: {
              include: {
                product: {
                  include: { images: true },
                },
                setVariantItems: {  
                  include: {
                    productVariant: {
                      include: {
                        product: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  return cart;
};

const addToCart = async (userId, productVariantId, quantity) => {
  const cart = await getOrCreateCart(userId);

  // Vérifier si la variante existe déjà dans le panier
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productVariantId: parseInt(productVariantId),
    },
  });

  if (existingItem) {
    // Si oui, on augmente la quantité
    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + parseInt(quantity) },
    });
  }

  // Sinon on crée un nouvel item
  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productVariantId: parseInt(productVariantId),
      quantity: parseInt(quantity),
    },
  });
};

const updateCartItem = async (itemId, quantity) => {
  return prisma.cartItem.update({
    where: { id: parseInt(itemId) },
    data: { quantity: parseInt(quantity) },
  });
};

const deleteCartItem = async (itemId) => {
  return prisma.cartItem.delete({
    where: { id: parseInt(itemId) },
  });
};

const clearCart = async (userId) => {
  const cart = await prisma.cart.findFirst({
    where: { userId: BigInt(userId) },
  });

  if (!cart) return;

  return prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });
};

const calculateTotal = (items) => {
  return items.reduce((total, item) => {
    return total + parseFloat(item.productVariant.price) * item.quantity;
  }, 0);
};

const checkVariantStock = async (productVariantId, quantity) => {
    const variant = await prisma.productVariant.findUnique({
      where: { id: parseInt(productVariantId) },
    });
  
    if (!variant) throw new Error("Variante introuvable.");
    if (variant.stock < quantity) throw new Error("Stock insuffisant.");
  
    return variant;
  };

module.exports = {
  getOrCreateCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
  clearCart,
  calculateTotal,
  checkVariantStock
};