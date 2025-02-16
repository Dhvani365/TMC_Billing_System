import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedBrand: null,
  brandCatalogs: {
    "Apple Reso": [
      "Electronics", "Grocery"
    ],
    "BMW": [
       "Grocery", "Clothing"
    ],
    "Mercedes": [
        "Electronics", "Grocery", "Clothing"
    ],
  },
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
