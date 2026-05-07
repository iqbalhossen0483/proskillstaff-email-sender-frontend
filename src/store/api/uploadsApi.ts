import { baseApi } from "@/store/api/baseApi";

export const uploadsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation<{ url: string }, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: "/uploads",
          method: "POST",
          body: formData,
        };
      },
    }),
    deleteImage: builder.mutation<void, string>({
      query: (url) => ({
        url: "/uploads",
        method: "DELETE",
        body: { url },
      }),
    }),
  }),
});

export const { useUploadImageMutation, useDeleteImageMutation } = uploadsApi;
