const prisma = require("../config/prisma");

const getAllContacts = async () => {
  return prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const getContactById = async (id) => {
  return prisma.contact.findUnique({
    // L'id en base est un BigInt, Prisma attend donc un BigInt pour la recherche.
    where: { id: BigInt(id) },
    select: {
      id: true,
      name: true,
      email: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const createContact = async ({ name, email, content }) => {
  return prisma.contact.create({
    data: {
      name,
      email,
      content,
    },
    select: {
      id: true,
      name: true,
      email: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
};
