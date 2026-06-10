const prisma = require("../config/prisma");

const wishlistInclude = {
  variants: {
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

const getOrCreateWishlist = async (userId) => {
  let wishlist = await prisma.wishlist.findFirst({
    where: { userId: BigInt(userId) },
    include: wishlistInclude,
  });

  if (!wishlist) {
    wishlist = await prisma.wishlist.create({
      data: { userId: BigInt(userId) },
      include: wishlistInclude,
    });
  }

  return wishlist;
};

const addToWishlist = async (userId, productVariantId) => {
  const wishlist = await getOrCreateWishlist(userId);

  const normalizedVariantId = parseInt(productVariantId, 10);
  const alreadyInWishlist = wishlist.variants.some(
    (variant) => variant.id === normalizedVariantId
  );

  if (alreadyInWishlist) {
    const duplicateError = new Error(
      "Ce produit est deja dans votre wishlist."
    );
    duplicateError.code = "WISHLIST_DUPLICATE";
    throw duplicateError;
  }

  await prisma.wishlist.update({
    where: { id: wishlist.id },
    data: {
      variants: {
        connect: { id: normalizedVariantId },
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
        disconnect: { id: parseInt(productVariantId, 10) },
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
      variants: wishlistInclude.variants,
    },
  });
};

module.exports = {
  getOrCreateWishlist,
  addToWishlist,
  removeFromWishlist,
  getAllWishlists,
};
