const {
  createCheckoutSession,
  confirmCheckoutSession,
  handleWebhook,
} = require("../services/payment.service");
const { serializeForJson } = require("../utils/serialize");

const checkout = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "orderId obligatoire." });
    }

    const session = await createCheckoutSession(orderId, req.user.id);

    return res.status(200).json({
      message: "Session de paiement creee.",
      url: session.url,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const confirm = async (req, res) => {
  try {
    const { orderId } = req.params;
    const sessionId = req.query.session_id;

    if (!orderId) {
      return res.status(400).json({ message: "orderId obligatoire." });
    }

    if (!sessionId) {
      return res.status(400).json({ message: "session_id obligatoire." });
    }

    const order = await confirmCheckoutSession(orderId, sessionId, req.user.id);

    return res.status(200).json({
      message: "Paiement confirme.",
      data: serializeForJson(order),
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const webhook = async (req, res) => {
  try {
    const signature = req.headers["stripe-signature"];
    await handleWebhook(req.body, signature);
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("WEBHOOK ERREUR:", error);
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { checkout, confirm, webhook };
