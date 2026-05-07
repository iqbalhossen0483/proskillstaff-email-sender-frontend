"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/PageLoader";
import { useGetTopTemplatesQuery } from "@/store/api/dashboardApi";

export function TopTemplatesCard() {
  const { data: topTemplates } = useGetTopTemplatesQuery();

  return (
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
            <div
              key={t.id}
              className="flex items-center justify-between py-1.5 text-sm"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 text-muted-foreground font-medium">
                  {i + 1}.
                </span>
                <span className="truncate">{t.name}</span>
                <Badge variant="outline" className="text-xs">
                  {t.layout?.slug === "layout_a" ? "A" : "B"}
                </Badge>
              </div>
              <span className="text-muted-foreground tabular-nums">
                {t.send_count}
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
