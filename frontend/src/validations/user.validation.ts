import z from "zod";
import { Gender } from "../types/user.type";

export const updateUserProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .optional(),

  profilePhoto: z.preprocess((val) => {
    if (val === "") return null;
    return val;
  }, z.string().url("Profile picture must be a valid URL").nullable().optional()),
  gender: z.preprocess((val) => {
    if (val === "") return null;
    return val;
  }, z.nativeEnum(Gender).nullable().optional()),
});

export default {
  updateUserProfileSchema,
};
