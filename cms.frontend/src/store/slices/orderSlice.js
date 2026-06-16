import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orderService } from "../../services/orderService";

const initialState = {
  orders: [],
  historyLoading: false,
  historyError: null,
  
  submitLoading: false,
  submitError: null,
  lastSubmittedOrder: null
};

export const submitOrderThunk = createAsyncThunk(
  "orders/submit",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await orderService.createOrder(orderData);
      return response; // { message, orderId, ... }
    } catch (error) {
      return rejectWithValue(error.message || "Failed to submit order");
    }
  }
);

export const getOrderHistoryThunk = createAsyncThunk(
  "orders/fetchHistory",
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrdersByCustomer(customerId);
      return response; // Array of orders
    } catch (error) {
      return rejectWithValue(error.message || "Failed to load order history");
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearSubmitStatus: (state) => {
      state.submitError = null;
      state.lastSubmittedOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Submit Order
      .addCase(submitOrderThunk.pending, (state) => {
        state.submitLoading = true;
        state.submitError = null;
        state.lastSubmittedOrder = null;
      })
      .addCase(submitOrderThunk.fulfilled, (state, action) => {
        state.submitLoading = false;
        state.lastSubmittedOrder = action.payload; // Contains orderId
      })
      .addCase(submitOrderThunk.rejected, (state, action) => {
        state.submitLoading = false;
        state.submitError = action.payload;
      })
      // Get History
      .addCase(getOrderHistoryThunk.pending, (state) => {
        state.historyLoading = true;
        state.historyError = null;
      })
      .addCase(getOrderHistoryThunk.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.orders = action.payload || [];
      })
      .addCase(getOrderHistoryThunk.rejected, (state, action) => {
        state.historyLoading = false;
        state.historyError = action.payload;
        state.orders = [];
      });
  }
});

export const { clearSubmitStatus } = orderSlice.actions;
export default orderSlice.reducer;
