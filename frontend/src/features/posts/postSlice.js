import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activePostId: null,
  isComposerOpen: false,
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    openPostDetails: (state, action) => {
      state.activePostId = action.payload;
    },
    closePostDetails: (state) => {
      state.activePostId = null;
    },
    openComposer: (state) => {
      state.isComposerOpen = true;
    },
    closeComposer: (state) => {
      state.isComposerOpen = false;
    },
  },
});

export const { openPostDetails, closePostDetails, openComposer, closeComposer } =
  postSlice.actions;
export default postSlice.reducer;