"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { CardSkeleton } from "@/components/ui/PageLoader";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { useGetTemplatesQuery } from "@/store/api/templatesApi";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { useDebounce } from "@/hooks/useDebounce";

export default function TemplatesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [layoutFilter, setLayoutFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isFetching } = useGetTemplatesQuery({
    page,
    limit: 12,
    search: debouncedSearch || undefined,
    layout_id: layoutFilter === "all" ? undefined : layoutFilter === "layout_a" ? 1 : 2,
  });

  const templates = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / 12);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Templates</h1>
        <Button onClick={() => router.push("/templates/new")}>
          <Plus className="h-4 w-4 mr-1.5" /> New Template
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search templates…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <Select value={layoutFilter} onValueChange={(v) => { if (v) { setLayoutFilter(v); setPage(1); } }}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Layout" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All layouts</SelectItem>
            <SelectItem value="layout_a">Layout A — Outreach</SelectItem>
            <SelectItem value="layout_b">Layout B — Announcement</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      <ErrorBoundary>
        {isFetching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg font-medium">No templates found</p>
            <p className="text-sm mt-1">
              {search ? "Try a different search." : "Create your first template to get started."}
            </p>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {templates.map((t) => (
              <motion.div key={t.id} variants={staggerItem}>
                <TemplateCard template={t} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </ErrorBoundary>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
