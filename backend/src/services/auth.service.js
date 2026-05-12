const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");

const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

const createUser = async ({ name, firstname, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      name,
      firstname,
      email,
      password: hashedPassword,
    },
  });
};

module.exports = {
  findUserByEmail,
  createUser,
};