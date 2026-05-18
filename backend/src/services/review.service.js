const prisma = require("../config/prisma");

const getProductReviews = async (productId) => {
  return prisma.review.findMany({
    where: {
      productId: parseInt(productId),
      status: "APPROVED",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          firstname: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const createReview = async (userId, productId, note, description) => {
  // Vérifier que le user a commandé ce produit et que la commande est DELIVERED
  const order = await prisma.order.findFirst({
    where: {
      userId: BigInt(userId),
      orderStatus: "DELIVERED",
      items: {
        some: {
          productVariant: {
            productId: parseInt(productId),
          },
        },
      },
    },
  });

  if (!order) {
    throw new Error("Vous devez avoir reçu ce produit pour laisser un avis.");
  }

  // Vérifier que le user n'a pas déjà laissé un avis
  const existingReview = await prisma.review.findFirst({
    where: {
      userId: BigInt(userId),
      productId: parseInt(productId),
    },
  });

  if (existingReview) {
    throw new Error("Vous avez déjà laissé un avis sur ce produit.");
  }

  // Vérifier que la note est entre 1 et 5
  if (note < 1 || note > 5) {
    throw new Error("La note doit être entre 1 et 5.");
  }

  return prisma.review.create({
    data: {
      userId: BigInt(userId),
      productId: parseInt(productId),
      note: parseInt(note),
      description,
    },
  });
};

const moderateReview = async (id, status) => {
  return prisma.review.update({
    where: { id: parseInt(id) },
    data: { status },
  });
};

const getAllReviews = async () => {
  return prisma.review.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          firstname: true,
          email: true,
        },
      },
      product: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

module.exports = {
  getProductReviews,
  createReview,
  moderateReview,
  getAllReviews,
};