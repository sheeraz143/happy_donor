import productSlice from "./product";
import themeReducer from "./themeSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    product: productSlice,
    theme: themeReducer,
  },
});
