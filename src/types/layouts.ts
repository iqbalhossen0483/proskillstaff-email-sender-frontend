export interface TeamMember {
  name: string;
  title: string;
  photoUrl?: string;
}

export interface LayoutAContent {
  subjectLine: string;
  companyName: string;
  tagline?: string;
  headerBgColor: string;
  bodyParagraphs: string[];
  ctaLabel?: string;
  ctaUrl?: string;
  teamMembers: TeamMember[];
  contactEmail?: string;
  contactPhone?: string;
  contactWebsite?: string;
  contactAddress?: string;
}

export interface LayoutBContent {
  subjectLine: string;
  companyName: string;
  tagline?: string;
  headerBgColor: string;
  greetingText?: string;
  bodyParagraphs: string[];
  ctaLabel?: string;
  ctaUrl?: string;
  highlights: string[];
  contactEmail?: string;
  contactPhone?: string;
  contactWebsite?: string;
  contactAddress?: string;
}

export type LayoutContent = LayoutAContent | LayoutBContent;

export interface Layout {
  id: number;
  slug: "layout_a" | "layout_b";
  name: string;
  description: string;
}

export interface EmailTemplate {
  id: number;
  name: string;
  description?: string;
  layout_id: number;
  layout: Layout;
  content_json: LayoutContent;
  created_by?: User;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  send_count: number;
}

export interface EmailSend {
  id: number;
  template?: EmailTemplate;
  sent_by: User;
  recipient_emails: string[];
  subject: string;
  status: "queued" | "sent" | "failed";
  sent_at?: string;
  error_message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "super_admin";
  status: "active" | "suspended";
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}
