"use client";

import { useSession } from "next-auth/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/PageLoader";
import {
  useGetDashboardStatsQuery,
  useGetActivityChartQuery,
  useGetLayoutSplitQuery,
  useGetTopTemplatesQuery,
  useGetRecentSendsQuery,
  useGetUserActivityQuery,
} from "@/store/api/dashboardApi";
import { staggerContainer, staggerItem, fadeIn } from "@/lib/animations";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const LAYOUT_COLORS = { layoutA: "#2563EB", layoutB: "#7C3AED" };

function StatCard({ label, value, loading }: { label: string; value?: number; loading: boolean }) {
  return (
    <Card>
      <CardContent className="pt-6">
        {loading ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-3 bg-muted rounded w-1/2" />
            <div className="h-8 bg-muted rounded w-2/3" />
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold mt-1">{(value ?? 0).toLocaleString()}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const isSuperAdmin = session?.user.role === "super_admin";
  const [activityUserId, setActivityUserId] = useState<string>("all");

  const { data: stats, isFetching: statsFetching } = useGetDashboardStatsQuery();
  const { data: activity, isFetching: activityFetching } = useGetActivityChartQuery(30);
  const { data: layoutSplit } = useGetLayoutSplitQuery();
  const { data: topTemplates } = useGetTopTemplatesQuery();
  const { data: recentSends, isFetching: recentFetching } = useGetRecentSendsQuery();
  const { data: userActivity, isFetching: userActivityFetching } = useGetUserActivityQuery(
    { userId: activityUserId !== "all" ? Number(activityUserId) : undefined },
    { skip: !isSuperAdmin }
  );

  const pieData = layoutSplit
    ? [
        { name: "Layout A", value: layoutSplit.layoutA },
        { name: "Layout B", value: layoutSplit.layoutB },
      ]
    : [];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* Stat cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {[
          { label: "Total sent (all time)", value: stats?.totalAllTime },
          { label: "This month", value: stats?.thisMonth },
          { label: "Today", value: stats?.today },
        ].map((s) => (
          <motion.div key={s.label} variants={staggerItem}>
            <StatCard label={s.label} value={s.value} loading={statsFetching} />
          </motion.div>
        ))}
      </motion.div>

      {/* Activity chart + donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Activity — last 30 days</CardTitle>
          </CardHeader>
          <CardContent>
            {activityFetching ? (
              <div className="h-48 bg-muted rounded animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={activity ?? []}>
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(5)} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="layoutA" name="Layout A" fill={LAYOUT_COLORS.layoutA} stackId="a" />
                  <Bar dataKey="layoutB" name="Layout B" fill={LAYOUT_COLORS.layoutB} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Layout split</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <PieChart width={180} height={180}>
              <Pie data={pieData} cx={85} cy={85} innerRadius={50} outerRadius={80} dataKey="value">
                <Cell fill={LAYOUT_COLORS.layoutA} />
                <Cell fill={LAYOUT_COLORS.layoutB} />
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </CardContent>
        </Card>
      </div>

      {/* Top templates + recent sends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top templates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {!topTemplates ? (
              <TableSkeleton cols={2} rows={5} />
            ) : topTemplates.length === 0 ? (
              <p className="text-sm text-muted-foreground">No sends yet.</p>
            ) : (
              topTemplates.map((t, i) => (
                <div key={t.id} className="flex items-center justify-between py-1.5 text-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 text-muted-foreground font-medium">{i + 1}.</span>
                    <span className="truncate">{t.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {t.layout?.slug === "layout_a" ? "A" : "B"}
                    </Badge>
                  </div>
                  <span className="text-muted-foreground tabular-nums">{t.send_count}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent sends</CardTitle>
          </CardHeader>
          <CardContent>
            {recentFetching ? (
              <TableSkeleton cols={4} rows={5} />
            ) : !recentSends?.length ? (
              <p className="text-sm text-muted-foreground">No sends yet.</p>
            ) : (
              <div className="space-y-2">
                {recentSends.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm py-1.5 border-b last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium">{s.templateName}</p>
                      <p className="text-xs text-muted-foreground">{s.sentByName} · {s.recipientEmails.length} recipients</p>
                    </div>
                    <Badge
                      variant={s.status === "sent" ? "default" : s.status === "failed" ? "destructive" : "secondary"}
                      className="capitalize shrink-0"
                    >
                      {s.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* User activity — Super Admin only */}
      {isSuperAdmin && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">User activity</CardTitle>
            <Select value={activityUserId} onValueChange={(v) => { if (v) setActivityUserId(v); }}>
              <SelectTrigger className="w-44 h-8 text-sm">
                <SelectValue placeholder="All users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All users</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {userActivityFetching ? (
              <TableSkeleton cols={5} rows={5} />
            ) : !userActivity?.data.length ? (
              <p className="text-sm text-muted-foreground">No activity.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-2 font-medium pr-4">Template</th>
                      <th className="pb-2 font-medium pr-4">Sent by</th>
                      <th className="pb-2 font-medium pr-4">Recipients</th>
                      <th className="pb-2 font-medium pr-4">Date</th>
                      <th className="pb-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userActivity.data.map((row) => (
                      <tr key={row.id} className="border-b last:border-0">
                        <td className="py-2.5 pr-4">{row.templateName}</td>
                        <td className="py-2.5 pr-4">{row.sentByName}</td>
                        <td className="py-2.5 pr-4 text-muted-foreground">{row.recipientEmails.length}</td>
                        <td className="py-2.5 pr-4 whitespace-nowrap text-muted-foreground">
                          {row.sentAt ? new Date(row.sentAt).toLocaleDateString() : "—"}
                        </td>
                        <td className="py-2.5">
                          <Badge variant={row.status === "sent" ? "default" : "secondary"} className="capitalize">
                            {row.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
