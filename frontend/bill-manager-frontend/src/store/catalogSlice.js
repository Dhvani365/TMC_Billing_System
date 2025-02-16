import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedCatalog: null,
  catalogProducts: {
    "Electronics": [
      { id: 1, name: "Smartphone", sku: "EL-1001", image: "/images/smartphone.jpg", priceType: "WSR", price: 12000, discountPercentage: 10 },
      { id: 2, name: "Laptop", sku: "EL-1002", image: "/images/laptop.jpg", priceType: "CP", price: 12400, discountPercentage: 10 },
      { id: 3, name: "Smartwatch", sku: "EL-1003", image: "/images/smartwatch.jpg", priceType: "Both", price: 16700, discountPercentage: 10 },
    ],
    "Groceries": [
      { id: 4, name: "Rice Bag", sku: "GR-2001", image: "/images/rice.jpg", priceType: "both", price: 12000, discountPercentage: 10 },
      { id: 5, name: "Olive Oil", sku: "GR-2002", image: "/images/olive_oil.jpg", priceType: "both", price: 15000, discountPercentage: 10 },
    ],
    "Clothing": [
      { id: 6, name: "Men's T-Shirt", sku: "CL-3001", image: "/images/tshirt.jpg", priceType: "WSR", price: 24000, discountPercentage: 10 },
      { id: 7, name: "Women's Jeans", sku: "CL-3002", image: "/images/jeans.jpg", priceType: "CP", price: 45600, discountPercentage: 10 },
    ],
  },
};

const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {
    setSelectedCatalog: (state, action) => {
      state.selectedCatalog = action.payload;
    },
  },
});

export const { setSelectedCatalog } = catalogSlice.actions;
export default catalogSlice.reducer;
