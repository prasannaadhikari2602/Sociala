import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const imageSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, "Image must be under 5MB")
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Only JPG, PNG, or WEBP allowed"
  )
  .nullable()
  .optional();

export const ProfileSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(255, "Full name is too long"),
  bio: z
    .string()
    .max(1000, "Bio must be under 1000 characters")
    .optional()
    .or(z.literal("")),
  location: z
    .string()
    .max(255, "Location is too long")
    .optional()
    .or(z.literal("")),
  date_of_birth: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => {
      if (!val) return true;
      const date = new Date(val);
      return date <= new Date();
    }, "Date of birth cannot be in the future"),
  profile_image: imageSchema,
  cover_image: imageSchema,
  interests: z
    .array(z.string())
    .max(4, "Select up to 4 interests")
    .optional(),
});