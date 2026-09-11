import { createSlice } from "@reduxjs/toolkit";

const commentSlice = createSlice({
  name: "comments",
  initialState: { replyingTo: null },
  reducers: {
    setReplyingTo: (state, action) => {
      state.replyingTo = action.payload;
    },
    clearReplyingTo: (state) => {
      state.replyingTo = null;
    },
  },
});

export const { setReplyingTo, clearReplyingTo } = commentSlice.actions;
export default commentSlice.reducer;