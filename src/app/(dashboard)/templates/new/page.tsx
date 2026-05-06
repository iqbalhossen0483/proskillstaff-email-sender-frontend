"use client";

import { TemplateEditor } from "@/components/templates/TemplateEditor";
import { Button } from "@/components/ui/button";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { motion } from "framer-motion";
import { ArrowLeft, Megaphone, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type LayoutSlug = "layout_a" | "layout_b";

const LAYOUTS: {
  slug: LayoutSlug;
  id: number;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
}[] = [
  {
    slug: "layout_a",
    id: 1,
    name: "Layout A Outreach",
    description:
      "Ideal for team introductions and outreach emails with team member cards, photos, and contact details.",
    icon: Users,
    color: "#2563EB",
  },
  {
    slug: "layout_b",
    id: 2,
    name: "Layout B Announcement",
    description:
      "Perfect for announcements with a highlights list, call-to-action, and clean numbered sections.",
    icon: Megaphone,
    color: "#7C3AED",
  },
];

export default function NewTemplatePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<{
    slug: LayoutSlug;
    id: number;
  } | null>(null);

  if (selected) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex items-center gap-3 px-6 py-3 border-b bg-card">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setSelected(null)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            New template{" "}
            {selected.slug === "layout_a"
              ? "Layout A · Outreach"
              : "Layout B · Announcement"}
          </span>
        </div>
        <div className="flex-1 overflow-hidden">
          <TemplateEditor layoutSlug={selected.slug} layoutId={selected.id} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </Button>
      <h1 className="text-2xl font-semibold mb-2">Choose a layout</h1>
      <p className="text-muted-foreground mb-8 text-sm">
        The layout is permanent after creation. To use a different layout,
        duplicate and recreate.
      </p>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {LAYOUTS.map((layout) => {
          const Icon = layout.icon;
          return (
            <motion.button
              key={layout.slug}
              variants={staggerItem}
              onClick={() => setSelected({ slug: layout.slug, id: layout.id })}
              className="text-left border rounded-xl p-6 hover:bg-border/40 hover:shadow-md transition-all group bg-card"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                style={{ background: layout.color + "20" }}
              >
                <Icon className="h-5 w-5" style={{ color: layout.color }} />
              </div>
              <p className="font-semibold mb-1">{layout.name}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {layout.description}
              </p>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
