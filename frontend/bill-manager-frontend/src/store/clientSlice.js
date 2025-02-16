import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedClient: null,
  clientBrands: {
    "Dhvani Maktuporia": ["BMW", "Apple Reso", "Toyota"],
    "Devanshu Mangal": ["Toyota", "Tata", "Apple Reso"],
    "Deep Gadhiya": ["Apple Reso", "Mercedes-Benz", "Toyota"],
    "Kuldeep Kevat": ["Apple Reso", "BMW", "Jeep"],
    "Malhar Mangtani": ["Apple Reso", "Mercedes-Benz", "BMW"],
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
