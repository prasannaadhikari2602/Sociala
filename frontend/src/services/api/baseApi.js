import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../../features/auth/authSlice";

// ============================================================
// API BASE URL
// ============================================================
//
// Local development:
// VITE_API_URL=http://192.168.18.9:8000
//
// Production (Vercel):
// VITE_API_URL=https://sociala-backend.onrender.com
//

const API_BASE_URL = import.meta.env.VITE_API_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include",
});


// ============================================================
// RE-AUTHENTICATION
// ============================================================

const baseQueryWithReauth = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQuery(
    args,
    api,
    extraOptions
  );

  // If access token is invalid/expired,
  // log the user out.
  if (result?.error?.status === 401) {
    api.dispatch(logout());
  }

  return result;
};


// ============================================================
// BASE API
// ============================================================

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: baseQueryWithReauth,

  tagTypes: [
    "User",
    "Profile",
    "Interest",
    "Post",
    "Comment",
    "Notification",
    "Report",
    "Share",
    "FollowList",
  ],

  endpoints: () => ({}),
});

