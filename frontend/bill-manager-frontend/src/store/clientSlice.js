import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedClient: null,
  clientCatalogs: {
    "Dhvani Maktuporia": ["Electronics", "Home Appliances", "Fashion"],
    "Devanshu Mangal": ["Groceries", "Fruits & Vegetables", "Dairy"],
    "Deep Gadhiya": ["Books", "Stationery", "Office Supplies"],
    "Kuldeep Kevat": ["Sports Equipment", "Fitness", "Outdoor"],
    "Malhar Mangtani": ["Beauty", "Skincare", "Haircare"],
  },
};

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    setSelectedClient: (state, action) => {
      state.selectedClient = action.payload;
    },
  },
});

export const { setSelectedClient } = clientSlice.actions;
export default clientSlice.reducer;
