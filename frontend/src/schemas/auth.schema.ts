import { z } from "zod";

export const registerUserSchema = z.object({
  username: z.string().min(3, "Username must be atleast 3 characters"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be atleast 6 characters"),
  profileImage: z
    .instanceof(FileList)
    .optional()
    .refine(
      (files) => !files || files.length <= 1,
      "Only one profile picture is allowed",
    )
    .refine(
      (files) =>
        !files ||
        files.length === 0 ||
        ["image/jpeg", "image/png", "image/webp"].includes(files[0].type),
      "Only JPG, PNG or WEBP images are allowed",
    ),
});

export const loginUserSchema = z.object({
  identifier: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterUserFormData = z.infer<typeof registerUserSchema>;
export type LoginUserFormData = z.infer<typeof loginUserSchema>;
