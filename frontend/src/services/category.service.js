import api from "./api";

export const getCategories = async () => {
  const { data } = await api.get("/categories");
  return data;
};

export const createCategory = async (payload) => {
  const { data } = await api.post("/categories", payload);
  return data;
};
