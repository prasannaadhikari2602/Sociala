import { baseApi } from "../../services/api/baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => "api/accounts/admin/dashboard-stats",
      providesTags: [{ type: "Dashboard", id: "STATS" }],
    }),
  }),

  overrideExisting: false,
});

export const { useGetDashboardStatsQuery } = dashboardApi;