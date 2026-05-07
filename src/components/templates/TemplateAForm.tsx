import {
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
} from "@/store/api/templatesApi";
import {
  useDeleteImageMutation,
  useUploadImageMutation,
} from "@/store/api/uploadsApi";
import { EmailTemplate, LayoutAContent } from "@/types/layouts";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Resolver, useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { LayoutAFormValues, layoutASchema } from "./schema";
import { TemplateAFormView } from "./TemplateAFormView";

const ALLOWED_PHOTO_MIME = ["image/jpeg", "image/png", "image/webp"];
const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

export function LayoutAForm({
  layoutId,
  existing,
}: {
  layoutId: number;
  existing?: EmailTemplate;
}) {
  const router = useRouter();
  const [create] = useCreateTemplateMutation();
  const [update] = useUpdateTemplateMutation();
  const [uploadImage] = useUploadImageMutation();
  const [deleteImage] = useDeleteImageMutation();
  const [uploadingIndices, setUploadingIndices] = useState<Set<number>>(
    new Set(),
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LayoutAFormValues>({
    resolver: yupResolver(layoutASchema) as Resolver<LayoutAFormValues>,
    defaultValues: {
      name: "",
      description: "",
      subjectLine: "",
      companyName: "",
      tagline: "",
      headerBgColor: "#35a287",
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

  useEffect(() => {
    if (existing) {
      reset({
        name: existing.name,
        description: existing.description,
        subjectLine: existing.content_json.subjectLine,
        companyName: existing.content_json.companyName,
        tagline: existing.content_json.tagline,
        headerBgColor: existing.content_json.headerBgColor,
        bodyParagraphs: existing.content_json.bodyParagraphs,
        ctaLabel: existing.content_json.ctaLabel,
        ctaUrl: existing.content_json.ctaUrl,
        teamMembers: (existing.content_json as LayoutAContent).teamMembers,
        contactEmail: existing.content_json.contactEmail,
        contactPhone: existing.content_json.contactPhone,
        contactWebsite: existing.content_json.contactWebsite,
        contactAddress: existing.content_json.contactAddress,
      });
    }
  }, [existing, reset]);

  const watched = useWatch({ control });
  const watchedTeamMembers = (watched.teamMembers ?? []) as {
    name: string;
    title: string;
    photoUrl?: string;
  }[];

  const {
    fields: paragraphFields,
    append: appendParagraph,
    remove: removeParagraph,
  } = useFieldArray({ control, name: "bodyParagraphs" as never });

  const {
    fields: memberFields,
    append: appendMember,
    remove: removeMember,
  } = useFieldArray({ control, name: "teamMembers" as never });

  const onAddParagraph = () => appendParagraph("");
  const onRemoveParagraph = (index: number) => removeParagraph(index);
  const onAddMember = () => appendMember({ name: "", title: "", photoUrl: "" });
  const onRemoveMember = async (index: number) => {
    const previousUrl = getValues(`teamMembers.${index}.photoUrl`);
    if (previousUrl) {
      try {
        await deleteImage(previousUrl).unwrap();
      } catch {
        // Stale or already-deleted URLs are fine to ignore.
      }
    }
    removeMember(index);
  };

  const setUploading = (index: number, value: boolean) => {
    setUploadingIndices((prev) => {
      const next = new Set(prev);
      if (value) next.add(index);
      else next.delete(index);
      return next;
    });
  };

  const onMemberPhotoChange = async (index: number, file: File) => {
    if (!ALLOWED_PHOTO_MIME.includes(file.type)) {
      toast.error("Only jpeg, png, or webp images are allowed");
      return;
    }
    if (file.size > MAX_PHOTO_SIZE) {
      toast.error("Image must be under 5 MB");
      return;
    }

    const previousUrl = getValues(`teamMembers.${index}.photoUrl`);
    setUploading(index, true);
    try {
      if (previousUrl) {
        try {
          await deleteImage(previousUrl).unwrap();
        } catch {
          // Stale or already-deleted URLs are fine to ignore.
        }
      }
      const { url } = await uploadImage(file).unwrap();
      setValue(`teamMembers.${index}.photoUrl`, url, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(index, false);
    }
  };

  const onSubmit = async (values: LayoutAFormValues) => {
    const { name, description, ...contentFields } = values;
    const content_json = contentFields;
    try {
      if (existing) {
        const result = await update({
          id: existing.id,
          body: {
            name,
            description,
            content_json: content_json,
          },
        }).unwrap();
        toast.success("Template saved");
        router.push(`/templates/${result.id}`);
      } else {
        const result = await create({
          name,
          description,
          layout_id: layoutId,
          content_json: content_json,
        }).unwrap();
        toast.success("Template saved");
        router.push(`/templates/${result.id}`);
      }
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
    teamMembers: watchedTeamMembers,
    contactEmail: watched.contactEmail,
    contactPhone: watched.contactPhone,
    contactWebsite: watched.contactWebsite,
    contactAddress: watched.contactAddress,
  };

  return (
    <TemplateAFormView
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit(onSubmit)}
      paragraphFields={paragraphFields}
      onAddParagraph={onAddParagraph}
      onRemoveParagraph={onRemoveParagraph}
      memberFields={memberFields}
      onAddMember={onAddMember}
      onRemoveMember={onRemoveMember}
      memberPhotoUrls={watchedTeamMembers.map((m) => m.photoUrl ?? "")}
      uploadingMemberIndices={uploadingIndices}
      onMemberPhotoChange={onMemberPhotoChange}
      previewContent={previewContent}
    />
  );
}
