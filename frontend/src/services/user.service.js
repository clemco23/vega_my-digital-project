import api from "./api";

export const getAllUsers = async () => {
  const { data } = await api.get("/users");
  return data.data;
};

export const getCurrentUserProfile = async () => {
  const { data } = await api.get("/auth/me");
  return data.data;
};

export const updateUserRole = async (userId, role) => {
  const { data } = await api.patch(`/users/${userId}/role`, { role });
  return data.data;
};
