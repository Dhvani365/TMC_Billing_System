import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedBrand: null,
};

const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {
    setSelectedBrand: (state, action) => {
      state.selectedBrand = action.payload;
    },
  },
});

export const { setSelectedBrand } = brandSlice.actions;
export default brandSlice.reducer;
