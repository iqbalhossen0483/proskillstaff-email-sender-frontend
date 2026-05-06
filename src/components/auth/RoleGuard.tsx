"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

interface RoleGuardProps {
  allowedRole: string;
  children: React.ReactNode;
}

export function RoleGuard({ allowedRole, children }: RoleGuardProps) {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (session?.user.role !== allowedRole) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
