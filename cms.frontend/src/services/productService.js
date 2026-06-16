import { axiosInstance } from "../api/axiosClient";

export const productService = {
  getProducts: async (params) => {
    return axiosInstance.get("/api/Products", { params });
  },

  getProductById: async (id) => {
    return axiosInstance.get(`/api/Products/${id}`);
  },

  getProductsByCategory: async (categoryProductId) => {
    return axiosInstance.get(`/api/Products/category/${categoryProductId}`);
  },

  getLatestProducts: async () => {
    return axiosInstance.get("/api/products/latest");
  },

  getFeaturedProducts: async () => {
    return axiosInstance.get("/api/products/featured");
  },
};
