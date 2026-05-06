"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LayoutAPreview } from "@/components/layouts/LayoutAPreview";
import { LayoutBPreview } from "@/components/layouts/LayoutBPreview";
import type { LayoutAContent, LayoutBContent } from "@/types/layouts";

type Mode = "desktop" | "mobile";

interface Props {
  layoutSlug: "layout_a" | "layout_b";
  content: LayoutAContent | LayoutBContent;
}

export function PreviewFrame({ layoutSlug, content }: Props) {
  const [mode, setMode] = useState<Mode>("desktop");

  return (
    <div className="flex flex-col h-full">
      {/* Toggle bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/40">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Preview</span>
        <div className="flex items-center gap-1">
          <Button
            variant={mode === "desktop" ? "secondary" : "ghost"}
            size="icon"
            className="h-7 w-7"
            onClick={() => setMode("desktop")}
            title="Desktop"
          >
            <Monitor className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant={mode === "mobile" ? "secondary" : "ghost"}
            size="icon"
            className="h-7 w-7"
            onClick={() => setMode("mobile")}
            title="Mobile"
          >
            <Smartphone className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-auto bg-muted/20 flex justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full origin-top"
            style={{ maxWidth: mode === "desktop" ? 640 : 375 }}
          >
            {layoutSlug === "layout_a" ? (
              <LayoutAPreview content={content as LayoutAContent} />
            ) : (
              <LayoutBPreview content={content as LayoutBContent} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
