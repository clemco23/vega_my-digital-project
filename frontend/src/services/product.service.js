import api from "./api";

export const getProductsByType = async (type) => {
  const { data } = await api.get(`/products/type/${type}`);
  return data;
};

export const getBoards = async () => {
  return getProductsByType("BOARD");
};

export const getModules = async () => {
  return getProductsByType("MODULE");
};

export const getProductsAdmin = async () => {
  const { data } = await api.get("/products/admin");
  return data;
};

export const getProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

export const createProduct = async (productData) => {
  const { data } = await api.post("/products", productData);
  return data;
};

export const updateProduct = async (id, productData) => {
  const { data } = await api.put(`/products/${id}`, productData);
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};

export const addVariant = async (productId, variantData) => {
  const { data } = await api.post(`/products/variants/${productId}`, variantData);
  return data;
};

export const updateVariant = async (variantId, variantData) => {
  const { data } = await api.put(`/products/variants/${variantId}`, variantData);
  return data;
};

export const deleteVariant = async (variantId) => {
  const { data } = await api.delete(`/products/variants/${variantId}`);
  return data;
};

export const addImages = async (productId, formData) => {
  const { data } = await api.post(`/products/${productId}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteImage = async (imageId) => {
  const { data } = await api.delete(`/products/images/${imageId}`);
  return data;
};

export const addSetItem = async (productId, setItemData) => {
  const { data } = await api.post(`/products/${productId}/set-items`, setItemData);
  return data;
};

export const deleteSetItem = async (itemId) => {
  const { data } = await api.delete(`/products/set-items/${itemId}`);
  return data;
};
