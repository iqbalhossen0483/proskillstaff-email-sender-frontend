"use client";

import { LAYOUT_COLORS } from "@/components/dashboard/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetActivityChartQuery } from "@/store/api/dashboardApi";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function ActivityChart() {
  const { data, isFetching } = useGetActivityChartQuery(30);

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-base">Activity last 30 days</CardTitle>
      </CardHeader>
      <CardContent>
        {isFetching ? (
          <div className="h-48 bg-muted rounded animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data ?? []}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                tickFormatter={(d) => d.slice(5)}
              />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar
                dataKey="layoutA"
                name="Layout A"
                fill={LAYOUT_COLORS.layoutA}
                stackId="a"
              />
              <Bar
                dataKey="layoutB"
                name="Layout B"
                fill={LAYOUT_COLORS.layoutB}
                stackId="a"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
