import { z } from "zod";

// Settings/Password Change Schema
export const passwordChangeSchema = z
    .object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z.string().min(8, "Password must be at least 8 characters"),
        confirmNewPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "Passwords must match",
        path: ["confirmNewPassword"],
    });

export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;
