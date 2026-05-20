const prisma = require("../config/prisma");

const getStats = async () => {
  // On a inversé 'blogsCount' et 'orders' ici pour correspondre aux requêtes en dessous
  const [usersCount, ordersCount, productsCount, newsletterCount, blogsCount, orders] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.product.count(),
    prisma.newsletter.count(),
    prisma.blog.count(), // -> va dans blogsCount
    prisma.order.findMany({ // -> va dans orders
      where: { orderStatus: "PAID" },
      select: { totalAmount: true },
    }),
  ]);

  const totalRevenue = orders.reduce((acc, order) => {
    return acc + parseFloat(order.totalAmount);
  }, 0);

  return {
    usersCount,
    ordersCount,
    productsCount,
    newsletterCount,
    blogsCount,
    totalRevenue: totalRevenue.toFixed(2),
  };
};

module.exports = { getStats };