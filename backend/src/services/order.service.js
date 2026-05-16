const prisma = require("../config/prisma");

const createOrder = async (userId, addressId) => {
  // Récupérer le panier du user
 const cart = await prisma.cart.findFirst({
  where: { userId: BigInt(userId) },
  include: {
    items: {
      include: {
        productVariant: {
          include: {
            product: true, 
          },
        },
      },
    },
  },
});

  if (!cart || cart.items.length === 0) {
    throw new Error("Votre panier est vide.");
  }

  // Récupérer l'adresse
  const address = await prisma.address.findFirst({
    where: { id: parseInt(addressId), userId: BigInt(userId) },
  });

  if (!address) throw new Error("Adresse introuvable.");

  // Vérifier le stock de chaque produit
  for (const item of cart.items) {
    if (item.productVariant.stock < item.quantity) {
      throw new Error(`Stock insuffisant pour la variante ${item.productVariant.id}.`);
    }
  }

  // Calculer le total
  const totalAmount = cart.items.reduce((total, item) => {
    return total + parseFloat(item.productVariant.price) * item.quantity;
  }, 0);

  // Récupérer les infos du user
  const user = await prisma.user.findUnique({
    where: { id: BigInt(userId) },
  });

  // Créer la commande
  const order = await prisma.order.create({
    data: {
      userId: BigInt(userId),
      addressId: parseInt(addressId),
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      customerFirstname: user.firstname,
      customerLastname: user.name,
      customerEmail: user.email,
      customerStreet: address.street || "",
      customerCity: address.city,
      customerPostalCode: address.postalCode,
      customerCountry: address.country,
      customerRelayPointId: address.relayPointId || null,
      customerRelayName: address.relayName || null,
      items: {
        create: cart.items.map((item) => ({
          productVariantId: item.productVariantId,
          quantity: item.quantity,
          unitPrice: item.productVariant.price,
          productName: item.productVariant.product.name, 
          variantSize: item.productVariant.size,  
        })),
      },
    },
    include: {
      items: {
        include: {
          productVariant: {
            include: { product: true },
          },
        },
      },
      address: true,
    },
  });

 

  // Vider le panier
  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });

  return order;
};

const getUserOrders = async (userId) => {
  return prisma.order.findMany({
    where: { userId: BigInt(userId) },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
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
    },
    include: {
      items: {
        include: {
          productVariant: {
            include: { product: true },
          },
        },
      },
      address: true,
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
      items: {
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
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
};