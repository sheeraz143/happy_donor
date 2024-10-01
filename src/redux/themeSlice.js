import { createSlice } from "@reduxjs/toolkit";

export const themeSlice = createSlice({
  name: "theme",
  initialState: {
    darkMode: false, // Default to light mode
  },
  reducers: {
    toggleLightMode: (state) => {
      state.darkMode = false;
    },
    toggleDarkMode: (state) => {
      state.darkMode = true;
    },
  },
});

export const { toggleLightMode, toggleDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
