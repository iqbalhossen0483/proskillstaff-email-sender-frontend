"use client";

import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { Sidebar } from "@/components/layout/Sidebar";
import { pageTransition } from "@/lib/animations";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:flex shrink-0">
        <Sidebar />
      </div>
      <MobileSidebar />
      <main className="flex-1 overflow-y-auto mt-7 md:mt-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            variants={pageTransition}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
