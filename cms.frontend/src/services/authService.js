import { axiosInstance } from "../api/axiosClient";

export const authService = {
  login: async ({ email, password }) => {
    return axiosInstance.post("/api/Auth/CustomerLogin", {
      Email: email,
      Password: password,
    });
  },

  register: async (userData) => {
    return axiosInstance.post("/api/Auth/CustomerRegister", {
      FullName: userData.fullName,
      Email: userData.email,
      Password: userData.password,
      Phone: userData.phone,
      Address: userData.address,
    });
  },
};
