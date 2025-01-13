import { z } from "zod";

export const reportFormSchema = z.object({
  location: z
    .string()
    .min(2, { message: "Location must be at least 2 characters" })
    .max(100, { message: "Location must be at most 100 characters" }),
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(100, { message: "Title must be at most 100 characters" }),
  tags: z
    .array(z.string())
    .min(1, { message: "At least one tag must be selected" })
    .max(5, { message: "Maximum 5 tags can be selected" }),
  description: z
    .string()
    .min(5, { message: "Description must be at least 5 characters" })
    .max(1000, { message: "Description must be at most 1000 characters" }),
  image: z
    .instanceof(File)
    .refine((file) => file.size <= 5000000, "File size must be less than 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Only .jpg, .png, and .webp formats are supported"
    ),
});
