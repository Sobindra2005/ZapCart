import { z } from "zod";

// Address Schema
export const addressSchema = z.object({
    type: z.enum(["Home", "Work", "Other"], {
        message: "Please select an address type",
    }),
    street: z.string().min(5, "Street address must be at least 5 characters"),
    city: z.string().min(2, "City must be at least 2 characters"),
    state: z.string().min(2, "State must be at least 2 characters"),
    zipCode: z.string().min(3, "Zip code must be at least 3 characters"),
    country: z.string().min(2, "Country must be at least 2 characters"),
});

export type AddressFormData = z.infer<typeof addressSchema>;
