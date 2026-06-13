const prisma = require("../config/prisma");
const {
  getPromoCodeByCode,
  roundCurrency,
  validatePromoCodeForSubtotal,
} = require("./promoCode.service");

const orderVariantInclude = {
  productVariant: {
    include: {
      product: {
        include: { images: true },
      },
      setVariantItems: {
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
  },
};

const cartInclude = {
  promoCode: true,
  orderVariants: {
    include: orderVariantInclude,
  },
};

const orderInclude = {
  promoCode: true,
  address: true,
  payment: true,
  orderVariants: {
    include: orderVariantInclude,
  },
};

const adminOrderInclude = {
  promoCode: true,
  address: true,
  user: {
    select: {
      id: true,
      name: true,
      firstname: true,
      email: true,
    },
  },
  orderVariants: {
    include: orderVariantInclude,
  },
};

const getCartSubtotal = (orderVariants = []) =>
  roundCurrency(
    orderVariants.reduce((total, orderVariant) => {
      return (
        total +
        Number(orderVariant.productVariant?.price || 0) * orderVariant.quantity
      );
    }, 0)
  );

const buildOrderPricing = (order, { requireValidPromo = false } = {}) => {
  const subtotalAmount = getCartSubtotal(order.orderVariants || []);

  if (!order.promoCode) {
    return {
      promoCodeId: null,
      subtotalAmount,
      discountAmount: 0,
      totalAmount: subtotalAmount,
    };
  }

  if (requireValidPromo) {
    const validatedPromo = validatePromoCodeForSubtotal(
      order.promoCode,
      subtotalAmount,
      { throwOnInvalid: true }
    );

    return {
      promoCodeId: order.promoCodeId,
      subtotalAmount: validatedPromo.subtotalAmount,
      discountAmount: validatedPromo.discountAmount,
      totalAmount: validatedPromo.totalAmount,
    };
  }

  const validatedPromo = validatePromoCodeForSubtotal(
    order.promoCode,
    subtotalAmount,
    { throwOnInvalid: false }
  );

  if (!validatedPromo.isValid) {
    return {
      promoCodeId: null,
      subtotalAmount,
      discountAmount: 0,
      totalAmount: subtotalAmount,
    };
  }

  return {
    promoCodeId: order.promoCodeId,
    subtotalAmount: validatedPromo.subtotalAmount,
    discountAmount: validatedPromo.discountAmount,
    totalAmount: validatedPromo.totalAmount,
  };
};

const recalculateOrderPricing = async (
  client,
  orderId,
  { include = cartInclude, removeInvalidPromo = true, requireValidPromo = false } = {}
) => {
  const order = await client.order.findUnique({
    where: { id: orderId },
    include: cartInclude,
  });

  if (!order) {
    throw new Error("Commande introuvable.");
  }

  const pricing = buildOrderPricing(order, { requireValidPromo });
  const promoCodeId =
    order.promoCode && !pricing.promoCodeId && !removeInvalidPromo
      ? order.promoCodeId
      : pricing.promoCodeId;

  await client.order.update({
    where: { id: orderId },
    data: {
      promoCodeId,
      subtotalAmount: pricing.subtotalAmount,
      discountAmount: pricing.discountAmount,
      totalAmount: pricing.totalAmount,
    },
  });

  return client.order.findUnique({
    where: { id: orderId },
    include,
  });
};

const mergeCartIntoPrimary = async (tx, primaryCart, secondaryCart) => {
  if (!primaryCart.promoCodeId && secondaryCart.promoCodeId) {
    await tx.order.update({
      where: { id: primaryCart.id },
      data: { promoCodeId: secondaryCart.promoCodeId },
    });

    primaryCart.promoCodeId = secondaryCart.promoCodeId;
  }

  const secondaryVariants = await tx.orderVariant.findMany({
    where: { orderId: secondaryCart.id },
  });

  for (const secondaryVariant of secondaryVariants) {
    const existingVariant = await tx.orderVariant.findUnique({
      where: {
        orderId_productVariantId: {
          orderId: primaryCart.id,
          productVariantId: secondaryVariant.productVariantId,
        },
      },
    });

    if (existingVariant) {
      await tx.orderVariant.update({
        where: {
          orderId_productVariantId: {
            orderId: primaryCart.id,
            productVariantId: secondaryVariant.productVariantId,
          },
        },
        data: {
          quantity: existingVariant.quantity + secondaryVariant.quantity,
        },
      });

      await tx.orderVariant.delete({
        where: {
          orderId_productVariantId: {
            orderId: secondaryCart.id,
            productVariantId: secondaryVariant.productVariantId,
          },
        },
      });
    } else {
      await tx.orderVariant.update({
        where: {
          orderId_productVariantId: {
            orderId: secondaryCart.id,
            productVariantId: secondaryVariant.productVariantId,
          },
        },
        data: {
          orderId: primaryCart.id,
        },
      });
    }
  }

  await tx.order.delete({
    where: { id: secondaryCart.id },
  });
};

const getOrCreateCart = async (userId) => {
  const normalizedUserId = BigInt(userId);

  return prisma.$transaction(async (tx) => {
    const carts = await tx.order.findMany({
      where: {
        userId: normalizedUserId,
        orderStatus: "CART",
      },
      orderBy: {
        createdAt: "asc",
      },
      include: cartInclude,
    });

    if (carts.length === 0) {
      return tx.order.create({
        data: {
          userId: normalizedUserId,
          orderStatus: "CART",
          promoCodeId: null,
          subtotalAmount: 0,
          discountAmount: 0,
          totalAmount: 0,
        },
        include: cartInclude,
      });
    }

    const [primaryCart, ...secondaryCarts] = carts;

    for (const secondaryCart of secondaryCarts) {
      await mergeCartIntoPrimary(tx, primaryCart, secondaryCart);
    }

    return recalculateOrderPricing(tx, primaryCart.id, {
      include: cartInclude,
      removeInvalidPromo: true,
    });
  });
};

const addToCart = async (userId, productVariantId, quantity = 1) => {
  const cart = await getOrCreateCart(userId);
  const normalizedVariantId = parseInt(productVariantId, 10);
  const normalizedQuantity = parseInt(quantity, 10);

  const variant = await prisma.productVariant.findUnique({
    where: { id: normalizedVariantId },
  });

  if (!variant) throw new Error("Variante introuvable.");
  if (variant.stock < normalizedQuantity) throw new Error("Stock insuffisant.");

  const existingItem = cart.orderVariants.find(
    (orderVariant) => orderVariant.productVariantId === normalizedVariantId
  );

  if (existingItem) {
    await prisma.orderVariant.update({
      where: {
        orderId_productVariantId: {
          orderId: cart.id,
          productVariantId: normalizedVariantId,
        },
      },
      data: {
        quantity: existingItem.quantity + normalizedQuantity,
      },
    });
  } else {
    await prisma.orderVariant.create({
      data: {
        orderId: cart.id,
        productVariantId: normalizedVariantId,
        quantity: normalizedQuantity,
      },
    });
  }

  return recalculateOrderPricing(prisma, cart.id, {
    include: cartInclude,
    removeInvalidPromo: true,
  });
};

const updateCartItem = async (userId, productVariantId, quantity) => {
  const cart = await getOrCreateCart(userId);
  const normalizedVariantId = parseInt(productVariantId, 10);
  const normalizedQuantity = parseInt(quantity, 10);

  if (normalizedQuantity < 1) {
    return removeFromCart(userId, normalizedVariantId);
  }

  const variant = await prisma.productVariant.findUnique({
    where: { id: normalizedVariantId },
  });

  if (!variant) throw new Error("Variante introuvable.");
  if (variant.stock < normalizedQuantity) throw new Error("Stock insuffisant.");

  await prisma.orderVariant.update({
    where: {
      orderId_productVariantId: {
        orderId: cart.id,
        productVariantId: normalizedVariantId,
      },
    },
    data: {
      quantity: normalizedQuantity,
    },
  });

  return recalculateOrderPricing(prisma, cart.id, {
    include: cartInclude,
    removeInvalidPromo: true,
  });
};

const removeFromCart = async (userId, productVariantId) => {
  const cart = await getOrCreateCart(userId);
  const normalizedVariantId = parseInt(productVariantId, 10);

  await prisma.orderVariant.delete({
    where: {
      orderId_productVariantId: {
        orderId: cart.id,
        productVariantId: normalizedVariantId,
      },
    },
  });

  return recalculateOrderPricing(prisma, cart.id, {
    include: cartInclude,
    removeInvalidPromo: true,
  });
};

const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId);

  await prisma.orderVariant.deleteMany({
    where: { orderId: cart.id },
  });

  await prisma.order.update({
    where: { id: cart.id },
    data: {
      promoCodeId: null,
      subtotalAmount: 0,
      discountAmount: 0,
      totalAmount: 0,
    },
  });
};

