const prisma = require("../config/prisma");

const { recalculateOrderPricing } = require("./order.service");

const createHttpError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const cleanupWishlistsForVariants = async (tx, variantIds) => {
  const wishlists = await tx.wishlist.findMany({
    where: {
      variants: {
        some: {
          id: { in: variantIds },
        },
      },
    },
    select: { id: true },
  });

  for (const wishlist of wishlists) {
    await tx.wishlist.update({
      where: { id: wishlist.id },
      data: {
        variants: {
          disconnect: variantIds.map((id) => ({ id })),
        },
      },
    });
  }
};

const cleanupCartOrderVariants = async (
  tx,
  variantIds,
  recalculatePricing = recalculateOrderPricing
) => {
  const carts = await tx.order.findMany({
    where: {
      orderStatus: "CART",
      orderVariants: {
        some: {
          productVariantId: { in: variantIds },
        },
      },
    },
    select: { id: true },
  });

  if (carts.length === 0) {
    return;
  }

  const cartIds = carts.map((cart) => cart.id);

  await tx.orderVariant.deleteMany({
    where: {
      orderId: { in: cartIds },
      productVariantId: { in: variantIds },
    },
  });

  const refreshedCarts = await tx.order.findMany({
    where: { id: { in: cartIds } },
    select: { id: true },
  });

  for (const cart of refreshedCarts) {
    await recalculatePricing(tx, cart.id, {
      removeInvalidPromo: true,
    });
  }
};

