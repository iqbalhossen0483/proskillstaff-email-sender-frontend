"use client";

import { LAYOUT_COLORS } from "@/components/dashboard/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetLayoutSplitQuery } from "@/store/api/dashboardApi";
import { Legend, Pie, PieChart, Tooltip } from "recharts";

export function LayoutSplitChart() {
  const { data } = useGetLayoutSplitQuery();

  const pieData = data
    ? [
        { name: "Layout A", value: data.layoutA, fill: LAYOUT_COLORS.layoutA },
        { name: "Layout B", value: data.layoutB, fill: LAYOUT_COLORS.layoutB },
      ]
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Layout split</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <PieChart width={180} height={180}>
          <Pie
            data={pieData}
            cx={85}
            cy={70}
            innerRadius={38}
            outerRadius={60}
            dataKey="value"
          />
          <Legend />
          <Tooltip />
        </PieChart>
      </CardContent>
    </Card>
  );
}
