import api from "./api";

export const getMyAddresses = async () => {
  const { data } = await api.get("/addresses");
  return data.data;
};

export const createAddress = async (payload) => {
  const { data } = await api.post("/addresses", payload);
  return data.data;
};

export const updateAddress = async (addressId, payload) => {
  const { data } = await api.put(`/addresses/${addressId}`, payload);
  return data.data;
};
