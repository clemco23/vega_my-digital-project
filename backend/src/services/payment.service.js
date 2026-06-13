const stripe = process.env.STRIPE_SECRET_KEY
  ? require("stripe")(process.env.STRIPE_SECRET_KEY)
  : null;
const prisma = require("../config/prisma");
const { sendOrderConfirmationEmail } = require("./mail.service");

const ensureStripeConfigured = () => {
  if (!stripe) {
    throw new Error("Paiement indisponible : STRIPE_SECRET_KEY manquante.");
  }
};

const paymentOrderInclude = {
  promoCode: true,
  orderVariants: {
    include: {
      productVariant: {
        include: {
          product: true,
        },
      },
    },
  },
};

const sendOrderConfirmationEmailSafely = async (order) => {
  if (!order?.customerEmail) {
    return;
  }

  try {
    await sendOrderConfirmationEmail(order.customerEmail, order);
  } catch (error) {
    console.error(
      `Impossible d'envoyer l'email de confirmation pour la commande #${order.id}:`,
      error.message
    );
  }
};

const markOrderAsPaid = async (orderId) => {
  const normalizedOrderId = parseInt(orderId, 10);

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: normalizedOrderId },
      include: paymentOrderInclude,
    });

    if (!order) {
      throw new Error("Commande introuvable.");
    }

    if (order.orderStatus === "PAID") {
      return {
        order,
        justMarkedAsPaid: false,
      };
    }

    const updateResult = await tx.order.updateMany({
      where: {
        id: normalizedOrderId,
        NOT: {
          orderStatus: "PAID",
        },
      },
      data: {
        orderStatus: "PAID",
      },
    });

    if (updateResult.count === 0) {
      const refreshedOrder = await tx.order.findUnique({
        where: { id: normalizedOrderId },
        include: paymentOrderInclude,
      });

      return {
        order: refreshedOrder,
        justMarkedAsPaid: false,
      };
    }

    for (const orderVariant of order.orderVariants) {
      await tx.productVariant.update({
        where: { id: orderVariant.productVariantId },
        data: {
          stock: orderVariant.productVariant.stock - orderVariant.quantity,
        },
      });
    }

    if (order.promoCodeId) {
      await tx.promoCode.update({
        where: { id: order.promoCodeId },
        data: {
          currentUses: {
            increment: 1,
          },
        },
      });
    }

    const refreshedOrder = await tx.order.findUnique({
      where: { id: normalizedOrderId },
      include: paymentOrderInclude,
    });

    return {
      order: refreshedOrder,
      justMarkedAsPaid: true,
    };
  });
};

const createCheckoutSession = async (orderId, userId) => {
  ensureStripeConfigured();

  const normalizedOrderId = parseInt(orderId, 10);
  const order = await prisma.order.findFirst({
    where: {
      id: normalizedOrderId,
      userId: BigInt(userId),
    },
    include: paymentOrderInclude,
  });

  if (!order) {
    throw new Error("Commande introuvable.");
  }

  if (order.orderStatus !== "PENDING") {
    throw new Error("Cette commande ne peut pas être payée.");
  }

  if (Number(order.totalAmount) <= 0) {
    throw new Error(
      "Le total de la commande doit être supérieur à 0 EUR pour le paiement en ligne."
    );
  }

  const itemsCount = order.orderVariants.reduce(
    (total, orderVariant) => total + orderVariant.quantity,
    0
  );
  const promoDescription = order.promoCode
    ? ` • code promo ${order.promoCode.code}`
    : "";

  return stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${process.env.FRONTEND_URL}/orders/${normalizedOrderId}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/orders/${normalizedOrderId}/cancel`,
    metadata: {
      orderId: normalizedOrderId.toString(),
      userId: userId.toString(),
    },
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: `Commande HAPTO #${normalizedOrderId}`,
            description: `${itemsCount} article${itemsCount > 1 ? "s" : ""}${promoDescription}`,
          },
          unit_amount: Math.round(Number(order.totalAmount) * 100),
        },
        quantity: 1,
      },
    ],
  });
};

const confirmCheckoutSession = async (orderId, sessionId, userId) => {
  ensureStripeConfigured();

  if (!sessionId) {
    throw new Error("session_id manquant.");
  }

  const normalizedOrderId = parseInt(orderId, 10);
  const order = await prisma.order.findFirst({
    where: {
      id: normalizedOrderId,
      userId: BigInt(userId),
    },
    select: {
      id: true,
      orderStatus: true,
    },
  });

  if (!order) {
    throw new Error("Commande introuvable.");
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (
    session.metadata?.orderId !== normalizedOrderId.toString() ||
    session.metadata?.userId !== userId.toString()
  ) {
    throw new Error("Session Stripe invalide pour cette commande.");
  }

  if (session.payment_status !== "paid") {
    throw new Error("Le paiement Stripe n'est pas encore confirmé.");
  }

  const result = await markOrderAsPaid(normalizedOrderId);

  if (result.justMarkedAsPaid) {
    await sendOrderConfirmationEmailSafely(result.order);
  }

  return result.order;
};

const handleWebhook = async (payload, signature) => {
  ensureStripeConfigured();

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
    const orderId = parseInt(session.metadata.orderId, 10);
    const result = await markOrderAsPaid(orderId);

    if (result.justMarkedAsPaid) {
      await sendOrderConfirmationEmailSafely(result.order);
    }
  }

  return event;
};

module.exports = {
  confirmCheckoutSession,
  createCheckoutSession,
  handleWebhook,
};
