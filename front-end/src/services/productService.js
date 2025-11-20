import apiClient from "./apiClient";

export const productService = {
  getAll: async () => {
    const res = await apiClient.get("/products");
    return res.data;
  },
  getAllAdmin: async () => {
    const res = await apiClient.get("/products/admin");
    return res.data;
  },
  getById:async(id)=>{
    const res=await apiClient(`/products/${id}`)
    return res.data
  },
  create: async (data) => {
    // `data` must be FormData because upload.single("imageUrl")
    const res = await apiClient.post("/products", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  update: async (id, data) => {
    const res = await apiClient.put(`/products/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  delete: async (id) => {
    const res = await apiClient.delete(`/products/${id}`);
    return res.data;
  },
};
