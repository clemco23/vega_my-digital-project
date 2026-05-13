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
      },
    });
  };


  module.exports = {
    getAllContacts
  };