import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isEditModalOpen: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    openEditModal: (state) => {
      state.isEditModalOpen = true;
    },
    closeEditModal: (state) => {
      state.isEditModalOpen = false;
    },
  },
});

export const { openEditModal, closeEditModal } = profileSlice.actions;
export default profileSlice.reducer;