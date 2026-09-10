import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../../features/auth/authSlice";

// Base URL is the root API prefix (e.g. http://localhost:8000/api/).
// The accounts app is mounted under it, so every endpoint below is called
// as "accounts/<path>" (see authApi.js).
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  credentials: "include", // send cookies if backend ever switches to cookie-based refresh
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

/**
 * Wraps baseQuery so that a 401 response logs the user out client-side.
 * The backend's urls.py doesn't expose a token-refresh endpoint yet, so
 * there's nothing to silently retry with — we just clear local auth state
 * and let ProtectedRoutes redirect to /login.
 * If you add a refresh endpoint later, this is the place to attempt it
 * before falling back to logout.
 */
const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    api.dispatch(logout());
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User"],
  endpoints: () => ({}),
});