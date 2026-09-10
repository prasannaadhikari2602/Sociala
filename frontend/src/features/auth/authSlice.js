import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  // True once getMe has resolved at least once (success or failure).
  // Lets the app tell "confirmed logged out" apart from "haven't asked
  // the server yet" — e.g. so a route guard doesn't redirect to /login
  // on a fresh page load before getMe has had a chance to run.
  authChecked: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Call after login (via getMe) or after getMe resolves on app load.
    // `user` is whatever MeView returns: { email, username, role }.
    setCredentials: (state, action) => {
      const { user } = action.payload;
      state.user = user;
      state.isAuthenticated = true;
      state.authChecked = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.authChecked = true;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthChecked = (state) => state.auth.authChecked;
export const selectUserRole = (state) => state.auth.user?.role;