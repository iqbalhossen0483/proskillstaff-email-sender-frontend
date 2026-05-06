import { baseApi } from "@/store/api/baseApi";
import type {
  EmailSend,
  EmailTemplate,
  PaginatedResponse,
} from "@/types/layouts";

interface GetTemplatesParams {
  page?: number;
  limit?: number;
  search?: string;
  layout_id?: number;
  created_by?: number;
}

interface CreateTemplateDto {
  name: string;
  description?: string;
  layout_id: number;
  content_json: Record<string, unknown>;
}

interface UpdateTemplateDto {
  name?: string;
  description?: string;
  content_json?: Record<string, unknown>;
}

interface CreateSendDto {
  template_id: number;
  recipient_emails: string[];
  subject?: string;
}

export const templatesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTemplates: builder.query<
      PaginatedResponse<EmailTemplate>,
      GetTemplatesParams
    >({
      query: (params) => ({ url: "/templates", params }),
      providesTags: ["Template"],
    }),
    getTemplateById: builder.query<EmailTemplate, number>({
      query: (id) => `/templates/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Template", id }],
    }),
    createTemplate: builder.mutation<EmailTemplate, CreateTemplateDto>({
      query: (body) => ({ url: "/templates", method: "POST", body }),
      invalidatesTags: ["Template"],
    }),
    updateTemplate: builder.mutation<
      EmailTemplate,
      { id: number; body: UpdateTemplateDto }
    >({
      query: ({ id, body }) => ({
        url: `/templates/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        "Template",
        { type: "Template", id },
      ],
    }),
    deleteTemplate: builder.mutation<void, number>({
      query: (id) => ({ url: `/templates/${id}`, method: "DELETE" }),
      invalidatesTags: ["Template"],
    }),
    duplicateTemplate: builder.mutation<EmailTemplate, number>({
      query: (id) => ({ url: `/templates/${id}/duplicate`, method: "POST" }),
      invalidatesTags: ["Template"],
    }),
    getTemplateSendHistory: builder.query<
      PaginatedResponse<EmailSend>,
      { id: number; page?: number; limit?: number }
    >({
      query: ({ id, ...params }) => ({ url: `/templates/${id}/sends`, params }),
      providesTags: ["Send"],
    }),
    createSend: builder.mutation<
      { sendId: number; status: string },
      CreateSendDto
    >({
      query: (body) => ({ url: "/sends", method: "POST", body }),
      invalidatesTags: ["Send", "Template"],
    }),
  }),
});

export const {
  useGetTemplatesQuery,
  useGetTemplateByIdQuery,
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
  useDeleteTemplateMutation,
  useDuplicateTemplateMutation,
  useGetTemplateSendHistoryQuery,
  useCreateSendMutation,
} = templatesApi;
