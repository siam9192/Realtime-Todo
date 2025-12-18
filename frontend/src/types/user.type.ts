import type z from "zod";
import type userValidation from "../validations/user.validation";

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  profilePhoto?: string;
  gender: Gender;
  createdAt: string;
  updated: string;
  isActive: string;
}

export interface CurrentUser extends User {}

export enum Gender {
  Male = "Male",
  Female = "Female",
  Other = "Other",
}

export type AssignUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  profilePhoto: string;
};

export type UpdateUserProfilePayload = z.infer<typeof userValidation.updateUserProfileSchema>;
