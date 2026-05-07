import { VM } from "@/lib/validationMessages";
import * as yup from "yup";

const teamMemberSchema = yup.object({
  name: yup.string().required(VM.required),
  title: yup.string().required(VM.required),
  photoUrl: yup.string().required(VM.required).url(VM.url),
});

export const layoutASchema = yup.object({
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

export const layoutBSchema = yup.object({
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

export type LayoutAFormValues = yup.InferType<typeof layoutASchema>;
export type LayoutBFormValues = yup.InferType<typeof layoutBSchema>;
