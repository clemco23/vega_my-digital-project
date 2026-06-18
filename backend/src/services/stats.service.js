const prisma = require("../config/prisma");

const getStats = async () => {
  const [usersCount, contactCount, ordersCount, productsCount, newsletterCount, blogsCount, codepromoCount, orders] = await Promise.all([
    prisma.user.count(),
    prisma.contact.count(),
    prisma.order.count({
      where: { orderStatus: { not: "CART" } }, 
    }),
    prisma.product.count(),
    prisma.newsletter.count(),
    prisma.blog.count(),
    prisma.promoCode.count(),
    prisma.order.findMany({
      where: { orderStatus: "PAID" },
      select: { totalAmount: true },
    }),
  ]);

  const totalRevenue = orders.reduce((acc, order) => {
    return acc + parseFloat(order.totalAmount);
  }, 0);

  return {
    usersCount,
    contactCount,
    ordersCount,
    productsCount,
    newsletterCount,
    blogsCount,
    codepromoCount,
    totalRevenue: totalRevenue.toFixed(2),
  };
};

module.exports = { getStats };