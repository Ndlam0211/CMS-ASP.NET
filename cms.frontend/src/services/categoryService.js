import { axiosInstance } from "../api/axiosClient";

export const categoryService = {
  getCategories: async () => {
    return axiosInstance.get("/api/CategoriesProducts");
  },
};