const applyPromoCodeToCart = async (userId, code) => {
  const cart = await getOrCreateCart(userId);
  const promoCode = await getPromoCodeByCode(code);

  const validatedPromo = validatePromoCodeForSubtotal(
    promoCode,
    getCartSubtotal(cart.orderVariants),
    { throwOnInvalid: true }
  );

  await prisma.order.update({
    where: { id: cart.id },
    data: {
      promoCodeId: promoCode.id,
      subtotalAmount: validatedPromo.subtotalAmount,
      discountAmount: validatedPromo.discountAmount,
      totalAmount: validatedPromo.totalAmount,
    },
  });

  return prisma.order.findUnique({
    where: { id: cart.id },
    include: cartInclude,
  });
};

const removePromoCodeFromCart = async (userId) => {
  const cart = await getOrCreateCart(userId);

  await prisma.order.update({
    where: { id: cart.id },
    data: {
      promoCodeId: null,
      discountAmount: 0,
      totalAmount: getCartSubtotal(cart.orderVariants),
      subtotalAmount: getCartSubtotal(cart.orderVariants),
    },
  });

  return prisma.order.findUnique({
    where: { id: cart.id },
    include: cartInclude,
  });
};

const calculateTotal = (orderVariants) => {
  return getCartSubtotal(orderVariants);
};

