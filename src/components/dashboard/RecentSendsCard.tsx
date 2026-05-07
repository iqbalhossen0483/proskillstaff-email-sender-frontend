"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/PageLoader";
import { useGetRecentSendsQuery } from "@/store/api/dashboardApi";

export function RecentSendsCard() {
  const { data: recentSends, isFetching } = useGetRecentSendsQuery();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent sends</CardTitle>
      </CardHeader>
      <CardContent>
        {isFetching ? (
          <TableSkeleton cols={4} rows={5} />
        ) : !recentSends?.length ? (
          <p className="text-sm text-muted-foreground">No sends yet.</p>
        ) : (
          <div className="space-y-2">
            {recentSends.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-sm py-1.5 border-b last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium">{s.templateName}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.sentByName} · {s.recipientEmails.length} recipients
                  </p>
                </div>
                <Badge
                  variant={
                    s.status === "sent"
                      ? "default"
                      : s.status === "failed"
                        ? "destructive"
                        : "secondary"
                  }
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
  );
}
