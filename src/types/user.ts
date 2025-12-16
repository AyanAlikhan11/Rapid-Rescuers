export type UserRole = "user" | "donor" | "hospital" | "admin";

export interface AppUser {
  uid: string;
  email: string;
  role: UserRole;
}
