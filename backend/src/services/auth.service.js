const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

const createUser = async ({ name, firstname, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const validationToken = crypto.randomInt(100000, 999999).toString();

  return prisma.user.create({
    data: {
      name,
      firstname,
      email,
      password: hashedPassword,
      validationToken: validationToken,
    },
  });
};

const verifyUser = async (email, token) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("Utilisateur introuvable.");
  }

  if (user.verifiedAt) {
    throw new Error("Compte déjà vérifié.");
  }

  if (user.validationToken !== token) {
    throw new Error("Code invalide.");
  }

  return prisma.user.update({
    where: { email },
    data: {
      verifiedAt: new Date(),
      validationToken: null,
    },
  });
};

const resendVerificationEmail = async (email) => {
  const user = await findUserByEmail(email);

  if (!user) throw new Error("Utilisateur introuvable.");
  if (user.verifiedAt) throw new Error("Compte déjà vérifié.");

  const validationToken = crypto.randomInt(100000, 999999).toString();

  await prisma.user.update({
    where: { email },
    data: { validationToken },
  });

  return validationToken;
};


module.exports = {
  findUserByEmail,
  createUser,
  verifyUser,
  resendVerificationEmail
};