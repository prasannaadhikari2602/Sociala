import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../../features/auth/authSlice";

const getApiBaseUrl = () => {
  const { hostname } = window.location;

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return import.meta.env.VITE_API_URL || "https://sociala-backend.onrender.com";
  }

  return import.meta.env.VITE_API_LAN_URL || "http://192.168.18.9:8000";
};

const baseQuery = fetchBaseQuery({
  baseUrl: getApiBaseUrl(),
  credentials: "include",
});

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