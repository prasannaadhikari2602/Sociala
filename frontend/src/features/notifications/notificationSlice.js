import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notifications",
  initialState: { isPanelOpen: false },
  reducers: {
    togglePanel: (state) => {
      state.isPanelOpen = !state.isPanelOpen;
    },
    closePanel: (state) => {
      state.isPanelOpen = false;
    },
  },
});

export const { togglePanel, closePanel } = notificationSlice.actions;
export default notificationSlice.reducer;