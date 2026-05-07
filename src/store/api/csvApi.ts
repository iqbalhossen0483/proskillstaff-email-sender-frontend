import { baseApi } from "@/store/api/baseApi";

export interface ParseEmailsResult {
  emails: string[];
  totalRows: number;
  invalidRows: number;
  duplicateRows: number;
}

export const csvApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    parseEmailsCsv: builder.mutation<ParseEmailsResult, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: "/csv/parse-emails",
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

export const { useParseEmailsCsvMutation } = csvApi;
