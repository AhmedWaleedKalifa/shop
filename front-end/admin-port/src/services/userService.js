import apiClient from "./apiClient";

export const userService = {
  getAll: async () => {
    const res = await apiClient.get("/users");
    return res.data;
  },

  getById: async (id) => {
    const res = await apiClient.get(`/users/${id}`);
    return res.data;
  },

  update: async (id, data) => {
    const res = await apiClient.put(`/users/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await apiClient.delete(`/users/${id}`);
    return res.data;
  },
};
