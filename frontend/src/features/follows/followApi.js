import { baseApi } from "../../services/api/baseApi";

export const followApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    exploreUsers: builder.query({
      query: (search = "") => `api/follows/explore/?q=${encodeURIComponent(search)}`,
      providesTags: [{ type: "User", id: "EXPLORE" }],
    }),

    getFollowers: builder.query({
      query: (userId) => `api/follows/${userId}/followers/`,
      providesTags: (r, e, userId) => [{ type: "User", id: `FOLLOWERS-${userId}` }],
    }),

    getFollowing: builder.query({
      query: (userId) => `api/follows/${userId}/following/`,
      providesTags: (r, e, userId) => [{ type: "User", id: `FOLLOWING-${userId}` }],
    }),

    followUser: builder.mutation({
      query: (userId) => ({ url: `api/follows/${userId}/follow/`, method: "POST" }),
      invalidatesTags: [{ type: "User", id: "EXPLORE" }, { type: "Profile" }],
    }),

    unfollowUser: builder.mutation({
      query: (userId) => ({ url: `api/follows/${userId}/unfollow/`, method: "POST" }),
      invalidatesTags: [{ type: "User", id: "EXPLORE" }, { type: "Profile" }],
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