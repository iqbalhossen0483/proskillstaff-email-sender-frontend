"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden fixed top-0 left-0 z-40 p-3">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={<Button variant="outline" size="icon" className="h-9 w-9" />}
        >
          <Menu className="h-4 w-4" />
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>
    </div>
  );
}
