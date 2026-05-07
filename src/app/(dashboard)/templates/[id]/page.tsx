"use client";

import { PreviewFrame } from "@/components/layouts/PreviewFrame";
import { DeleteTemplateDialog } from "@/components/templates/DeleteTemplateDialog";
import { SendEmail } from "@/components/templates/SendEmail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/PageLoader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useDuplicateTemplateMutation,
  useGetTemplateByIdQuery,
  useGetTemplateSendHistoryQuery,
} from "@/store/api/templatesApi";
import { ArrowLeft, Copy, Edit, Send, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function TemplateDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const templateId = Number(id);

  const [showDelete, setShowDelete] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [duplicate] = useDuplicateTemplateMutation();

  const { data: template, isLoading } = useGetTemplateByIdQuery(templateId);
  const { data: sendHistory, isFetching: historyLoading } =
    useGetTemplateSendHistoryQuery({ id: templateId }, { skip: !template });

  const handleDuplicate = async () => {
    if (!template) return;
    try {
      const result = await duplicate(template.id).unwrap();
      toast.success(`Duplicated as "${result.name}"`);
      router.push(`/templates/${result.id}`);
    } catch {
      toast.error("Failed to duplicate");
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-5xl mx-auto space-y-6">
        <div className="h-7 bg-muted rounded w-48 animate-pulse" />
        <div className="h-4 bg-muted rounded w-64 animate-pulse" />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Template not found.
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b bg-card shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => router.push("/templates")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-semibold truncate">{template.name}</h1>
              <Badge variant="outline" className="text-xs shrink-0">
                {template.layout?.name}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {template.send_count} sends · by{" "}
              {template.created_by?.name ?? "—"} ·{" "}
              {new Date(template.updated_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/templates/${template.id}/edit`)}
            >
              <Edit className="h-3.5 w-3.5 mr-1.5" /> Edit
            </Button>
            <Button variant="outline" size="sm" onClick={handleDuplicate}>
              <Copy className="h-3.5 w-3.5 mr-1.5" /> Duplicate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDelete(true)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
            </Button>
            <Button size="sm" onClick={() => setShowSend(true)}>
              <Send className="h-3.5 w-3.5 mr-1.5" /> Send
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="preview"
          className="flex-1 overflow-hidden flex flex-col"
        >
          <TabsList className="mx-6 mt-3 self-start">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="history">Send History</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="flex-1 overflow-hidden mt-0">
            <PreviewFrame
              layoutSlug={template.layout.slug}
              content={template.content_json}
            />
          </TabsContent>

          <TabsContent
            value="history"
            className="flex-1 overflow-auto p-6 mt-0"
          >
            {historyLoading ? (
              <TableSkeleton cols={5} rows={5} />
            ) : !sendHistory?.data.length ? (
              <p className="text-sm text-muted-foreground">No sends yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-2 font-medium pr-4">Date</th>
                      <th className="pb-2 font-medium pr-4">Sent by</th>
                      <th className="pb-2 font-medium pr-4">Recipients</th>
                      <th className="pb-2 font-medium pr-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sendHistory.data.map((send) => (
                      <tr key={send.id} className="border-b last:border-0">
                        <td className="py-3 pr-4 whitespace-nowrap">
                          {send.sent_at
                            ? new Date(send.sent_at).toLocaleString()
                            : "—"}
                        </td>
                        <td className="py-3 pr-4">
                          {send.sent_by.name ?? "—"}
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground">
                          {send.recipient_emails.join(", ")}
                        </td>
                        <td className="py-3 pr-4">
                          <Badge
                            variant={
                              send.status === "sent"
                                ? "default"
                                : send.status === "failed"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className="capitalize"
                          >
                            {send.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <DeleteTemplateDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        templateId={template.id}
        templateName={template.name}
        onDeleted={() => router.push("/templates")}
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
