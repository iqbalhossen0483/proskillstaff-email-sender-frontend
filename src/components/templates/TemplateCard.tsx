"use client";

import { DeleteTemplateDialog } from "@/components/templates/DeleteTemplateDialog";
import { SendEmail } from "@/components/templates/SendEmail";
import { Badge } from "@/components/ui/badge";
import { useDuplicateTemplateMutation } from "@/store/api/templatesApi";
import type { EmailTemplate } from "@/types/layouts";
import { Clock, FileText, SendHorizonal, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import TemplateMenus from "./TemplateMenus";

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
  const handleSend = () => {
    setShowSend(true);
  };

  const handleDelete = () => {
    setShowDelete(true);
  };

  return (
    <>
      <div
        className="border rounded-lg bg-card p-5 hover:shadow-sm transition-shadow cursor-pointer flex flex-col gap-3"
        onClick={() => router.push(`/templates/${template.id}`)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Button variant="ghost" size="icon">
              <FileText className="w-4 h-4" />
            </Button>
            <div className="min-w-0">
              <p className="font-medium truncate capitalize">{template.name}</p>
              {template.description && (
                <p className="text-sm text-muted-foreground mt-1 truncate">
                  {template.description}
                </p>
              )}
            </div>
          </div>
          <TemplateMenus
            onDeleted={handleDelete}
            onDuplicate={handleDuplicate}
            onSend={handleSend}
            templateId={template.id}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs">
            {template.layout.name}
          </Badge>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <SendHorizonal className="w-3 h-3" />
            {template.send_count} sends
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {template.created_by?.name ?? "—"}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(template.updated_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      <DeleteTemplateDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        templateId={template.id}
        templateName={template.name}
      />
      <SendEmail
        open={showSend}
        onOpenChange={setShowSend}
        templateId={template.id}
        defaultSubject={template.content_json.subjectLine}
      />
    </>
  );
}
