import api from "./api";
import { notifyCartState } from "./cart-feedback";

const getCartItemsCount = (items = []) =>
  items.reduce(
    (accumulator, item) => accumulator + (Number(item.quantity) || 0),
    0
  );

const getOrderVariantsCount = (orderVariants = []) =>
  orderVariants.reduce(
    (accumulator, item) => accumulator + (Number(item.quantity) || 0),
    0
  );

export const getCart = async () => {
  const { data } = await api.get("/orders/cart");
  notifyCartState(getCartItemsCount(data.data?.items));
  return data.data;
};

export const addCartItem = async (productVariantId, quantity = 1) => {
  const { data } = await api.post("/orders/cart/add", {
    productVariantId,
    quantity,
  });

  notifyCartState(getOrderVariantsCount(data.data?.orderVariants));
  return data;
};

export const updateCartItem = async (variantId, quantity) => {
  const { data } = await api.put(`/orders/cart/${variantId}`, {
    quantity,
  });

  notifyCartState(getOrderVariantsCount(data.data?.orderVariants));
  return data;
};

export const removeCartItem = async (variantId) => {
  const { data } = await api.delete(`/orders/cart/${variantId}`);
  notifyCartState(getOrderVariantsCount(data.data?.orderVariants));
  return data;
};

export const clearCart = async () => {
  const { data } = await api.delete("/orders/cart/empty");
  notifyCartState(0);
  return data;
};

export const applyCartPromoCode = async (code) => {
  const { data } = await api.post("/orders/cart/promo", { code });
  notifyCartState(getCartItemsCount(data.data?.items));
  return data.data;
};

export const removeCartPromoCode = async () => {
  const { data } = await api.delete("/orders/cart/promo");
  notifyCartState(getCartItemsCount(data.data?.items));
  return data.data;
};
