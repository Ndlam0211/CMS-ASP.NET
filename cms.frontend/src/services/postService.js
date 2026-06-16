import { axiosInstance } from "../api/axiosClient";

export const postService = {
  getPosts: async (params) => {
    return axiosInstance.get("/api/Posts", { params });
  },

  getPostById: async (id) => {
    return axiosInstance.get(`/api/Posts/${id}`);
  },

  getBlogCategories: async () => {
    return axiosInstance.get("/api/Categories");
  },
};
