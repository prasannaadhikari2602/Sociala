import { baseApi } from "../../services/api/baseApi";

export const postApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFeed: builder.query({
      query: () => "api/posts/posts/",
      providesTags: (result) =>
        result
          ? [
              ...result.map((p) => ({ type: "Post", id: p.id })),
              { type: "Post", id: "FEED" },
              { type: "Share", id: "FEED" },
            ]
          : [{ type: "Post", id: "FEED" }, { type: "Share", id: "FEED" }],
    }),

    getMyPosts: builder.query({
      query: () => "api/posts/posts/?mine=true",
      providesTags: (result) =>
        result
          ? [
              ...result.map((p) => ({ type: "Post", id: p.id })),
              { type: "Post", id: "MINE" },
              { type: "Share", id: "MINE" },
            ]
          : [{ type: "Post", id: "MINE" }, { type: "Share", id: "MINE" }],
    }),

    getUserPosts: builder.query({
      query: (userId) => `api/posts/posts/?user=${userId}`,
      providesTags: (result, err, userId) => [{ type: "Post", id: `USER-${userId}` }],
    }),

    // Only public posts, searchable, paginated 20/page.
    // Backend expected to return { count, next, previous, results }
    explorePosts: builder.query({
      query: ({ search = "", page = 1 } = {}) =>
        `api/posts/posts/?visibility=public&search=${encodeURIComponent(search)}&page=${page}&page_size=20`,
      providesTags: (result) =>
        result?.results
          ? [
              ...result.results.map((p) => ({ type: "Post", id: p.id })),
              { type: "Post", id: "EXPLORE" },
            ]
          : [{ type: "Post", id: "EXPLORE" }],
    }),

    getPost: builder.query({
      query: (id) => `api/posts/posts/${id}/`,
      providesTags: (result, err, id) => [{ type: "Post", id }],
    }),

    createPost: builder.mutation({
      query: (formData) => ({
        url: "api/posts/posts/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Post", id: "FEED" }, { type: "Post", id: "MINE" }],
    }),

    updatePost: builder.mutation({
      query: ({ id, formData }) => ({
        url: `api/posts/posts/${id}/`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (result, err, { id }) => [
        { type: "Post", id },
        { type: "Post", id: "FEED" },
        { type: "Post", id: "MINE" },
      ],
    }),

    deletePost: builder.mutation({
      query: (id) => ({ url: `api/posts/posts/${id}/`, method: "DELETE" }),
      invalidatesTags: [
        { type: "Post", id: "FEED" },
        { type: "Post", id: "MINE" },
        { type: "Post", id: "EXPLORE" },
        { type: "Share", id: "FEED" },
        { type: "Share", id: "MINE" },
      ],
    }),

    likePost: builder.mutation({
      query: (id) => ({ url: `api/posts/posts/${id}/like/`, method: "POST" }),
      invalidatesTags: (result, err, id) => [{ type: "Post", id }],
    }),

    unlikePost: builder.mutation({
      query: (id) => ({ url: `api/posts/posts/${id}/unlike/`, method: "POST" }),
      invalidatesTags: (result, err, id) => [{ type: "Post", id }],
    }),

    // --------------------------------
    // ADMIN: LIST ALL POSTS
    // --------------------------------
    getAdminPosts: builder.query({
      query: ({ search = "" } = {}) =>
        `api/posts/admin/posts/?search=${encodeURIComponent(search)}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map((p) => ({ type: "Post", id: p.id })),
              { type: "Post", id: "ADMIN_LIST" },
            ]
          : [{ type: "Post", id: "ADMIN_LIST" }],
    }),

    // --------------------------------
    // ADMIN: DELETE ANY POST
    // --------------------------------
    adminDeletePost: builder.mutation({
      query: (id) => ({
        url: `api/posts/admin/posts/${id}/delete/`,
        method: "POST",
      }),
      invalidatesTags: [
        { type: "Post", id: "ADMIN_LIST" },
        { type: "Post", id: "FEED" },
        { type: "Post", id: "EXPLORE" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetFeedQuery,
  useGetMyPostsQuery,
  useGetUserPostsQuery,
  useExplorePostsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useUnlikePostMutation,
  useGetAdminPostsQuery,
  useAdminDeletePostMutation,
} = postApi;