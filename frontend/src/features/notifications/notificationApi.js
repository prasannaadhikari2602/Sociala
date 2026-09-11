import { baseApi } from "../../services/api/baseApi";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => "api/notifications/",
      providesTags: [{ type: "Notification", id: "LIST" }],
    }),

    getUnreadCount: builder.query({
      query: () => "api/notifications/unread-count/",
      providesTags: [{ type: "Notification", id: "COUNT" }],
    }),

    markNotificationRead: builder.mutation({
      query: (id) => ({ url: `api/notifications/${id}/read/`, method: "POST" }),
      invalidatesTags: [{ type: "Notification", id: "LIST" }, { type: "Notification", id: "COUNT" }],
    }),

    markAllNotificationsRead: builder.mutation({
      query: () => ({ url: "api/notifications/read-all/", method: "POST" }),
      invalidatesTags: [{ type: "Notification", id: "LIST" }, { type: "Notification", id: "COUNT" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notificationApi;