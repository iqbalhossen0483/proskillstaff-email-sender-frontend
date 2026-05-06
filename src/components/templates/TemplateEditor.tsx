"use client";

import { PreviewFrame } from "@/components/layouts/PreviewFrame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { VM } from "@/lib/validationMessages";
import { useCreateTemplateMutation } from "@/store/api/templatesApi";
import type {
  EmailTemplate,
  LayoutAContent,
  LayoutBContent,
} from "@/types/layouts";
import { yupResolver } from "@hookform/resolvers/yup";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Resolver } from "react-hook-form";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";

const teamMemberSchema = yup.object({
  name: yup.string().required(VM.required),
  title: yup.string().required(VM.required),
  photoUrl: yup.string().optional(),
});

const layoutASchema = yup.object({
  name: yup.string().required(VM.required),
  description: yup.string().optional(),
  subjectLine: yup.string().required(VM.required),
  companyName: yup.string().required(VM.required),
  tagline: yup.string().optional(),
  headerBgColor: yup.string().required(VM.required),
  bodyParagraphs: yup
    .array(yup.string().required())
    .min(1, "Add at least one paragraph")
    .required(),
  ctaLabel: yup.string().optional(),
  ctaUrl: yup
    .string()
    .optional()
    .test(
      "url-or-empty",
      VM.url,
      (v) =>
        !v ||
        !v.trim() ||
        (() => {
          try {
            new URL(v);
            return true;
          } catch {
            return false;
          }
        })(),
    ),
  teamMembers: yup.array(teamMemberSchema).required(),
  contactEmail: yup
    .string()
    .optional()
    .test(
      "email-or-empty",
      VM.email,
      (v) => !v || !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    ),
  contactPhone: yup.string().optional(),
  contactWebsite: yup.string().optional(),
  contactAddress: yup.string().optional(),
});

const layoutBSchema = yup.object({
  name: yup.string().required(VM.required),
  description: yup.string().optional(),
  subjectLine: yup.string().required(VM.required),
  companyName: yup.string().required(VM.required),
  tagline: yup.string().optional(),
  headerBgColor: yup.string().required(VM.required),
  greetingText: yup.string().optional(),
  bodyParagraphs: yup
    .array(yup.string().required())
    .min(1, "Add at least one paragraph")
    .required(),
  ctaLabel: yup.string().optional(),
  ctaUrl: yup
    .string()
    .optional()
    .test(
      "url-or-empty",
      VM.url,
      (v) =>
        !v ||
        !v.trim() ||
        (() => {
          try {
            new URL(v);
            return true;
          } catch {
            return false;
          }
        })(),
    ),
  highlights: yup.array(yup.string().required()).required(),
  contactEmail: yup
    .string()
    .optional()
    .test(
      "email-or-empty",
      VM.email,
      (v) => !v || !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    ),
  contactPhone: yup.string().optional(),
  contactWebsite: yup.string().optional(),
  contactAddress: yup.string().optional(),
});

type LayoutAFormValues = yup.InferType<typeof layoutASchema>;
type LayoutBFormValues = yup.InferType<typeof layoutBSchema>;

interface Props {
  layoutSlug: "layout_a" | "layout_b";
  layoutId: number;
  existing?: EmailTemplate;
}

