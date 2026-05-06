import { baseApi } from "@/store/api/baseApi";
import type { PaginatedResponse } from "@/types/layouts";

interface DashboardStats {
  totalAllTime: number;
  thisMonth: number;
  today: number;
}

interface ActivityDataPoint {
  date: string;
  layoutA: number;
  layoutB: number;
}

interface LayoutSplit {
  layoutA: number;
  layoutB: number;
}

interface TopTemplate {
  id: number;
  name: string;
  send_count: number;
  layout: { slug: string };
}

interface RecentSend {
  templateName: string;
  layoutSlug: string;
  recipientEmails: string[];
  sentByName: string;
  sentAt: string;
  status: "queued" | "sent" | "failed";
}

interface UserActivityItem {
  id: number;
  templateName: string;
  layoutSlug: string;
  recipientEmails: string[];
  sentByName: string;
  sentAt: string;
  status: string;
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => "/dashboard/stats",
      providesTags: ["Dashboard"],
    }),
    getActivityChart: builder.query<ActivityDataPoint[], number | void>({
      query: (days = 30) => ({ url: "/dashboard/activity", params: { days } }),
      providesTags: ["Dashboard"],
    }),
    getLayoutSplit: builder.query<LayoutSplit, void>({
      query: () => "/dashboard/layout-split",
      providesTags: ["Dashboard"],
    }),
    getTopTemplates: builder.query<TopTemplate[], void>({
      query: () => "/dashboard/top-templates",
      providesTags: ["Dashboard"],
    }),
    getRecentSends: builder.query<RecentSend[], void>({
      query: () => "/dashboard/recent-sends",
      providesTags: ["Dashboard"],
    }),
    getUserActivity: builder.query<
      PaginatedResponse<UserActivityItem>,
      { userId?: number; from?: string; to?: string; page?: number; limit?: number }
    >({
      query: (params) => ({ url: "/dashboard/user-activity", params }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetActivityChartQuery,
  useGetLayoutSplitQuery,
  useGetTopTemplatesQuery,
  useGetRecentSendsQuery,
  useGetUserActivityQuery,
} = dashboardApi;
