import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productService } from "../../services/productService";

const initialState = {
  products: [],
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  pageSize: 8,
  loading: false,
  error: null,

  // Single Product Detail
  currentProduct: null,
  detailLoading: false,
  detailError: null,

  // Latest Products
  latestProducts: [],
  latestProductsLoading: false,
  latestProductsError: null,

  // Featured Products
  featuredProducts: [],
  featuredProductsLoading: false,
  featuredProductsError: null,
};

export const getProductsThunk = createAsyncThunk(
  "products/fetchAll",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await productService.getProducts(filters);
      return response; // Paginated list structure
    } catch (error) {
      return rejectWithValue(error.message || "Failed to load products");
    }
  },
);

export const getProductByIdThunk = createAsyncThunk(
  "products/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await productService.getProductById(id);
      if (!response) throw new Error("Product not found");
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to load product details");
    }
  },
);

export const fetchLatestProducts = createAsyncThunk(
  "products/fetchLatest",
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getLatestProducts();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to load latest products");
    }
  },
);

export const fetchFeaturedProducts = createAsyncThunk(
  "products/fetchFeatured",
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getFeaturedProducts();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to load featured products",
      );
    }
  },
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch catalog
      .addCase(getProductsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.items || [];
        state.currentPage = action.payload.currentPage || 1;
        state.totalPages = action.payload.totalPages || 1;
        state.totalItems = action.payload.totalItems || 0;
        state.pageSize = action.payload.pageSize || 8;
      })
      .addCase(getProductsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.products = [];
      })
      // Fetch details
      .addCase(getProductByIdThunk.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(getProductByIdThunk.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(getProductByIdThunk.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload;
        state.currentProduct = null;
      })
      // Fetch latest products
      .addCase(fetchLatestProducts.pending, (state) => {
        state.latestProductsLoading = true;
        state.latestProductsError = null;
      })
      .addCase(fetchLatestProducts.fulfilled, (state, action) => {
        state.latestProductsLoading = false;
        state.latestProducts = action.payload.products || [];
      })
      .addCase(fetchLatestProducts.rejected, (state, action) => {
        state.latestProductsLoading = false;
        state.latestProductsError = action.payload;
        state.latestProducts = [];
      })
      // Fetch featured products
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.featuredProductsLoading = true;
        state.featuredProductsError = null;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredProductsLoading = false;
        state.featuredProducts = action.payload.products || [];
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.featuredProductsLoading = false;
        state.featuredProductsError = action.payload;
        state.featuredProducts = [];
      });
  },
});

export const { clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
