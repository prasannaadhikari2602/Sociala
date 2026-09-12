import { baseApi } from "../../services/api/baseApi";

export const followApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Now supports pagination (20/page) — backend expected to return
    // a paginated shape: { count, next, previous, results }
    exploreUsers: builder.query({
      query: ({ search = "", page = 1 } = {}) =>
        `api/follows/explore/?q=${encodeURIComponent(search)}&page=${page}&page_size=20`,
      providesTags: (result) =>
        result?.results
          ? [
              ...result.results.map((u) => ({ type: "User", id: u.id })),
              { type: "User", id: "EXPLORE" },
            ]
          : [{ type: "User", id: "EXPLORE" }],
    }),

    getFollowers: builder.query({
      query: (userId) => `api/follows/${userId}/followers/`,
      providesTags: (result, error, userId) => [
        { type: "FollowList", id: `FOLLOWERS-${userId}` },
        { type: "FollowList", id: "LIST" },
      ],
    }),

    getFollowing: builder.query({
      query: (userId) => `api/follows/${userId}/following/`,
      providesTags: (result, error, userId) => [
        { type: "FollowList", id: `FOLLOWING-${userId}` },
        { type: "FollowList", id: "LIST" },
      ],
    }),

    followUser: builder.mutation({
      query: (userId) => ({ url: `api/follows/${userId}/follow/`, method: "POST" }),
      invalidatesTags: (result, error, userId) => [
        { type: "User", id: "EXPLORE" },
        { type: "User", id: userId },
        { type: "FollowList", id: "LIST" },
        { type: "Profile" },
      ],
    }),

    unfollowUser: builder.mutation({
      query: (userId) => ({ url: `api/follows/${userId}/unfollow/`, method: "POST" }),
      invalidatesTags: (result, error, userId) => [
        { type: "User", id: "EXPLORE" },
        { type: "User", id: userId },
        { type: "FollowList", id: "LIST" },
        { type: "Profile" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useExploreUsersQuery,
  useGetFollowersQuery,
  useGetFollowingQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
} = followApi;