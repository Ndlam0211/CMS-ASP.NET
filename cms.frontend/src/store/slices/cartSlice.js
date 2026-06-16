import { createSlice } from "@reduxjs/toolkit";

const storedItems = localStorage.getItem("clothing_cart_items")
  ? JSON.parse(localStorage.getItem("clothing_cart_items"))
  : [];

const calculateTotals = (items) => {
  const quantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { quantity, total };
};

const initialTotals = calculateTotals(storedItems);

const initialState = {
  items: storedItems, // Array of products { id, name, price, imageUrl, quantity, stockQuantity }
  totalQuantity: initialTotals.quantity,
  totalAmount: initialTotals.total
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItemIndex = state.items.findIndex((item) => item.id === product.id);

      if (existingItemIndex > -1) {
        const item = state.items[existingItemIndex];
        const newQuantity = item.quantity + quantity;
        
        // Cap quantity at stock level if valid
        if (product.stockQuantity && newQuantity > product.stockQuantity) {
          item.quantity = product.stockQuantity;
        } else {
          item.quantity = newQuantity;
        }
      } else {
        // Enforce inventory constraints on startup
        const startQuantity = Math.min(quantity, product.stockQuantity || 99);
        state.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          stockQuantity: product.stockQuantity,
          categoryProductId: product.categoryProductId,
          quantity: startQuantity
        });
      }

      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.quantity;
      state.totalAmount = totals.total;

      localStorage.setItem("clothing_cart_items", JSON.stringify(state.items));
    },

    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);

      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.quantity;
      state.totalAmount = totals.total;

      localStorage.setItem("clothing_cart_items", JSON.stringify(state.items));
    },

    updateCartQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        const validatedQuantity = Math.max(1, quantity);
        if (existingItem.stockQuantity && validatedQuantity > existingItem.stockQuantity) {
          existingItem.quantity = existingItem.stockQuantity;
        } else {
          existingItem.quantity = validatedQuantity;
        }
      }

      const totals = calculateTotals(state.items);
      state.totalQuantity = totals.quantity;
      state.totalAmount = totals.total;

      localStorage.setItem("clothing_cart_items", JSON.stringify(state.items));
    },

    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      localStorage.removeItem("clothing_cart_items");
    }
  }
});

export const { addToCart, removeFromCart, updateCartQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
