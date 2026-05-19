const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const prisma = require("../config/prisma");
const { sendOrderConfirmationEmail } = require("./mail.service");

const createCheckoutSession = async (orderId, userId) => {
  const order = await prisma.order.findFirst({
    where: {
      id: parseInt(orderId),
      userId: BigInt(userId),
    },
    include: {
      items: true,
    },
  });

  if (!order) throw new Error("Commande introuvable.");
  if (order.orderStatus !== "PENDING") throw new Error("Cette commande ne peut pas être payée.");

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${process.env.FRONTEND_URL}/orders/${orderId}/success`,
    cancel_url: `${process.env.FRONTEND_URL}/orders/${orderId}/cancel`,
    metadata: {
      orderId: orderId.toString(),
      userId: userId.toString(),
    },
    line_items: order.items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: `${item.productName} - Taille ${item.variantSize}`,
        },
        unit_amount: Math.round(parseFloat(item.unitPrice) * 100), // Stripe utilise les centimes
      },
      quantity: item.quantity,
    })),
  });

  return session;
};

const handleWebhook = async (payload, signature) => {
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    throw new Error(`Webhook invalide: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = parseInt(session.metadata.orderId);

    // Récupérer la commande avec ses items
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { productVariant: true },
        },
      },
    });

    if (!order) throw new Error("Commande introuvable.");

    // Mettre à jour le statut
    await prisma.order.update({
      where: { id: orderId },
      data: { orderStatus: "PAID" },
    });

    // Diminuer le stock
    for (const item of order.items) {
      await prisma.productVariant.update({
        where: { id: item.productVariantId },
        data: {
          stock: item.productVariant.stock - item.quantity,
        },
      });
    }
    await sendOrderConfirmationEmail(order.customerEmail, order);
  }

  return event;
};

module.exports = { createCheckoutSession, handleWebhook };