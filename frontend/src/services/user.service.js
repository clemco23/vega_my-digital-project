import api from "./api";

export const getAllUsers = async () => {
  const { data } = await api.get("/users");
  return data.data;
};

export const getCurrentUserProfile = async () => {
  const { data } = await api.get("/auth/me");
  return data.data;
};

export const updateUserProfile = async (userId, payload) => {
  const { data } = await api.patch(`/users/${userId}`, payload);
  return data.data;
};

export const updateUserRole = async (userId, role) => {
  const { data } = await api.patch(`/users/${userId}/role`, { role });
  return data.data;
};

export const deleteUserAccount = async (userId) => {
  const { data } = await api.delete(`/users/${userId}`);
  return data;
};
