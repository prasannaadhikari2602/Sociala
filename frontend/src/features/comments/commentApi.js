import { baseApi } from "../../services/api/baseApi";

export const commentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/posts/posts/<postId>/comments/  -> top-level comments only.
    // Uses PostViewSet's custom `comments` action (which filters
    // parent__isnull=True) rather than CommentViewSet's generic list,
    // since the generic list returns top-level comments AND replies
    // mixed together when only `?post=` is passed.
    //
    // NOTE: adjust this path if your posts/urls.py registers the router
    // differently — this assumes the same "api/posts/posts/" prefix seen
    // in your other post endpoints.
    getComments: builder.query({
      query: (postId) => `api/posts/posts/${postId}/comments/`,
      providesTags: (result, err, postId) => [{ type: "Comment", id: postId }],
    }),

    // POST /api/posts/comments/ -> create a top-level comment or a reply
    // (pass `parent` to reply to an existing comment).
    //
    // NOTE: adjust this path if CommentViewSet is registered under a
    // different route in your router.
    createComment: builder.mutation({
      query: ({ post, content, parent }) => ({
        url: "api/posts/comments/",
        method: "POST",
        body: parent ? { post, content, parent } : { post, content },
      }),
      // Refresh this post's comment list AND the post itself, since
      // comments_count is computed server-side on the Post object.
      invalidatesTags: (result, err, { post }) => [
        { type: "Comment", id: post },
        { type: "Post", id: post },
      ],
    }),
  }),
  overrideExisting: false,
});

export const { useGetCommentsQuery, useCreateCommentMutation } = commentApi;