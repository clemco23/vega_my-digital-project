import api from "./api";

export const getPromoCodes = async () => {
  const { data } = await api.get("/promo-codes");
  return data.data;
};

export const createPromoCode = async (payload) => {
  const { data } = await api.post("/promo-codes", payload);
  return data.data;
};

export const deletePromoCode = async (promoCodeId) => {
  const { data } = await api.delete(`/promo-codes/${promoCodeId}`);
  return data;
};
