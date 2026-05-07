"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteTemplateMutation } from "@/store/api/templatesApi";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateId: number;
  templateName: string;
  onDeleted?: () => void;
}

export function DeleteTemplateDialog({
  open,
  onOpenChange,
  templateId,
  templateName,
  onDeleted,
}: Props) {
  const [deleteTemplate, { isLoading }] = useDeleteTemplateMutation();

  const handleDelete = async () => {
    try {
      await deleteTemplate(templateId).unwrap();
      toast.success(`"${templateName}" deleted`);
      onOpenChange(false);
      onDeleted?.();
    } catch {
      toast.error("Failed to delete template");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete template?</AlertDialogTitle>
          <AlertDialogDescription>
            &ldquo;{templateName}&rdquo; will be archived. Send history is
            preserved.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting…" : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
