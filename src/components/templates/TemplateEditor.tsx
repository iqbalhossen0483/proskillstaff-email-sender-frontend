"use client";
import { EmailTemplate } from "@/types/layouts";
import LayoutBForm from "./LayoutBForm";
import { LayoutAForm } from "./TemplateAForm";

interface Props {
  layoutSlug: "layout_a" | "layout_b";
  layoutId: number;
  existing?: EmailTemplate;
}

export function TemplateEditor({ layoutSlug, layoutId, existing }: Props) {
  if (layoutSlug === "layout_a") {
    return <LayoutAForm layoutId={layoutId} existing={existing} />;
  }
  return <LayoutBForm layoutId={layoutId} existing={existing} />;
}
