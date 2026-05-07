"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VM } from "@/lib/validationMessages";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from "@/store/api/usersApi";
import type { User } from "@/types/layouts";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import type { Resolver } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";

const schema = yup.object({
  name: yup.string().required(VM.required),
  email: yup.string().email(VM.email).required(VM.required),
  role: yup.string().oneOf(["admin", "super_admin"]).required(VM.required),
});

type FormValues = yup.InferType<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User;
}

export function UserSheet({ open, onOpenChange, user }: Props) {
  const isEdit = !!user;
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      role: user?.role ?? "admin",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        role: user.role,
      });
    }
  }, [reset, user]);

  const roleValue = useWatch({
    control: control,
    name: "role",
  });

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEdit && user) {
        await updateUser({
          id: user.id,
          body: {
            name: values.name,
            email: values.email,
            role: values.role as "admin" | "super_admin",
          },
        }).unwrap();
        toast.success("User updated");
      } else {
        await createUser({
          name: values.name,
          email: values.email,
          role: values.role as "admin" | "super_admin",
        }).unwrap();
        toast.success("User created — invite email sent");
      }
      onOpenChange(false);
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message;
      if (msg?.includes("last super_admin") || msg?.includes("super admin")) {
        setError("role", { message: "Cannot demote the last Super Admin" });
      } else {
        toast.error(msg ?? "Failed to save user");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit user" : "Create user"}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 py-2"
        >
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter user name"
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="Enter user email"
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Role</Label>
            <Select
              value={roleValue}
              onValueChange={(v) => {
                if (v) setValue("role", v as "admin" | "super_admin");
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-xs text-destructive">{errors.role.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving…"
                : isEdit
                  ? "Save changes"
                  : "Create user"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
