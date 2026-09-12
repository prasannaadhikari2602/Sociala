import { baseApi } from "../../services/api/baseApi";

export const shareApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyShares: builder.query({
      query: () => "api/shares/",
      providesTags: [{ type: "Share", id: "MINE" }],
    }),

    sharePost: builder.mutation({
      query: ({ post, caption }) => ({
        url: "api/shares/",
        method: "POST",
        body: { post, caption },
      }),
      // Invalidate the feed (so the new share appears for followers),
      // "my shares" (profile), and the underlying Post (share count/flags).
      invalidatesTags: [
        { type: "Share", id: "MINE" },
        { type: "Share", id: "FEED" },
        { type: "Post", id: "FEED" },
        { type: "Post", id: "MINE" },
        { type: "Post" },
      ],
    }),

    unsharePost: builder.mutation({
      query: (shareId) => ({ url: `api/shares/${shareId}/`, method: "DELETE" }),
      invalidatesTags: [
        { type: "Share", id: "MINE" },
        { type: "Share", id: "FEED" },
        { type: "Post", id: "FEED" },
        { type: "Post", id: "MINE" },
        { type: "Post" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const { useGetMySharesQuery, useSharePostMutation, useUnsharePostMutation } = shareApi;