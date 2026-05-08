const prisma = require("../config/prisma");

const createNewsletterEmail = async (email) => {
  return prisma.newsletter.create({
    data: {
      email,
    },
  });
};

const getNewsletterEmails = async () => {
  return prisma.newsletter.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

module.exports = {
  createNewsletterEmail,
  getNewsletterEmails,
};