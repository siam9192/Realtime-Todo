export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  profilePicture?: string;
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
  profilePicture: string;
};
