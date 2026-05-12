const prisma = require("../config/prisma");

const getAllUsers = async () => {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      firstname: true,
      email: true,
      role: true,
      verifiedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const getUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id: BigInt(id) },
    select: {
      id: true,
      name: true,
      firstname: true,
      email: true,
      role: true,
      verifiedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const updateUser = async (id, data) => {
  return prisma.user.update({
    where: { id: BigInt(id) },
    data,
    select: {
      id: true,
      name: true,
      firstname: true,
      email: true,
      role: true,
      verifiedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const deleteUser = async (id) => {
  return prisma.user.delete({
    where: { id: BigInt(id) },
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};