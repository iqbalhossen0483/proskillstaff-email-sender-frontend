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
import { useParseEmailsCsvMutation } from "@/store/api/csvApi";
import { useCreateSendMutation } from "@/store/api/templatesApi";
import { yupResolver } from "@hookform/resolvers/yup";
import { Upload, X } from "lucide-react";
import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [createSend, { isLoading }] = useCreateSendMutation();
  const [parseEmailsCsv, { isLoading: isParsing }] =
    useParseEmailsCsvMutation();

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

  const handleCsvChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    try {
      const result = await parseEmailsCsv(file).unwrap();
      const existing = new Set(recipients);
      const added: string[] = [];
      for (const email of result.emails) {
        if (!existing.has(email)) {
          existing.add(email);
          added.push(email);
        }
      }
      if (added.length > 0) {
        setRecipients((prev) => [...prev, ...added]);
        setRecipientError(null);
      }

      const skippedDuplicates =
        result.duplicateRows + (result.emails.length - added.length);
      const parts = [`${added.length} added`];
      if (skippedDuplicates > 0) parts.push(`${skippedDuplicates} duplicate`);
      if (result.invalidRows > 0) parts.push(`${result.invalidRows} invalid`);
      toast.success(`CSV parsed: ${parts.join(", ")}`);
    } catch {
      toast.error("Failed to parse CSV file");
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
            <div className="flex items-center gap-2 pt-1">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={handleCsvChange}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isParsing}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-3.5 w-3.5 mr-1.5" />
                {isParsing ? "Parsing…" : "Upload CSV"}
              </Button>
              <span className="text-xs text-muted-foreground">
                Single column of emails, max 5 MB
              </span>
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
