import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  method: "Cash",
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setPaymentMethod: (state, action) => {
      state.method = action.payload;
    },
  },
});

export const { setPaymentMethod } = paymentSlice.actions;
export default paymentSlice.reducer;
