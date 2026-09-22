import { baseApi } from "../../services/api/baseApi";

export const commentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/posts/posts/<postId>/comments/  -> top-level comments only.
    // Uses PostViewSet's custom `comments` action (which filters
    // parent__isnull=True) rather than CommentViewSet's generic list,
    // since the generic list returns top-level comments AND replies
    // mixed together when only `?post=` is passed.
    getComments: builder.query({
      query: (postId) => `api/posts/posts/${postId}/comments/`,
      providesTags: (result, err, postId) => [{ type: "Comment", id: postId }],
    }),

    // GET /api/posts/comments/?post=<postId>&parent=<commentId> -> replies
    // to a single top-level comment. Uses the generic CommentViewSet list,
    // filtered down to just this comment's children.
    getReplies: builder.query({
      query: ({ postId, parentId }) =>
        `api/posts/comments/?post=${postId}&parent=${parentId}`,
      providesTags: (result, err, { parentId }) => [{ type: "Reply", id: parentId }],
    }),

    // POST /api/posts/comments/ -> create a top-level comment or a reply
    // (pass `parent` to reply to an existing comment).
    createComment: builder.mutation({
      query: ({ post, content, parent }) => ({
        url: "api/posts/comments/",
        method: "POST",
        body: parent ? { post, content, parent } : { post, content },
      }),
      // Refresh this post's comment list and the post itself (comments_count
      // is computed server-side), plus the parent's reply list if this was
      // a reply, so the new reply actually shows up.
      invalidatesTags: (result, err, { post, parent }) =>
        parent
          ? [
              { type: "Comment", id: post },
              { type: "Post", id: post },
              { type: "Reply", id: parent },
            ]
          : [
              { type: "Comment", id: post },
              { type: "Post", id: post },
            ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCommentsQuery,
  useGetRepliesQuery,
  useCreateCommentMutation,
} = commentApi;