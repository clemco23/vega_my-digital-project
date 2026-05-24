import api from "./api";

export const createCheckoutSession = async (orderId) => {
  const { data } = await api.post("/payments/checkout", { orderId });
  return data.url;
};

export const confirmCheckoutSession = async (orderId, sessionId) => {
  const { data } = await api.get(
    `/payments/confirm/${orderId}?session_id=${encodeURIComponent(sessionId)}`
  );
  return data.data;
};