const assertVariantsNotUsedInOrders = async (tx, variantIds) => {
  const usedOrderVariant = await tx.orderVariant.findFirst({
    where: {
      productVariantId: { in: variantIds },
      order: {
        orderStatus: { not: "CART" },
      },
    },
    include: {
      order: {
        select: {
          id: true,
          orderStatus: true,
        },
      },
      productVariant: {
        include: {
          product: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (usedOrderVariant) {
    throw createHttpError(
      `Impossible de supprimer cette variante car elle est déjà utilisée dans la commande #${usedOrderVariant.order.id}.`,
      409
    );
  }
};

const cleanupVariantRelations = async (
  tx,
  variantIds,
  recalculatePricing = recalculateOrderPricing
) => {
  if (variantIds.length === 0) {
    return;
  }

  await assertVariantsNotUsedInOrders(tx, variantIds);

  await cleanupCartOrderVariants(tx, variantIds, recalculatePricing);
  await cleanupWishlistsForVariants(tx, variantIds);

  await tx.setItem.deleteMany({
    where: {
      OR: [
        { setVariantId: { in: variantIds } },
        { productVariantId: { in: variantIds } },
      ],
    },
  });
};

const getAllProducts = async (client = prisma) => {
  return client.product.findMany({
    where: { isActivated: true },
    include: {
      variants: true,
      images: true,
      skills: {
        include: { skill: true },
      },
    },
  });
};

const getAllProductsAdmin = async (client = prisma) => {
  return client.product.findMany({
    include: {
      variants: true,
      images: true,
      skills: {
        include: { skill: true },
      },
    },
  });
};

const getProductById = async (id, client = prisma) => {
  return client.product.findUnique({
    where: { id: parseInt(id) },
    include: {
      variants: {
        include: {
          setVariantItems: {
            include: {
              productVariant: {
                include: {
                  product: {
                    include: {
                      images: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      images: true,
      skills: {
        include: { skill: true },
      },
    },
  });
};

const createProduct = async ({ name, description, productType, ageMin, ageMax, variants, skillIds }, client = prisma) => {
  return client.product.create({
    data: {
      name,
      description,
      productType,
      ageMin: parseInt(ageMin),
      ageMax: parseInt(ageMax),
      variants: {
        create: variants.map((v) => ({
          size: v.size,
          price: parseFloat(parseFloat(v.price).toFixed(2)),
          stock: parseInt(v.stock),
          holesCount: v.holesCount ? parseInt(v.holesCount) : null,
          holesRequired: v.holesRequired ? parseInt(v.holesRequired) : null,
        })),
      },
      skills: skillIds ? {
        create: skillIds.map((skillId) => ({
          skill: { connect: { id: parseInt(skillId) } },
        })),
      } : undefined,
    },
    include: {
      variants: true,
      skills: { include: { skill: true } },
    },
  });
};

const updateProduct = async (id, data, client = prisma) => {
  return client.product.update({
    where: { id: parseInt(id) },
    data,
    include: {
      variants: true,
      images: true,
    },
  });
};

const deleteProduct = async (
  id,
  client = prisma,
  { recalculatePricing = recalculateOrderPricing } = {}
) => {
  const productId = parseInt(id);

  return client.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: { id: productId },
      include: {
        variants: {
          select: { id: true },
        },
      },
    });

    if (!product) {
      throw createHttpError("Produit introuvable.", 404);
    }

    const variantIds = product.variants.map((variant) => variant.id);

    await cleanupVariantRelations(tx, variantIds, recalculatePricing);

    return tx.product.delete({
      where: { id: productId },
    });
  });
};

const updateVariant = async (variantId, data, client = prisma) => {
  return client.productVariant.update({
    where: { id: parseInt(variantId) },
    data: {
      price: data.price ? parseFloat(parseFloat(data.price).toFixed(2)) : undefined,
      stock: data.stock ? parseInt(data.stock) : undefined,
      holesCount: data.holesCount ? parseInt(data.holesCount) : undefined,
      holesRequired: data.holesRequired ? parseInt(data.holesRequired) : undefined,
    },
  });
};

const addProductImages = async (productId, images, client = prisma) => {
  const lastImage = await client.productImage.findFirst({
    where: { productId: parseInt(productId) },
    orderBy: { position: "desc" },
  });

  const startPosition = lastImage ? lastImage.position + 1 : 1;

  return client.productImage.createMany({
    data: images.map((url, index) => ({
      productId: parseInt(productId),
      url,
      position: startPosition + index,
    })),
  });
};

const deleteProductImage = async (imageId, client = prisma) => {
  return client.productImage.delete({
    where: { id: parseInt(imageId) },
  });
};

const deleteVariant = async (
  variantId,
  client = prisma,
  { recalculatePricing = recalculateOrderPricing } = {}
) => {
  const parsedVariantId = parseInt(variantId);

  return client.$transaction(async (tx) => {
    const variant = await tx.productVariant.findUnique({
      where: { id: parsedVariantId },
      select: { id: true },
    });

    if (!variant) {
      throw createHttpError("Variante introuvable.", 404);
    }

    await cleanupVariantRelations(tx, [parsedVariantId], recalculatePricing);

    return tx.productVariant.delete({
      where: { id: parsedVariantId },
    });
  });
}; 

const getProductsByType = async (type, client = prisma) => {
  return client.product.findMany({
    where: { productType: type, isActivated: true },
    include: {
      variants: true,
      images: true,
      skills: { include: { skill: true } },
    },
  });
};

const getProductsBySkill = async (skillId, client = prisma) => {
  return client.product.findMany({
    where: {
      isActivated: true,
      skills: {
        some: { skillId: parseInt(skillId) },
      },
    },
    include: {
      variants: true,
      images: true,
      skills: { include: { skill: true } },
    },
  });
};

const addSetItem = async (setVariantId, productVariantId, quantity, client = prisma) => {
  const setVariant = await client.productVariant.findUnique({
    where: { id: parseInt(setVariantId) },
    include: { product: true },
  });

  if (!setVariant) throw new Error("Variante introuvable.");

  if (setVariant.product.productType !== "SET_PREDEFINED") {
    throw new Error("Cette variante n'appartient pas à un set prédéfini.");
  }

  return client.setItem.create({
    data: {
      setVariantId: parseInt(setVariantId),
      productVariantId: parseInt(productVariantId),
      quantity: parseInt(quantity),
    },
  });
};

const deleteSetItem = async (itemId, client = prisma) => {
  return client.setItem.delete({
    where: { id: parseInt(itemId) },
  });
};

const addVariant = async (productId, data, client = prisma) => {
  return client.productVariant.create({
    data: {
      productId: parseInt(productId),
      size: data.size,
      price: parseFloat(parseFloat(data.price).toFixed(2)),
      stock: parseInt(data.stock),
      holesCount: data.holesCount ? parseInt(data.holesCount) : null,
      holesRequired: data.holesRequired ? parseInt(data.holesRequired) : null,
    },
  });
};

const addSkillToProduct = async (productId, skillId, client = prisma) => {
  return client.productSkill.create({
    data: {
      productId: parseInt(productId),
      skillId: parseInt(skillId),
    },
  });
};


module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProductsAdmin,
  updateVariant,
  addProductImages,
  deleteProductImage,
  deleteVariant,
  getProductsByType,
  getProductsBySkill,
  addSetItem,
  deleteSetItem,
  addVariant,
  addSkillToProduct,
};

