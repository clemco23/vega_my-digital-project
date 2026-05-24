import api from "./api";

export const createOrder = async (addressId) => {
  const { data } = await api.post("/orders", { addressId });
  return data.data;
};

export const getMyOrders = async () => {
  const { data } = await api.get("/orders");
  return data.data;
};
