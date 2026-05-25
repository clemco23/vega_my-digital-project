const prisma = require("../config/prisma");

const createHttpError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const calculateOrderVariantsTotal = (orderVariants) => {
  return orderVariants.reduce((total, orderVariant) => {
    return total + parseFloat(orderVariant.productVariant.price) * orderVariant.quantity;
  }, 0);
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

const cleanupCartOrderVariants = async (tx, variantIds) => {
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
    include: {
      orderVariants: {
        include: {
          productVariant: true,
        },
      },
    },
  });

  for (const cart of refreshedCarts) {
    await tx.order.update({
      where: { id: cart.id },
      data: {
        totalAmount: calculateOrderVariantsTotal(cart.orderVariants),
      },
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
      `Impossible de supprimer cette variante car elle est deja utilisee dans la commande #${usedOrderVariant.order.id}.`,
      409
    );
  }
};

const cleanupVariantRelations = async (tx, variantIds) => {
  if (variantIds.length === 0) {
    return;
  }

  await assertVariantsNotUsedInOrders(tx, variantIds);

  await cleanupCartOrderVariants(tx, variantIds);
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

const getAllProducts = async () => {
  return prisma.product.findMany({
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

const getAllProductsAdmin = async () => {
  return prisma.product.findMany({
    include: {
      variants: true,
      images: true,
      skills: {
        include: { skill: true },
      },
    },
  });
};

const getProductById = async (id) => {
  return prisma.product.findUnique({
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

const createProduct = async ({ name, description, productType, ageMin, ageMax, variants, skillIds }) => {
  return prisma.product.create({
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

const updateProduct = async (id, data) => {
  return prisma.product.update({
    where: { id: parseInt(id) },
    data,
    include: {
      variants: true,
      images: true,
    },
  });
};

const deleteProduct = async (id) => {
  const productId = parseInt(id);

  return prisma.$transaction(async (tx) => {
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

    await cleanupVariantRelations(tx, variantIds);

    return tx.product.delete({
      where: { id: productId },
    });
  });
};

const updateVariant = async (variantId, data) => {
  return prisma.productVariant.update({
    where: { id: parseInt(variantId) },
    data: {
      price: data.price ? parseFloat(parseFloat(data.price).toFixed(2)) : undefined,
      stock: data.stock ? parseInt(data.stock) : undefined,
      holesCount: data.holesCount ? parseInt(data.holesCount) : undefined,
      holesRequired: data.holesRequired ? parseInt(data.holesRequired) : undefined,
    },
  });
};

const addProductImages = async (productId, images) => {
  const lastImage = await prisma.productImage.findFirst({
    where: { productId: parseInt(productId) },
    orderBy: { position: "desc" },
  });

  const startPosition = lastImage ? lastImage.position + 1 : 1;

  return prisma.productImage.createMany({
    data: images.map((url, index) => ({
      productId: parseInt(productId),
      url,
      position: startPosition + index,
    })),
  });
};

const deleteProductImage = async (imageId) => {
  return prisma.productImage.delete({
    where: { id: parseInt(imageId) },
  });
};

const deleteVariant = async (variantId) => {
  const parsedVariantId = parseInt(variantId);

  return prisma.$transaction(async (tx) => {
    const variant = await tx.productVariant.findUnique({
      where: { id: parsedVariantId },
      select: { id: true },
    });

    if (!variant) {
      throw createHttpError("Variante introuvable.", 404);
    }

    await cleanupVariantRelations(tx, [parsedVariantId]);

    return tx.productVariant.delete({
      where: { id: parsedVariantId },
    });
  });
}; 

const getProductsByType = async (type) => {
  return prisma.product.findMany({
    where: { productType: type, isActivated: true },
    include: {
      variants: true,
      images: true,
      skills: { include: { skill: true } },
    },
  });
};

const getProductsBySkill = async (skillId) => {
  return prisma.product.findMany({
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

const addSetItem = async (setVariantId, productVariantId, quantity) => {
  console.log("setVariantId reçu:", setVariantId);

  const setVariant = await prisma.productVariant.findUnique({
    where: { id: parseInt(setVariantId) },
    include: { product: true },
  });

  console.log("setVariant trouvé:", setVariant);

  if (!setVariant) throw new Error("Variante introuvable.");

  if (setVariant.product.productType !== "SET_PREDEFINED") {
    throw new Error("Cette variante n'appartient pas à un set prédéfini.");
  }

  return prisma.setItem.create({
    data: {
      setVariantId: parseInt(setVariantId),
      productVariantId: parseInt(productVariantId),
      quantity: parseInt(quantity),
    },
  });
};

const deleteSetItem = async (itemId) => {
  return prisma.setItem.delete({
    where: { id: parseInt(itemId) },
  });
};

const addVariant = async (productId, data) => {
  return prisma.productVariant.create({
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

const addSkillToProduct = async (productId, skillId) => {
  return prisma.productSkill.create({
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
