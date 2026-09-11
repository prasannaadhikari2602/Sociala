import { baseApi } from "../../services/api/baseApi";

export const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    reportPost: builder.mutation({
      query: ({ post, reason, description }) => ({
        url: "api/reports/",
        method: "POST",
        body: { post, reason, description },
      }),
    }),

    getAdminReports: builder.query({
      query: (status = "pending") => `api/reports/admin/?status=${status}`,
      providesTags: [{ type: "Report", id: "LIST" }],
    }),

    resolveReport: builder.mutation({
      query: ({ id, action }) => ({
        url: `api/reports/admin/${id}/resolve/`,
        method: "POST",
        body: { action },
      }),
      invalidatesTags: [{ type: "Report", id: "LIST" }, { type: "Post" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useReportPostMutation,
  useGetAdminReportsQuery,
  useResolveReportMutation,
} = reportApi;