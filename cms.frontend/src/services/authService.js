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

  forgotPassword: async ({ email }) => {
    const response = await axiosInstance.post("/api/Auth/ForgotPassword", {
      Email: email,
    });
    return response.data;
  },

  resetPassword: async ({ email, token, newPassword }) => {
    const response = await axiosInstance.post("/api/Auth/ResetPassword", {
      Email: email,
      Token: token,
      NewPassword: newPassword,
    });
    return response.data;
  },
};
