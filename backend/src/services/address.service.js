const prisma = require("../config/prisma");

const getUserAddresses = async (userId) => {
  return prisma.address.findMany({
    where: { userId: BigInt(userId) },
    orderBy: { createdAt: "desc" },
  });
};

const createAddress = async (userId, data) => {
  return prisma.address.create({
    data: {
      userId: BigInt(userId),
      street: data.street,
      city: data.city,
      postalCode: data.postalCode,
      country: data.country || "France",
      addressType: data.addressType || "SHIPPING",
      relayPointId: data.relayPointId || null,
      relayName: data.relayName || null,
    },
  });
};

const updateAddress = async (id, userId, data) => {
  // Vérifier que l'adresse appartient au user
  const address = await prisma.address.findFirst({
    where: { id: parseInt(id), userId: BigInt(userId) },
  });

  if (!address) throw new Error("Adresse introuvable.");

  return prisma.address.update({
    where: { id: parseInt(id) },
    data,
  });
};

const deleteAddress = async (id, userId) => {
  // Vérifier que l'adresse appartient au user
  const address = await prisma.address.findFirst({
    where: { id: parseInt(id), userId: BigInt(userId) },
  });

  if (!address) throw new Error("Adresse introuvable.");

  return prisma.address.delete({
    where: { id: parseInt(id) },
  });
};

const getUserAddressesById = async (userId) => {
  return prisma.address.findMany({
    where: { userId: BigInt(userId) },
    orderBy: { createdAt: "desc" },
  });
};

module.exports = {
  getUserAddresses,
  getUserAddressesById,
  createAddress,
  updateAddress,
  deleteAddress,
};

