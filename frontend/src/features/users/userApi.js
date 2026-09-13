import { baseApi } from "../../services/api/baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // --------------------------------
    // ADMIN: LIST USERS
    // --------------------------------
    getAdminUsers: builder.query({
      query: ({ search = "", role = "", status = "" } = {}) =>
        `api/accounts/admin/users?search=${encodeURIComponent(search)}&role=${role}&status=${status}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map((u) => ({ type: "User", id: u.id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),

    // --------------------------------
    // ADMIN: SUSPEND / UNSUSPEND
    // --------------------------------
    suspendUser: builder.mutation({
      query: (id) => ({
        url: `api/accounts/admin/users/${id}/suspend`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),

    unsuspendUser: builder.mutation({
      query: (id) => ({
        url: `api/accounts/admin/users/${id}/unsuspend`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),

    // --------------------------------
    // ADMIN: DELETE USER
    // --------------------------------
    adminDeleteUser: builder.mutation({
      query: (id) => ({
        url: `api/accounts/admin/users/${id}/delete`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetAdminUsersQuery,
  useSuspendUserMutation,
  useUnsuspendUserMutation,
  useAdminDeleteUserMutation,
} = userApi;