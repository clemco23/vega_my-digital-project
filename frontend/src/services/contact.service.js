import api from "./api";

export const createContactMessage = async (name, email, content) => {
  const { data } = await api.post("/contacts", { name, email, content });
  return data;
};