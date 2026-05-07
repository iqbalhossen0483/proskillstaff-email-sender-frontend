"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VM } from "@/lib/validationMessages";
import { useCreateSendMutation } from "@/store/api/templatesApi";
import { yupResolver } from "@hookform/resolvers/yup";
import { X } from "lucide-react";
import { KeyboardEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";

const schema = yup.object({
  subject: yup.string().required(VM.required),
  recipientInput: yup.string().default(""),
});

type FormValues = yup.InferType<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateId: number;
  defaultSubject?: string;
}

export function SendEmail({
  open,
  onOpenChange,
  templateId,
  defaultSubject = "",
}: Props) {
  const [recipients, setRecipients] = useState<string[]>([]);
  const [recipientError, setRecipientError] = useState<string | null>(null);
  const [createSend, { isLoading }] = useCreateSendMutation();

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { subject: defaultSubject, recipientInput: "" },
  });

  const addRecipient = () => {
    const val = getValues("recipientInput").trim().toLowerCase();
    if (!val) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setRecipientError("Enter a valid email address");
      return;
    }
    if (recipients.includes(val)) {
      setRecipientError("Already added");
      return;
    }
    setRecipients((prev) => [...prev, val]);
    setValue("recipientInput", "");
    setRecipientError(null);
  };

  const removeRecipient = (email: string) => {
    setRecipients((prev) => prev.filter((r) => r !== email));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addRecipient();
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (recipients.length === 0) {
      setRecipientError(VM.recipientMin);
      return;
    }
    try {
      await createSend({
        template_id: templateId,
        recipient_emails: recipients,
        subject: values.subject,
      }).unwrap();
      toast.success("Email queued for delivery");
      onOpenChange(false);
      setRecipients([]);
    } catch {
      toast.error("Failed to send email");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Email</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="space-y-1.5">
            <Label>Recipients</Label>
            <div className="flex gap-2">
              <Input
                placeholder="email@example.com"
                {...register("recipientInput")}
                onKeyDown={handleKeyDown}
                onBlur={addRecipient}
              />
              <Button type="button" variant="outline" onClick={addRecipient}>
                Add
              </Button>
            </div>
            {recipientError && (
              <p className="text-xs text-destructive">{recipientError}</p>
            )}
            {recipients.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {recipients.map((r) => (
                  <Badge key={r} variant="secondary" className="gap-1 pr-1">
                    {r}
                    <button
                      type="button"
                      onClick={() => removeRecipient(r)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" {...register("subject")} />
            {errors.subject && (
              <p className="text-xs text-destructive">
                {errors.subject.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Sending…" : "Send"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
