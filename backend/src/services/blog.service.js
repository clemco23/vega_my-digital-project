const prisma = require("../config/prisma");

const getAllBlogs = async () => {
  return prisma.blog.findMany({
    where: { isActivated: true },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
};

const getAllBlogsAdmin = async () => {
  return prisma.blog.findMany({
    orderBy: { updatedAt: "desc" },
    include: { category: true },
  });
};

const getBlogBySlug = async (slug) => {
  return prisma.blog.findFirst({
    where: {
      slug,
      isActivated: true,
    },
    include: { category: true },
  });
};

const getBlogById = async (id) => {
  return prisma.blog.findUnique({
    where: { id },
    include: { category: true },
  });
};

const createBlog = async (data) => {
  return prisma.blog.create({ data });
};

const updateBlog = async (id, data) => {
  return prisma.blog.update({
    where: { id: Number.parseInt(id, 10) },
    data,
  });
};

const deleteBlog = async (id) => {
  return prisma.blog.delete({
    where: { id: Number.parseInt(id, 10) },
  });
};

module.exports = {
  getAllBlogs,
  getAllBlogsAdmin,
  getBlogBySlug,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
