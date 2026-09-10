import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("auth_user");
const storedToken = localStorage.getItem("auth_access_token");

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  accessToken: storedToken || null,
  isAuthenticated: Boolean(storedToken),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Call after signup/login succeed. `user` is whatever object the
    // backend returns (expects at least { id, email, role }).
    setCredentials: (state, action) => {
      const { user, access } = action.payload;
      state.user = user;
      state.accessToken = access;
      state.isAuthenticated = true;

      localStorage.setItem("auth_user", JSON.stringify(user));
      localStorage.setItem("auth_access_token", access);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;

      localStorage.removeItem("auth_user");
      localStorage.removeItem("auth_access_token");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserRole = (state) => state.auth.user?.role;