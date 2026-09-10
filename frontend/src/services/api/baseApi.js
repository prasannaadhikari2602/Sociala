import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../../features/auth/authSlice";

// Whatever host the browser used to load the frontend is the host it can
// also reach the backend on — this makes the same build work correctly
// from both the laptop (localhost) and a phone on the LAN (192.168.x.x)
// without hardcoding either one.
const getApiBaseUrl = () => {
  const { hostname } = window.location;

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return import.meta.env.VITE_API_URL || "http://localhost:8000";
  }

  return import.meta.env.VITE_API_LAN_URL || "http://192.168.18.9:8000";
};

// Base URL is the root API prefix (e.g. http://localhost:8000/).
// The accounts app is mounted under it, so every endpoint below is called
// as "api/accounts/<path>" (see authApi.js).
const baseQuery = fetchBaseQuery({
  baseUrl: getApiBaseUrl(),
  // Required: auth is entirely via httpOnly JWT cookies (access_token /
  // refresh_token set by LoginView), not an Authorization header. Without
  // this, the browser won't send those cookies on cross-origin requests
  // (e.g. phone -> laptop LAN IP counts as cross-origin).
  credentials: "include",
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