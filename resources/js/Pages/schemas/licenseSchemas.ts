// schemas/licenseSchemas.ts
import { z } from "zod";

// File validation helper
const fileSchema = z.custom<File>(
    (file) => {
        if (!file || !(file instanceof File)) return false;

        // Check file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) return false;

        // Check file type (PDF or images)
        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/webp",
        ];

        return allowedTypes.includes(file.type);
    },
    {
        message:
            "File must be PDF or image (JPEG, PNG, GIF, WebP) and less than 5MB",
    }
);

export const generateLicenseSchema = z.object({
    license_type: z.string().min(1, "License type is required"),
    customer_email: z.string().email("Invalid email address"),
    customer_name: z.string().min(1, "Customer name is required"),
    customer_type: z
        .enum(["individual", "business", "education"])
        .optional()
        .default("individual"),
    max_devices: z
        .number()
        .min(1, "Must have at least 1 device")
        .max(100, "Maximum 100 devices allowed")
        .optional()
        .default(1),
    purchase_price: z
        .number()
        .min(0, "Price cannot be negative")
        .optional()
        .default(0),
    purchase_currency: z
        .string()
        .length(3, "Currency must be 3 characters")
        .optional()
        .default("USD"),
    order_id: z.string().optional(),
    payment_method: z.string().optional(),
    admin_notes: z.string().optional(),
    payment_receipt: fileSchema.optional(), // New field for upload
});

export const licenseFormSchema = z.object({
    customerName: z.string().min(1, "Customer name is required"),
    customerEmail: z.string().email("Invalid email address"),
    licenseType: z.string().min(1, "License type is required"),
    customerType: z
        .enum(["individual", "business", "education"])
        .default("individual"),
    maxDevices: z.string().transform((val) => parseInt(val) || 1),
    purchasePrice: z.string().transform((val) => parseFloat(val) || 0),
    purchaseCurrency: z.string().default("USD"),
    orderId: z.string().optional(),
    paymentMethod: z.string().optional(),
    adminNotes: z.string().optional(),
    paymentReceipt: fileSchema.optional(), // New field for upload
});

export type GenerateLicenseFormData = z.infer<typeof generateLicenseSchema>;
export type LicenseFormInputs = z.infer<typeof licenseFormSchema>;
