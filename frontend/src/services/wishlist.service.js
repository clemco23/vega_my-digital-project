import api from "./api";

const normalizeWishlist = (wishlist = {}) => {
  const items = (wishlist.items || []).map((item) => ({
    ...item,
    quantity: Number(item.quantity) || 1,
    packItems: item.packItems || [],
  }));

  const total = items
    .reduce(
      (accumulator, item) =>
        accumulator + (Number(item.price) || 0) * (Number(item.quantity) || 1),
      0
    )
    .toFixed(2);

  return {
    id: wishlist.id,
    items,
    total,
  };
};

export const getWishlist = async () => {
  const { data } = await api.get("/wishlist");
  return normalizeWishlist(data.data);
};

export const addWishlistItem = async (productVariantId) => {
  const { data } = await api.post("/wishlist", {
    productVariantId,
  });

  return normalizeWishlist(data.data);
};

export const removeWishlistItem = async (variantId) => {
  const { data } = await api.delete(`/wishlist/${variantId}`);
  return normalizeWishlist(data.data);
};
