const prisma = require("../config/prisma");

// ============ PANIER ============

const getOrCreateCart = async (userId) => {
  let cart = await prisma.order.findFirst({
    where: {
      userId: BigInt(userId),
      orderStatus: "CART",
    },
    include: {
      orderVariants: {
        include: {
          productVariant: {
            include: {
              product: {
                include: { images: true },
              },
            },
          },
        },
      },
    },
  });

  if (!cart) {
    cart = await prisma.order.create({
      data: {
        userId: BigInt(userId),
        orderStatus: "CART",
        totalAmount: 0,
      },
      include: {
        orderVariants: {
          include: {
            productVariant: {
              include: {
                product: {
                  include: { images: true },
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

const addToCart = async (userId, productVariantId, quantity = 1) => {
  const cart = await getOrCreateCart(userId);

  const variant = await prisma.productVariant.findUnique({
    where: { id: parseInt(productVariantId) },
  });

  if (!variant) throw new Error("Variante introuvable.");
  if (variant.stock < quantity) throw new Error("Stock insuffisant.");

  // Vérifier si déjà dans le panier
  const existingItem = cart.orderVariants.find(
    (ov) => ov.productVariantId === parseInt(productVariantId)
  );

  if (existingItem) {
    // Augmenter la quantité
    await prisma.orderVariant.update({
      where: {
        orderId_productVariantId: {
          orderId: cart.id,
          productVariantId: parseInt(productVariantId),
        },
      },
      data: {
        quantity: existingItem.quantity + parseInt(quantity),
      },
    });
  } else {
    // Ajouter au panier
    await prisma.orderVariant.create({
      data: {
        orderId: cart.id,
        productVariantId: parseInt(productVariantId),
        quantity: parseInt(quantity),
      },
    });
  }

  // Mettre à jour le total
  const updatedCart = await getOrCreateCart(userId);
  const total = calculateTotal(updatedCart.orderVariants);
  await prisma.order.update({
    where: { id: cart.id },
    data: { totalAmount: total },
  });

  return getOrCreateCart(userId);
};

const updateCartItem = async (userId, productVariantId, quantity) => {
  const cart = await getOrCreateCart(userId);

  if (quantity < 1) {
    return removeFromCart(userId, productVariantId);
  }

  const variant = await prisma.productVariant.findUnique({
    where: { id: parseInt(productVariantId) },
  });

  if (!variant) throw new Error("Variante introuvable.");
  if (variant.stock < quantity) throw new Error("Stock insuffisant.");

  await prisma.orderVariant.update({
    where: {
      orderId_productVariantId: {
        orderId: cart.id,
        productVariantId: parseInt(productVariantId),
      },
    },
    data: { quantity: parseInt(quantity) },
  });

  // Mettre à jour le total
  const updatedCart = await getOrCreateCart(userId);
  const total = calculateTotal(updatedCart.orderVariants);
  await prisma.order.update({
    where: { id: cart.id },
    data: { totalAmount: total },
  });

  return getOrCreateCart(userId);
};

const removeFromCart = async (userId, productVariantId) => {
  const cart = await getOrCreateCart(userId);

  await prisma.orderVariant.delete({
    where: {
      orderId_productVariantId: {
        orderId: cart.id,
        productVariantId: parseInt(productVariantId),
      },
    },
  });

  // Mettre à jour le total
  const updatedCart = await getOrCreateCart(userId);
  const total = calculateTotal(updatedCart.orderVariants);
  await prisma.order.update({
    where: { id: cart.id },
    data: { totalAmount: total },
  });

  return getOrCreateCart(userId);
};

const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId);

  await prisma.orderVariant.deleteMany({
    where: { orderId: cart.id },
  });

  await prisma.order.update({
    where: { id: cart.id },
    data: { totalAmount: 0 },
  });
};

const calculateTotal = (orderVariants) => {
  return orderVariants.reduce((total, ov) => {
    return total + parseFloat(ov.productVariant.price) * ov.quantity;
  }, 0);
};

// ============ COMMANDES ============

const createOrder = async (userId, addressId) => {
  const cart = await getOrCreateCart(userId);

  if (cart.orderVariants.length === 0) {
    throw new Error("Votre panier est vide.");
  }

  const address = await prisma.address.findFirst({
    where: { id: parseInt(addressId), userId: BigInt(userId) },
  });

  if (!address) throw new Error("Adresse introuvable.");

  for (const ov of cart.orderVariants) {
    if (ov.productVariant.stock < ov.quantity) {
      throw new Error(`Stock insuffisant pour ${ov.productVariant.product.name}.`);
    }
  }

  const user = await prisma.user.findUnique({
    where: { id: BigInt(userId) },
  });

  const order = await prisma.order.update({
    where: { id: cart.id },
    data: {
      orderStatus: "PENDING",
      addressId: parseInt(addressId),
      customerFirstname: user.firstname,
      customerLastname: user.name,
      customerEmail: user.email,
      customerStreet: address.street || "",
      customerCity: address.city,
      customerPostalCode: address.postalCode,
      customerCountry: address.country,
      customerRelayPointId: address.relayPointId || null,
      customerRelayName: address.relayName || null,
      orderDate: new Date(),
    },
    include: {
      orderVariants: {
        include: {
          productVariant: {
            include: { product: true },
          },
        },
      },
      address: true,
    },
  });

  return order;
};

const getUserOrders = async (userId) => {
  return prisma.order.findMany({
    where: {
      userId: BigInt(userId),
      orderStatus: { not: "CART" },
    },
    orderBy: { createdAt: "desc" },
    include: {
      orderVariants: {
        include: {
          productVariant: {
            include: { product: true },
          },
        },
      },
      address: true,
    },
  });
};

const getOrderById = async (id, userId) => {
  const order = await prisma.order.findFirst({
    where: {
      id: parseInt(id),
      userId: BigInt(userId),
      orderStatus: { not: "CART" },
    },
    include: {
      orderVariants: {
        include: {
          productVariant: {
            include: { product: true },
          },
        },
      },
      address: true,
      payment: true,
    },
  });

  if (!order) throw new Error("Commande introuvable.");
  return order;
};

const updateOrderStatus = async (id, status) => {
  return prisma.order.update({
    where: { id: parseInt(id) },
    data: { orderStatus: status },
  });
};

const getAllOrders = async () => {
  return prisma.order.findMany({
    where: {
      orderStatus: { not: "CART" },
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          firstname: true,
          email: true,
        },
      },
      orderVariants: {
        include: {
          productVariant: {
            include: { product: true },
          },
        },
      },
      address: true,
    },
  });
};

module.exports = {
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
};