"use client";

import { TemplateEditor } from "@/components/templates/TemplateEditor";
import { Button } from "@/components/ui/button";
import { useGetTemplateByIdQuery } from "@/store/api/templatesApi";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function EditTemplatePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const templateId = Number(id);

  const { data: template, isLoading } = useGetTemplateByIdQuery(templateId);

  if (isLoading) {
    return (
      <div className="p-8 space-y-3 animate-pulse">
        <div className="h-5 bg-muted rounded w-40" />
        <div className="h-4 bg-muted rounded w-64" />
      </div>
    );
  }

  if (!template) {
    return <div className="p-8 text-muted-foreground">Template not found.</div>;
  }

  const layoutSlug = template.layout?.slug ?? "layout_a";

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center gap-3 px-6 py-3 border-b bg-card shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">Edit {template.name}</span>
      </div>
      <div className="flex-1 overflow-hidden">
        <TemplateEditor
          layoutSlug={layoutSlug as "layout_a" | "layout_b"}
          layoutId={template.layout_id}
          existing={template}
        />
      </div>
    </div>
  );
}
