import api from "./api";

export const createCheckoutSession = async (orderId) => {
  const { data } = await api.post("/payments/checkout", { orderId });
  return data.url;
};
