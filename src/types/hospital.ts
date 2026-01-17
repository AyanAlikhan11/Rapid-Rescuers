
import { Timestamp, FieldValue } from "firebase/firestore";

export interface Hospital {
  id: string;
  name: string;
  address: string;
  location: null | { lat: number; lng: number };
  bloodStock: BloodStock;
  createdAt?: Timestamp | FieldValue;
}

export type BloodGroup =
  | "A+" | "A-"
  | "B+" | "B-"
  | "O+" | "O-"
  | "AB+" | "AB-";

export type BloodStock = Record<BloodGroup, number>;
