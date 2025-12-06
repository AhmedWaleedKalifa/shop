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
  getById: async (id) => {
    const res = await apiClient.get(`/products/${id}`);
    return res.data;
  },
  create: async (data) => {
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

  // NEW SEARCH METHODS - FIXED SYNTAX
  search: async (filters = {}) => {
    try {
      const { query, category, minPrice, maxPrice, sortBy, sortOrder, page, limit } = filters;
      
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (category) params.append('category', category);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (sortBy) params.append('sortBy', sortBy);
      if (sortOrder) params.append('sortOrder', sortOrder);
      if (page) params.append('page', page);
      if (limit) params.append('limit', limit);

      const res = await apiClient.get(`/products/search?${params.toString()}`);
      return res.data;
    } catch (error) {
      console.log('Search API not available, returning empty results');
      return {
        success: true,
        data: {
          products: [],
          pagination: {
            currentPage: 1,
            totalPages: 0,
            totalCount: 0,
            hasNext: false,
            hasPrev: false
          }
        }
      };
    }
  },

  getPriceRange: async () => {
    try {
      const res = await apiClient.get("/products/price-range");
      return res.data;
    } catch (error) {
      console.log('Price range API not available, returning defaults');
      return {
        success: true,
        data: {
          min: 0,
          max: 1000
        }
      };
    }
  }
};