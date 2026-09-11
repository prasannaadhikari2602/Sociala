import { baseApi } from "../../services/api/baseApi";

export const commentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getComments: builder.query({
      query: (postId) => `api/posts/posts/${postId}/comments/`,
      providesTags: (result, err, postId) => [{ type: "Comment", id: `POST-${postId}` }],
    }),

    getReplies: builder.query({
      query: (commentId) => `api/posts/comments/?parent=${commentId}`,
      providesTags: (result, err, commentId) => [{ type: "Comment", id: `REPLIES-${commentId}` }],
    }),

    createComment: builder.mutation({
      query: ({ post, content, parent }) => ({
        url: "api/posts/comments/",
        method: "POST",
        body: { post, content, parent: parent || null },
      }),
      invalidatesTags: (result, err, { post, parent }) => [
        { type: "Comment", id: `POST-${post}` },
        { type: "Post", id: post },
        ...(parent ? [{ type: "Comment", id: `REPLIES-${parent}` }] : []),
      ],
    }),

    deleteComment: builder.mutation({
      query: (id) => ({ url: `api/posts/comments/${id}/`, method: "DELETE" }),
      invalidatesTags: [{ type: "Comment" }, { type: "Post" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCommentsQuery,
  useGetRepliesQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} = commentApi;