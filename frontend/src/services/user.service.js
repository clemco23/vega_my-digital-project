import api from "./api";

export const getAllUsers = async () => {
    const { data } = await api.get("/users");
    return data;
  };
