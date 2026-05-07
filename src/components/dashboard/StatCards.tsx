"use client";

import { Card, CardContent } from "@/components/ui/card";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { useGetDashboardStatsQuery } from "@/store/api/dashboardApi";
import { motion } from "framer-motion";

function StatCard({
  label,
  value,
  loading,
}: {
  label: string;
  value?: number;
  loading: boolean;
}) {
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
            <p className="text-3xl font-bold mt-1">
              {(value ?? 0).toLocaleString()}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function StatCards() {
  const { data: stats, isFetching } = useGetDashboardStatsQuery();

  const items = [
    { label: "Total sent (all time)", value: stats?.totalAllTime },
    { label: "This month", value: stats?.thisMonth },
    { label: "Today", value: stats?.today },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
    >
      {items.map((s) => (
        <motion.div key={s.label} variants={staggerItem}>
          <StatCard label={s.label} value={s.value} loading={isFetching} />
        </motion.div>
      ))}
    </motion.div>
  );
}
