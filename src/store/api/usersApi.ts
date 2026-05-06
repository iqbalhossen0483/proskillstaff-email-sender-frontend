import { baseApi } from "@/store/api/baseApi";
import type { User, PaginatedResponse } from "@/types/layouts";

interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

interface CreateUserDto {
  name: string;
  email: string;
  role: "admin" | "super_admin";
}

interface UpdateUserDto {
  name?: string;
  email?: string;
  role?: "admin" | "super_admin";
}

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<PaginatedResponse<User>, GetUsersParams>({
      query: (params) => ({ url: "/users", params }),
      providesTags: ["User"],
    }),
    getUserById: builder.query<User, number>({
      query: (id) => `/users/${id}`,
      providesTags: (_r, _e, id) => [{ type: "User", id }],
    }),
    createUser: builder.mutation<User, CreateUserDto>({
      query: (body) => ({ url: "/users", method: "POST", body }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation<User, { id: number; body: UpdateUserDto }>({
      query: ({ id, body }) => ({ url: `/users/${id}`, method: "PATCH", body }),
      invalidatesTags: ["User"],
    }),
    suspendUser: builder.mutation<User, number>({
      query: (id) => ({ url: `/users/${id}/suspend`, method: "PATCH" }),
      invalidatesTags: ["User"],
    }),
    reactivateUser: builder.mutation<User, number>({
      query: (id) => ({ url: `/users/${id}/reactivate`, method: "PATCH" }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({ url: `/users/${id}`, method: "DELETE" }),
      invalidatesTags: ["User"],
    }),
    resetUserPassword: builder.mutation<void, number>({
      query: (id) => ({ url: `/users/${id}/reset-password`, method: "POST" }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useSuspendUserMutation,
  useReactivateUserMutation,
  useDeleteUserMutation,
  useResetUserPasswordMutation,
} = usersApi;
