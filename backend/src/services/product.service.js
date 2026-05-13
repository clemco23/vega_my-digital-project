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

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProductsAdmin,
};