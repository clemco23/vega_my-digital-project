const prisma = require("../config/prisma");


const getWishlist = async (userId) => {
  return prisma.wishlist.findFirst({
    where: { userId: BigInt(userId) },
    include: {
      items: {
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
};

const getOrCreateWishlist = async (userId) => {
  let wishlist = await getWishlist(userId);

  if (!wishlist) {
    wishlist = await prisma.wishlist.create({
      data: { userId: BigInt(userId) },
      include: {
        items: {
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

  return wishlist;
};

const addToWishlist = async (userId, productVariantId) => {
  const wishlist = await getOrCreateWishlist(userId);

  const existingItem = await prisma.wishlistItem.findFirst({
    where: {
      wishlistId: wishlist.id,
      productVariantId: parseInt(productVariantId),
    },
  });

  if (existingItem) {
    throw new Error("Ce produit est déjà dans votre wishlist.");
  }

  return prisma.wishlistItem.create({
    data: {
      wishlistId: wishlist.id,
      productVariantId: parseInt(productVariantId),
    },
  });
};

const removeFromWishlist = async (itemId) => {
  return prisma.wishlistItem.delete({
    where: { id: parseInt(itemId) },
  });
};

//admin
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
};

module.exports = {
  getOrCreateWishlist,
  addToWishlist,
  removeFromWishlist,
  getAllWishlists,
};