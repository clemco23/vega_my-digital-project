const prisma = require("../config/prisma");

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
      variants: true,
      images: true,
      skills: {
        include: { skill: true },
      },
      setItems: {
        include: {
          productVariant: {
            include: { product: true },
          },
        },
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
  return prisma.product.delete({
    where: { id: parseInt(id) },
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
  return prisma.productVariant.delete({
    where: { id: parseInt(variantId) },
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