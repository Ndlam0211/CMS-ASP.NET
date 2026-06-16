import { axiosInstance } from "../api/axiosClient";

export const orderService = {
  createOrder: async (orderData) => {
    const payload = {
      customerId: orderData.customerId,
      shippingAddress: orderData.shippingAddress || orderData.address,
      items: orderData.items || [],
      notes: orderData.notes || `Deliver to: ${orderData.shippingAddress}`,
    };

    return axiosInstance.post("/api/Orders", payload);
  },

  getOrdersByCustomer: async (customerId) => {
    return axiosInstance.get(`/api/Orders/customer/${customerId}`);
  },
};
