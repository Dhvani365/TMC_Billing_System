import { createSlice } from '@reduxjs/toolkit';

export const billSlice = createSlice({
  name: 'bill',
  initialState: {
    items: [],
  },
  reducers: {
    addToBill: (state, action) => {
      state.items.push(action.payload);
    },
    removeFromBill: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    resetBill: (state) => {
      state.items = [];
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
        item.total = item.quantity * item.discountedPrice; // Recalculate total
      }
    },
    updateDiscountedPrice: (state, action) => {
      const { id, discountedPrice } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.discountedPrice = discountedPrice;
        item.total = item.quantity * discountedPrice; // Recalculate total
      }
    },
  },
});

export const { addToBill, removeFromBill, resetBill, updateQuantity, updateDiscountedPrice } = billSlice.actions;
export default billSlice.reducer;