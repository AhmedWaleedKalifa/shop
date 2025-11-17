import apiClient from "./apiClient";

export const categoryService = {
  getAll: async () => {
    const res = await apiClient.get("/categories");
    return res.data;
  },

  create: async (data) => {
    // `data` must be FormData because upload.single("imageUrl")
    const res = await apiClient.post("/categories", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  update: async (id, data) => {
    const res = await apiClient.put(`/categories/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  delete: async (id) => {
    const res = await apiClient.delete(`/categories/${id}`);
    return res.data;
  },
};