const createOrder = async (userId, addressId) => {
  const cart = await getOrCreateCart(userId);

  if (cart.orderVariants.length === 0) {
    throw new Error("Votre panier est vide.");
  }

  const validatedCart = await recalculateOrderPricing(prisma, cart.id, {
    include: cartInclude,
    removeInvalidPromo: false,
    requireValidPromo: Boolean(cart.promoCodeId),
  });

  const address = await prisma.address.findFirst({
    where: { id: parseInt(addressId, 10), userId: BigInt(userId) },
  });

  if (!address) throw new Error("Adresse introuvable.");

  for (const orderVariant of validatedCart.orderVariants) {
    if (orderVariant.productVariant.stock < orderVariant.quantity) {
      throw new Error(
        `Stock insuffisant pour ${orderVariant.productVariant.product.name}.`
      );
    }
  }

  const user = await prisma.user.findUnique({
    where: { id: BigInt(userId) },
  });

  return prisma.order.update({
    where: { id: validatedCart.id },
    data: {
      orderStatus: "PENDING",
      addressId: parseInt(addressId, 10),
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
    include: orderInclude,
  });
};

const getUserOrders = async (userId) => {
  return prisma.order.findMany({
    where: {
      userId: BigInt(userId),
      orderStatus: { not: "CART" },
    },
    orderBy: { createdAt: "desc" },
    include: orderInclude,
  });
};

const getOrderById = async (id, userId) => {
  const order = await prisma.order.findFirst({
    where: {
      id: parseInt(id, 10),
      userId: BigInt(userId),
      orderStatus: { not: "CART" },
    },
    include: orderInclude,
  });

  if (!order) throw new Error("Commande introuvable.");
  return order;
};

const updateOrderStatus = async (id, status) => {
  return prisma.order.update({
    where: { id: parseInt(id, 10) },
    data: { orderStatus: status },
  });
};

const getAllOrders = async () => {
  return prisma.order.findMany({
    where: {
      orderStatus: { not: "CART" },
    },
    orderBy: { createdAt: "desc" },
    include: adminOrderInclude,
  });
};

module.exports = {
  addToCart,
  applyPromoCodeToCart,
  calculateTotal,
  clearCart,
  createOrder,
  getAllOrders,
  getOrCreateCart,
  getOrderById,
  getUserOrders,
  recalculateOrderPricing,
  removeFromCart,
  removePromoCodeFromCart,
  updateCartItem,
  updateOrderStatus,
};
