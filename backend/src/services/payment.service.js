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

const createCheckoutSession = async (orderId, userId) => {
  ensureStripeConfigured();

  const order = await prisma.order.findFirst({
    where: {
      id: parseInt(orderId),
      userId: BigInt(userId),
    },
    include: {
      orderVariants: {
        include: {
          productVariant: {
            include: {
              product : true,
            }
          },
        },
      },
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

  return session;
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
    const orderId = parseInt(session.metadata.orderId);

    // Récupérer la commande avec ses items
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderVariants: {
          include: { 
            productVariant: {
              include: {
                product: true 
              }
            } 
          },
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
    for (const ov of order.orderVariants) {
      await prisma.productVariant.update({
        where: { id: ov.productVariantId },
        data: {
          stock: ov.productVariant.stock - ov.quantity,
        },
      });
    }
    await sendOrderConfirmationEmail(order.customerEmail, order);
  }

  return event;
};

module.exports = { createCheckoutSession, handleWebhook };
