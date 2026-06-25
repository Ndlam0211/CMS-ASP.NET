import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";
import { getErrorMessage } from "../../helper/message";

const storedUser = localStorage.getItem("customer_user")
  ? JSON.parse(localStorage.getItem("customer_user"))
  : null;

const initialState = {
  user: storedUser,
  loading: false,
  error: null,
  isAuthenticated: !!storedUser,
  forgotPasswordSuccess: false,
  resetPasswordSuccess: false,
  message: null,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      // Save to localStorage
      localStorage.setItem("customer_user", JSON.stringify(data.customer || data));
      console.log("Login Data:", data);
      return data.customer; // Return the user data
    } catch (error) {
      console.error("Login Error:", error);
      return rejectWithValue(
        getErrorMessage(error)
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authService.register(userData);
      console.log("Registration Data:", data);
      // Auto login after registered
      if (data && (data.customer || data.id)) {
        const customerData = data.customer || data;
        const sessionUser = {
          id: customerData.id,
          fullName: customerData.fullName,
          email: customerData.email,
          phone: customerData.phone,
          address: customerData.address,
          token: data.token || "api-session-token"
        };
        localStorage.setItem("customer_user", JSON.stringify(sessionUser));
        return sessionUser;
      }
      return data;
    } catch (error) {
      console.error("Registration Error:", error);
      return rejectWithValue(
        getErrorMessage(error)
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const data = await authService.forgotPassword({ email });
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ email, token, newPassword }, { rejectWithValue }) => {
    try {
      const data = await authService.resetPassword({
        email,
        token,
        newPassword,
      });
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("customer_user");
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    clearAuthMessage: (state) => {
      state.message = null;
      state.forgotPasswordSuccess = false;
      state.resetPasswordSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.forgotPasswordSuccess = false;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || action.payload?.Message;
        state.forgotPasswordSuccess = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.forgotPasswordSuccess = false;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.resetPasswordSuccess = false;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || action.payload?.Message;
        state.resetPasswordSuccess = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.resetPasswordSuccess = false;
      });
  },
});

export const { logout, clearAuthError, clearAuthMessage } = authSlice.actions;
export default authSlice.reducer;
