import { z } from "zod";

// Payment Method Schema
export const paymentMethodSchema = z.object({
    type: z.enum(["Credit Card", "PayPal"], {
        message: "Please select a payment type",
    }),
    cardNumber: z
        .string()
        .min(1, "Card number is required")
        .regex(/^\d{16}$/, "Card number must be 16 digits")
        .optional()
        .or(z.literal("")),
    cardholderName: z
        .string()
        .min(3, "Cardholder name must be at least 3 characters")
        .optional()
        .or(z.literal("")),
    expiryMonth: z
        .string()
        .regex(/^(0[1-9]|1[0-2])$/, "Invalid month")
        .optional()
        .or(z.literal("")),
    expiryYear: z
        .string()
        .regex(/^\d{2}$/, "Invalid year")
        .optional()
        .or(z.literal("")),
    cvv: z
        .string()
        .regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits")
        .optional()
        .or(z.literal("")),
    paypalEmail: z
        .string()
        .email("Invalid email address")
        .optional()
        .or(z.literal("")),
}).refine(
    (data) => {
        if (data.type === "Credit Card") {
            return (
                data.cardNumber &&
                data.cardholderName &&
                data.expiryMonth &&
                data.expiryYear &&
                data.cvv
            );
        }
        if (data.type === "PayPal") {
            return data.paypalEmail;
        }
        return false;
    },
    {
        message: "Please fill in all required fields for the selected payment type",
        path: ["type"],
    }
);

export type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;
