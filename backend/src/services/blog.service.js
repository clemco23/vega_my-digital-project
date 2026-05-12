const prisma = require("../config/prisma");

const getAllBlogs = async () => {
  return prisma.blog.findMany({
    where: { isActivated: true },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
};

const getBlogBySlug = async (slug) => {
  return prisma.blog.findUnique({
    where: { slug },
    include: { category: true },
  });
};

const getBlogById = async (id) => {
  return prisma.blog.findUnique({
    where: { id },
    include: { category: true },
  });
} ;

const createBlog = async (data) => {
  return prisma.blog.create({ data });
};

const updateBlog = async (id, data) => {
  return prisma.blog.update({
    where: { id: parseInt(id) },
    data,
  });
};

const deleteBlog = async (id) => {
  return prisma.blog.delete({
    where: { id: parseInt(id) },
  });
};

module.exports = {
  getAllBlogs,
  getBlogBySlug,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};