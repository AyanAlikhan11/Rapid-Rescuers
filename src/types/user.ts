export type UserRole = "user" | "donor" | "hospital" | "admin";

export interface AppUser {
  uid: string;
  name:string;
  email: string;
  role: UserRole;
}
