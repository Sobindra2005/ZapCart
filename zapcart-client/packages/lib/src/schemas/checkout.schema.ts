import { z } from "zod";

// Checkout Form Schema
export const checkoutSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().regex(
        /^(\+977)?[9][6-9]\d{8}$/,
        "Please enter a valid Nepali phone number (e.g., 9812345678 or +9779812345678)"
    ),
    address: z.string().min(5, "Address must be at least 5 characters"),
    city: z.string().min(2, "City must be at least 2 characters"),
    zip: z.string().min(3, "ZIP code must be at least 3 characters"),
    shippingCoordinates: z
        .object({
            lat: z.number().min(-90).max(90),
            lng: z.number().min(-180).max(180),
        })
        .nullable(),
    sameAsBilling: z.boolean(),
    billingAddress: z.string().optional(),
    billingCity: z.string().optional(),
    billingZip: z.string().optional(),
    billingCoordinates: z
        .object({
            lat: z.number().min(-90).max(90),
            lng: z.number().min(-180).max(180),
        })
        .nullable()
        .optional(),
    paymentMethod: z.enum(["BANK_TRANSFER", "CASH_ON_DELIVERY"], {
        message: "Please select a payment method",
    }),

}).superRefine((data, ctx) => {
    // Validate billing address fields when sameAsBilling is false
    if (!data.sameAsBilling) {
        if (!data.billingAddress || data.billingAddress.length < 5) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Billing address must be at least 5 characters",
                path: ["billingAddress"],
            });
        }
        if (!data.billingCity || data.billingCity.length < 2) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Billing city must be at least 2 characters",
                path: ["billingCity"],
            });
        }
        if (!data.billingZip || data.billingZip.length < 3) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Billing ZIP code must be at least 3 characters",
                path: ["billingZip"],
            });
        }
    }
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
