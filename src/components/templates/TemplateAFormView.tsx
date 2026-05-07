import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { LayoutAContent } from "@/types/layouts";
import { ImageIcon, Loader2, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { PreviewFrame } from "../layouts/PreviewFrame";
import Field from "./Field";
import Section from "./Section";
import { LayoutAFormValues } from "./schema";

type TemplateAFormViewProps = {
  register: UseFormRegister<LayoutAFormValues>;
  errors: FieldErrors<LayoutAFormValues>;
  isSubmitting: boolean;
  onSubmit: React.SubmitEventHandler<HTMLFormElement>;
  paragraphFields: { id: string }[];
  onAddParagraph: () => void;
  onRemoveParagraph: (index: number) => void;
  memberFields: { id: string }[];
  onAddMember: () => void;
  onRemoveMember: (index: number) => void;
  memberPhotoUrls: string[];
  uploadingMemberIndices: Set<number>;
  onMemberPhotoChange: (index: number, file: File) => void;
  previewContent: LayoutAContent;
};

export function TemplateAFormView({
  register,
  errors,
  isSubmitting,
  onSubmit,
  paragraphFields,
  onAddParagraph,
  onRemoveParagraph,
  memberFields,
  onAddMember,
  onRemoveMember,
  memberPhotoUrls,
  uploadingMemberIndices,
  onMemberPhotoChange,
  previewContent,
}: TemplateAFormViewProps) {
  return (
    <div className="flex h-full overflow-hidden">
      {/* Form panel */}
      <form
        onSubmit={onSubmit}
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
                onClick={() => onRemoveParagraph(i)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddParagraph}
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
                  onClick={() => onRemoveMember(i)}
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
              <Field
                label="Photo"
                error={
                  (
                    errors as Record<
                      string,
                      Record<number, { photoUrl?: { message?: string } }>
                    >
                  ).teamMembers?.[i]?.photoUrl?.message
                }
              >
                <input
                  type="hidden"
                  {...register(`teamMembers.${i}.photoUrl`)}
                />
                <div className="flex items-center gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-muted/40">
                    {uploadingMemberIndices.has(i) ? (
                      <div className="flex h-full w-full items-center justify-center">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      </div>
                    ) : memberPhotoUrls[i] ? (
                      <Image
                        src={memberPhotoUrls[i]}
                        alt="Team member photo"
                        fill
                        unoptimized
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <ImageIcon className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={uploadingMemberIndices.has(i)}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onMemberPhotoChange(i, file);
                      e.target.value = "";
                    }}
                    className="cursor-pointer"
                  />
                </div>
              </Field>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddMember}
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
