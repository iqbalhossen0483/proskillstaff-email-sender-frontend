"use client";

import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { LayoutSplitChart } from "@/components/dashboard/LayoutSplitChart";
import { RecentSendsCard } from "@/components/dashboard/RecentSendsCard";
import { StatCards } from "@/components/dashboard/StatCards";
import { TopTemplatesCard } from "@/components/dashboard/TopTemplatesCard";
import { UserActivityCard } from "@/components/dashboard/UserActivityCard";

export default function DashboardPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <StatCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ActivityChart />
        <LayoutSplitChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopTemplatesCard />
        <RecentSendsCard />
      </div>

      <UserActivityCard />
    </div>
  );
}