function LayoutAForm({
  layoutId,
}: {
  layoutId: number;
  existing?: EmailTemplate;
}) {
  const router = useRouter();
  const [create] = useCreateTemplateMutation();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LayoutAFormValues>({
    resolver: yupResolver(layoutASchema) as Resolver<LayoutAFormValues>,
    defaultValues: {
      name: "",
      description: "",
      subjectLine: "",
      companyName: "",
      tagline: "",
      headerBgColor: "#2563EB",
      bodyParagraphs: [""],
      ctaLabel: "",
      ctaUrl: "",
      teamMembers: [],
      contactEmail: "",
      contactPhone: "",
      contactWebsite: "",
      contactAddress: "",
    },
  });

  const watched = useWatch({ control });

  const {
    fields: paragraphFields,
    append: addParagraph,
    remove: removeParagraph,
  } = useFieldArray({ control, name: "bodyParagraphs" as never });

  const {
    fields: memberFields,
    append: addMember,
    remove: removeMember,
  } = useFieldArray({ control, name: "teamMembers" as never });

  const onSubmit = async (values: LayoutAFormValues) => {
    const { name, description, ...contentFields } = values;
    const content_json = contentFields as unknown as LayoutAContent;
    try {
      const result = await create({
        name,
        description,
        layout_id: layoutId,
        content_json: content_json as unknown as Record<string, unknown>,
      }).unwrap();
      toast.success("Template saved");
      router.push(`/templates/${result.id}`);
    } catch {
      toast.error("Failed to save template");
    }
  };

  const previewContent: LayoutAContent = {
    subjectLine: watched.subjectLine ?? "",
    companyName: watched.companyName ?? "",
    tagline: watched.tagline,
    headerBgColor: watched.headerBgColor ?? "#2563EB",
    bodyParagraphs: (watched.bodyParagraphs ?? []) as string[],
    ctaLabel: watched.ctaLabel,
    ctaUrl: watched.ctaUrl,
    teamMembers: (watched.teamMembers ?? []) as {
      name: string;
      title: string;
      photoUrl?: string;
    }[],
    contactEmail: watched.contactEmail,
    contactPhone: watched.contactPhone,
    contactWebsite: watched.contactWebsite,
    contactAddress: watched.contactAddress,
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Form panel */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-1/2 overflow-y-auto p-6 space-y-5 border-r"
      >
        <Section title="Template Info">
          <Field label="Template name" error={errors.name?.message}>
            <Input {...register("name")} placeholder="My Outreach Template" />
          </Field>
          <Field label="Description (optional)">
            <Input
              {...register("description")}
              placeholder="Brief description…"
            />
          </Field>
          <Field
            label="Subject line"
            error={
              (errors as Record<string, { message?: string }>).subjectLine
                ?.message
            }
          >
            <Input {...register("subjectLine")} placeholder="Email subject…" />
          </Field>
        </Section>

        <Separator />

        <Section title="Header">
          <Field
            label="Company name"
            error={
              (errors as Record<string, { message?: string }>).companyName
                ?.message
            }
          >
            <Input {...register("companyName")} />
          </Field>
          <Field label="Tagline (optional)">
            <Input {...register("tagline")} />
          </Field>
          <Field label="Header background color">
            <div className="flex items-center gap-2">
              <input
                type="color"
                {...register("headerBgColor")}
                className="h-9 w-14 cursor-pointer rounded border"
              />
              <Input
                {...register("headerBgColor")}
                className="font-mono text-sm"
              />
            </div>
          </Field>
        </Section>

        <Separator />

        <Section title="Body">
          {paragraphFields.map((f, i) => (
            <div key={f.id} className="flex gap-2">
              <textarea
                {...register(`bodyParagraphs.${i}`)}
                rows={3}
                className="flex-1 rounded-md border bg-transparent px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder={`Paragraph ${i + 1}…`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 self-start mt-0"
                onClick={() => removeParagraph(i)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addParagraph("")}
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Add paragraph
          </Button>
        </Section>

        <Separator />

        <Section title="Call to action (optional)">
          <Field label="Button label">
            <Input {...register("ctaLabel")} placeholder="Learn More" />
          </Field>
          <Field
            label="Button URL"
            error={
              (errors as Record<string, { message?: string }>).ctaUrl?.message
            }
          >
            <Input {...register("ctaUrl")} placeholder="https://…" />
          </Field>
        </Section>

        <Separator />

        <Section title="Team members">
          {memberFields.map((f, i) => (
            <div
              key={f.id}
              className="border rounded-md p-3 space-y-2 bg-muted/30"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Member {i + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => removeMember(i)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              <Field
                label="Name"
                error={
                  (
                    errors as Record<
                      string,
                      Record<number, { name?: { message?: string } }>
                    >
                  ).teamMembers?.[i]?.name?.message
                }
              >
                <Input {...register(`teamMembers.${i}.name`)} />
              </Field>
              <Field
                label="Title"
                error={
                  (
                    errors as Record<
                      string,
                      Record<number, { title?: { message?: string } }>
                    >
                  ).teamMembers?.[i]?.title?.message
                }
              >
                <Input {...register(`teamMembers.${i}.title`)} />
              </Field>
              <Field label="Photo URL (optional)">
                <Input
                  {...register(`teamMembers.${i}.photoUrl`)}
                  placeholder="https://…"
                />
              </Field>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addMember({ name: "", title: "", photoUrl: "" })}
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Add team member
          </Button>
        </Section>

        <Separator />

        <Section title="Contact info (optional)">
          <Field
            label="Email"
            error={
              (errors as Record<string, { message?: string }>).contactEmail
                ?.message
            }
          >
            <Input {...register("contactEmail")} type="email" />
          </Field>
          <Field label="Phone">
            <Input {...register("contactPhone")} />
          </Field>
          <Field label="Website">
            <Input {...register("contactWebsite")} />
          </Field>
          <Field label="Address">
            <Input {...register("contactAddress")} />
          </Field>
        </Section>

        <div className="pt-2 pb-6">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save template"}
          </Button>
        </div>
      </form>

      {/* Preview panel */}
      <div className="w-1/2 overflow-hidden">
        <PreviewFrame layoutSlug="layout_a" content={previewContent} />
      </div>
    </div>
  );
}

function LayoutBForm({
  layoutId,
}: {
  layoutId: number;
  existing?: EmailTemplate;
}) {
  const router = useRouter();
  const [create] = useCreateTemplateMutation();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LayoutBFormValues>({
    resolver: yupResolver(layoutBSchema) as Resolver<LayoutBFormValues>,
    defaultValues: {
      name: "",
      description: "",
      subjectLine: "",
      companyName: "",
      tagline: "",
      headerBgColor: "#7C3AED",
      greetingText: "",
      bodyParagraphs: [""],
      ctaLabel: "",
      ctaUrl: "",
      highlights: [""],
      contactEmail: "",
      contactPhone: "",
      contactWebsite: "",
      contactAddress: "",
    },
  });

  const watched = useWatch({ control });

  const {
    fields: paragraphFields,
    append: addParagraph,
    remove: removeParagraph,
  } = useFieldArray({ control, name: "bodyParagraphs" as never });

  const {
    fields: highlightFields,
    append: addHighlight,
    remove: removeHighlight,
  } = useFieldArray({ control, name: "highlights" as never });

  const onSubmit = async (values: LayoutBFormValues) => {
    const { name, description, ...contentFields } = values;
    const content_json = contentFields as unknown as LayoutBContent;
    try {
      const result = await create({
        name,
        description,
        layout_id: layoutId,
        content_json: content_json as unknown as Record<string, unknown>,
      }).unwrap();
      toast.success("Template saved");
      router.push(`/templates/${result.id}`);
    } catch {
      toast.error("Failed to save template");
    }
  };

  const previewContent: LayoutBContent = {
    subjectLine: watched.subjectLine ?? "",
    companyName: watched.companyName ?? "",
    tagline: watched.tagline,
    headerBgColor: watched.headerBgColor ?? "#7C3AED",
    greetingText: watched.greetingText,
    bodyParagraphs: (watched.bodyParagraphs ?? []) as string[],
    ctaLabel: watched.ctaLabel,
    ctaUrl: watched.ctaUrl,
    highlights: (watched.highlights ?? []) as string[],
    contactEmail: watched.contactEmail,
    contactPhone: watched.contactPhone,
    contactWebsite: watched.contactWebsite,
    contactAddress: watched.contactAddress,
  };

  return (
    <div className="flex h-full overflow-hidden">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-1/2 overflow-y-auto p-6 space-y-5 border-r"
      >
        <Section title="Template Info">
          <Field label="Template name" error={errors.name?.message}>
            <Input {...register("name")} placeholder="My Announcement" />
          </Field>
          <Field label="Description (optional)">
            <Input {...register("description")} />
          </Field>
          <Field
            label="Subject line"
            error={
              (errors as Record<string, { message?: string }>).subjectLine
                ?.message
            }
          >
            <Input {...register("subjectLine")} />
          </Field>
        </Section>

        <Separator />

        <Section title="Header">
          <Field
            label="Company name"
            error={
              (errors as Record<string, { message?: string }>).companyName
                ?.message
            }
          >
            <Input {...register("companyName")} />
          </Field>
          <Field label="Tagline (optional)">
            <Input {...register("tagline")} />
          </Field>
          <Field label="Header background color">
            <div className="flex items-center gap-2">
              <input
                type="color"
                {...register("headerBgColor")}
                className="h-9 w-14 cursor-pointer rounded border"
              />
              <Input
                {...register("headerBgColor")}
                className="font-mono text-sm"
              />
            </div>
          </Field>
        </Section>

        <Separator />

        <Section title="Body">
          <Field label="Greeting (optional)">
            <Input
              {...register("greetingText")}
              placeholder="Dear colleagues,"
            />
          </Field>
          {paragraphFields.map((f, i) => (
            <div key={f.id} className="flex gap-2">
              <textarea
                {...register(`bodyParagraphs.${i}`)}
                rows={3}
                className="flex-1 rounded-md border bg-transparent px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 self-start"
                onClick={() => removeParagraph(i)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addParagraph("")}
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Add paragraph
          </Button>
        </Section>

        <Separator />

        <Section title="Call to action (optional)">
          <Field label="Button label">
            <Input {...register("ctaLabel")} />
          </Field>
          <Field
            label="Button URL"
            error={
              (errors as Record<string, { message?: string }>).ctaUrl?.message
            }
          >
            <Input {...register("ctaUrl")} placeholder="https://…" />
          </Field>
        </Section>

        <Separator />

        <Section title="Highlights">
          {highlightFields.map((f, i) => (
            <div key={f.id} className="flex gap-2">
              <Input
                {...register(`highlights.${i}`)}
                placeholder={`Highlight ${i + 1}…`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => removeHighlight(i)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addHighlight("")}
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Add highlight
          </Button>
        </Section>

        <Separator />

        <Section title="Contact info (optional)">
          <Field
            label="Email"
            error={
              (errors as Record<string, { message?: string }>).contactEmail
                ?.message
            }
          >
            <Input {...register("contactEmail")} type="email" />
          </Field>
          <Field label="Phone">
            <Input {...register("contactPhone")} />
          </Field>
          <Field label="Website">
            <Input {...register("contactWebsite")} />
          </Field>
          <Field label="Address">
            <Input {...register("contactAddress")} />
          </Field>
        </Section>

        <div className="pt-2 pb-6">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save template"}
          </Button>
        </div>
      </form>

      <div className="w-1/2 overflow-hidden">
        <PreviewFrame layoutSlug="layout_b" content={previewContent} />
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {children}
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function TemplateEditor({ layoutSlug, layoutId, existing }: Props) {
  if (layoutSlug === "layout_a") {
    return <LayoutAForm layoutId={layoutId} existing={existing} />;
  }
  return <LayoutBForm layoutId={layoutId} existing={existing} />;
}
