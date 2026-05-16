const prisma = require("../config/prisma");

const getAllCategories = async () => {
  return prisma.category.findMany();
};

const createCategory = async (name) => {
  return prisma.category.create({ data: { name } });
};

const updateCategory = async (id, data) => {
    return prisma.category.update({
      where: { id: parseInt(id) },
      data,
    });
  };

const deleteCategory = async (id) => {
  return prisma.category.delete({
    where: { id: parseInt(id) },
  });
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};