import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "./catalogSlice";
import orderReducer from "./orderSlice";
import paymentReducer from "./paymentSlice";
import clientReducer from "./clientSlice";
import catalogReducer from "./catalogSlice";

const store = configureStore({
  reducer: {
    menu: menuReducer,
    order: orderReducer,
    payment: paymentReducer,
    client: clientReducer,
    catalog: catalogReducer,
  },
});

export default store;
