import { createSlice } from '@reduxjs/toolkit';

const billSlice = createSlice({
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
  },
});

export const { addToBill, removeFromBill, resetBill } = billSlice.actions;
export default billSlice.reducer;
