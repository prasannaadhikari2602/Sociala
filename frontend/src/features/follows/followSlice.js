import { createSlice } from "@reduxjs/toolkit";

const followSlice = createSlice({
  name: "follows",
  initialState: { searchTerm: "" },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
  },
});

export const { setSearchTerm } = followSlice.actions;
export default followSlice.reducer;