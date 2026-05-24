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

    for (const ov of order.orderVariants) {
      await tx.productVariant.update({
        where: { id: ov.productVariantId },
        data: {
          stock: ov.productVariant.stock - ov.quantity,
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
    throw new Error("Cette commande ne peut pas etre payee.");
  }

  return stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${process.env.FRONTEND_URL}/orders/${normalizedOrderId}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/orders/${normalizedOrderId}/cancel`,
    metadata: {
      orderId: normalizedOrderId.toString(),
      userId: userId.toString(),
    },
    line_items: order.orderVariants.map((ov) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: `${ov.productVariant.product.name} - Taille ${ov.productVariant.size}`,
        },
        unit_amount: Math.round(parseFloat(ov.productVariant.price) * 100),
      },
      quantity: ov.quantity,
    })),
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
    throw new Error("Le paiement Stripe n'est pas encore confirme.");
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
  createCheckoutSession,
  confirmCheckoutSession,
  handleWebhook,
};
