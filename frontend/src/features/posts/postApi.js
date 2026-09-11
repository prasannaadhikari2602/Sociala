import { baseApi } from "../../services/api/baseApi";

export const postApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFeed: builder.query({
      query: () => "api/posts/posts/",
      providesTags: (result) =>
        result
          ? [...result.map((p) => ({ type: "Post", id: p.id })), { type: "Post", id: "FEED" }]
          : [{ type: "Post", id: "FEED" }],
    }),

    getMyPosts: builder.query({
      query: () => "api/posts/posts/?mine=true",
      providesTags: (result) =>
        result
          ? [...result.map((p) => ({ type: "Post", id: p.id })), { type: "Post", id: "MINE" }]
          : [{ type: "Post", id: "MINE" }],
    }),

    getUserPosts: builder.query({
      query: (userId) => `api/posts/posts/?user=${userId}`,
      providesTags: (result, err, userId) => [{ type: "Post", id: `USER-${userId}` }],
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
      invalidatesTags: (result, err, { id }) => [{ type: "Post", id }],
    }),

    deletePost: builder.mutation({
      query: (id) => ({ url: `api/posts/posts/${id}/`, method: "DELETE" }),
      invalidatesTags: [{ type: "Post", id: "FEED" }, { type: "Post", id: "MINE" }],
    }),

    likePost: builder.mutation({
      query: (id) => ({ url: `api/posts/posts/${id}/like/`, method: "POST" }),
      invalidatesTags: (result, err, id) => [{ type: "Post", id }],
    }),

    unlikePost: builder.mutation({
      query: (id) => ({ url: `api/posts/posts/${id}/unlike/`, method: "POST" }),
      invalidatesTags: (result, err, id) => [{ type: "Post", id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetFeedQuery,
  useGetMyPostsQuery,
  useGetUserPostsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useUnlikePostMutation,
} = postApi;