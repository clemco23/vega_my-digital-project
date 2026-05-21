const prisma = require("../config/prisma");

const getOrCreateWishlist = async (userId) => {
  let wishlist = await prisma.wishlist.findFirst({
    where: { userId: BigInt(userId) },
    include: {
      variants: {
        include: {
          product: {
            include: { images: true },
          },
        },
      },
    },
  });

  if (!wishlist) {
    wishlist = await prisma.wishlist.create({
      data: { userId: BigInt(userId) },
      include: {
        variants: {
          include: {
            product: {
              include: { images: true },
            },
          },
        },
      },
    });
  }

  return wishlist;
};

const addToWishlist = async (userId, productVariantId) => {
  const wishlist = await getOrCreateWishlist(userId);

  // Vérifier si déjà dans la wishlist
  const alreadyInWishlist = wishlist.variants.some(
    (v) => v.id === parseInt(productVariantId)
  );

  if (alreadyInWishlist) {
    throw new Error("Ce produit est déjà dans votre wishlist.");
  }

  await prisma.wishlist.update({
    where: { id: wishlist.id },
    data: {
      variants: {
        connect: { id: parseInt(productVariantId) },
      },
    },
  });

  return getOrCreateWishlist(userId);
};

const removeFromWishlist = async (userId, productVariantId) => {
  const wishlist = await getOrCreateWishlist(userId);

  await prisma.wishlist.update({
    where: { id: wishlist.id },
    data: {
      variants: {
        disconnect: { id: parseInt(productVariantId) },
      },
    },
  });

  return getOrCreateWishlist(userId);
};

const getAllWishlists = async () => {
  return prisma.wishlist.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          firstname: true,
          email: true,
        },
      },
      variants: {
        include: {
          product: {
            include: { images: true },
          },
        },
      },
    },
  });
};

module.exports = {
  getOrCreateWishlist,
  addToWishlist,
  removeFromWishlist,
  getAllWishlists,
};