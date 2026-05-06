"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Edit, Copy, Trash2, Send } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteTemplateDialog } from "@/components/templates/DeleteTemplateDialog";
import { SendDrawer } from "@/components/templates/SendDrawer";
import { useDuplicateTemplateMutation } from "@/store/api/templatesApi";
import type { EmailTemplate } from "@/types/layouts";

interface Props {
  template: EmailTemplate;
}

export function TemplateCard({ template }: Props) {
  const router = useRouter();
  const [showDelete, setShowDelete] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [duplicate] = useDuplicateTemplateMutation();

  const handleDuplicate = async () => {
    try {
      const result = await duplicate(template.id).unwrap();
      toast.success(`Duplicated as "${result.name}"`);
    } catch {
      toast.error("Failed to duplicate template");
    }
  };

  const layoutLabel = template.layout?.slug === "layout_a" ? "Layout A" : "Layout B";
  const subject = (template.content_json as unknown as Record<string, unknown>)?.subjectLine as string | undefined;

  return (
    <>
      <div
        className="border rounded-lg bg-card p-5 hover:shadow-sm transition-shadow cursor-pointer flex flex-col gap-3"
        onClick={() => router.push(`/templates/${template.id}`)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{template.name}</p>
            {template.description && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{template.description}</p>
            )}
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-7 w-7 -mr-1 -mt-1" />}>
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push(`/templates/${template.id}/edit`)}>
                  <Edit className="h-3.5 w-3.5 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicate}>
                  <Copy className="h-3.5 w-3.5 mr-2" /> Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowSend(true)}>
                  <Send className="h-3.5 w-3.5 mr-2" /> Send
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowDelete(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs">{layoutLabel}</Badge>
          <span className="text-xs text-muted-foreground">{template.send_count} sends</span>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{template.createdBy?.name ?? "—"}</span>
          <span>{new Date(template.updated_at).toLocaleDateString()}</span>
        </div>
      </div>

      <DeleteTemplateDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        templateId={template.id}
        templateName={template.name}
      />
      <SendDrawer
        open={showSend}
        onOpenChange={setShowSend}
        templateId={template.id}
        defaultSubject={subject}
      />
    </>
  );
}
