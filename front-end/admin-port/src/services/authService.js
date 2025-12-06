import apiClient from "./apiClient";

export const authService = {
  register: async (data) => {
    const res = await apiClient.post("/auth/register", data);
    return res.data;
  },

  login: async (email, password) => {
    const res = await apiClient.post("/auth/login", { email, password });

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }

    return res.data;
  },

  logout: async () => {
    const res = await apiClient.get("/auth/logout");
    localStorage.removeItem("token");
    return res.data;
  },
};
