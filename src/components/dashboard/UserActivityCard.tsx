"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableSkeleton } from "@/components/ui/PageLoader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetUserActivityQuery } from "@/store/api/dashboardApi";
import { useSession } from "next-auth/react";
import { useState } from "react";

export function UserActivityCard() {
  const { data: session } = useSession();
  const isSuperAdmin = session?.user.role === "super_admin";
  const [activityUserId, setActivityUserId] = useState<string>("all");

  const { data: userActivity, isFetching } = useGetUserActivityQuery(
    { userId: activityUserId !== "all" ? Number(activityUserId) : undefined },
    { skip: !isSuperAdmin },
  );

  if (!isSuperAdmin) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">User activity</CardTitle>
        <Select
          value={activityUserId}
          onValueChange={(v) => {
            if (v) setActivityUserId(v);
          }}
        >
          <SelectTrigger className="w-44 h-8 text-sm">
            <SelectValue placeholder="All users" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All users</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {isFetching ? (
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
                    <td className="py-2.5 pr-4 text-muted-foreground">
                      {row.recipientEmails.length}
                    </td>
                    <td className="py-2.5 pr-4 whitespace-nowrap text-muted-foreground">
                      {row.sentAt
                        ? new Date(row.sentAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="py-2.5">
                      <Badge
                        variant={
                          row.status === "sent" ? "default" : "secondary"
                        }
                        className="capitalize"
                      >
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
  );
}
