import api from "./api";

export const subscribeToNewsletter = async (email) => {
  const { data } = await api.post("/newsletter", { email });
  return data;
};

export const getNewsletterSubscribers = async () => {
  const { data } = await api.get("/newsletter");
  return data.data;
};


