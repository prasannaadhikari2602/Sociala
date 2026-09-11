import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../services/api/baseApi";
import authReducer from "../features/auth/authSlice";
import profileReducer from "../features/profiles/profileSlice";
import postReducer from "../features/posts/postSlice";
import commentReducer from "../features/comments/commentSlice";
import followReducer from "../features/follows/followSlice";
import notificationReducer from "../features/notifications/notificationSlice";
import reportReducer from "../features/reports/reportSlice";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    profile: profileReducer,
    posts: postReducer,
    comments: commentReducer,
    follows: followReducer,
    notifications: notificationReducer,
    reports: reportReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(baseApi.middleware),
});

export default store;