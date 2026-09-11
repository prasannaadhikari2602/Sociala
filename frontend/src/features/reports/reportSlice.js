import { createSlice } from "@reduxjs/toolkit";

const reportSlice = createSlice({
  name: "reports",
  initialState: { reportingPostId: null },
  reducers: {
    openReportModal: (state, action) => {
      state.reportingPostId = action.payload;
    },
    closeReportModal: (state) => {
      state.reportingPostId = null;
    },
  },
});

export const { openReportModal, closeReportModal } = reportSlice.actions;
export default reportSlice.reducer;