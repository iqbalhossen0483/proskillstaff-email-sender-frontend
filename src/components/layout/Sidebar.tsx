"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types/layouts";
import { BarChart2, LayoutTemplate, LogOut, Users } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart2 },
  { href: "/templates", label: "Templates", icon: LayoutTemplate },
];

const adminNavItems = [{ href: "/users", label: "Users", icon: Users }];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === UserRole.SUPER_ADMIN;

  const initials =
    session?.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "?";

  const links = isSuperAdmin ? [...navItems, ...adminNavItems] : navItems;

  return (
    <aside className="flex h-full w-60 flex-col border-r bg-primary dark:bg-card text-accent-foreground dark:text-foreground">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-border/50 dark:border-border">
        <Image src="/logo.png" alt="Logo" width={32} height={32} />
        <span className="font-semibold">Email Sender</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname.startsWith(href)
                ? "bg-accent/80 text-accent-foreground dark:text-foreground"
                : "hover:bg-accent/20",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-border/50 dark:border-border px-4 py-4 flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{session?.user.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {session?.user.role === "super_admin" ? "Super Admin" : "Admin"}
          </p>
        </div>
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 bg-muted/60 text-muted-foreground hover:text-foreground"
          onClick={() => signOut({ callbackUrl: "/login" })}
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </aside>
  );
}
