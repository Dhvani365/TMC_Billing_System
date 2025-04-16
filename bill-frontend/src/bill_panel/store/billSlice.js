import { createSlice } from '@reduxjs/toolkit';

export const billSlice = createSlice({
  name: 'bill',
  initialState: {
    items: [],
    invoiceNumber: '',
    date: '',
    billId: null
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
    setBill: (state, action) => {
      state.items = action.payload;
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
    setMetadata: (state, action) => {
      state.invoiceNumber = action.payload.invoiceNumber;
      state.date = action.payload.date;
      state.billId = action.payload.billId;
    },    
  },
});

export const { addToBill, removeFromBill, resetBill, setBill, updateQuantity, updateDiscountedPrice, setMetadata } = billSlice.actions;
export default billSlice.reducer;