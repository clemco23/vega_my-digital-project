import api from "./api";

export const register = async (name, firstname, email, password) => {
  const { data } = await api.post("/auth/register", { name, firstname, email, password });
  return data;
};

export const login = async (email, password) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};

export const verifyEmail = async (email, token) => {
  const { data } = await api.post("/auth/verify", { email, token });
  return data;
};

export const forgotPassword = async (email) => {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
};

export const resetPassword = async (email, token, newPassword) => {
  const { data } = await api.post("/auth/reset-password", { email, token, newPassword });
  return data;
};

export const resendVerification = async (email) => {
    const { data } = await api.post("/auth/resend-verification", { email });
    return data;
  };

  export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };
