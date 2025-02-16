import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "./catalogSlice";
import orderReducer from "./orderSlice";
import paymentReducer from "./paymentSlice";
import clientReducer from "./clientSlice";
import catalogReducer from "./catalogSlice";
import brandReducer from "./brandSlice";
import billReducer from './billSlice';
  
const store = configureStore({
  reducer: {
    menu: menuReducer,
    order: orderReducer,
    payment: paymentReducer,
    client: clientReducer,
    catalog: catalogReducer,
    brand: brandReducer,
    bill: billReducer
  },
});

export default store;
