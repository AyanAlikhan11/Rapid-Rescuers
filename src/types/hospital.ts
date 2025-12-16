import { Timestamp } from "firebase/firestore";


export type BloodGroup =
| "A+" | "A-" | "B+" | "B-"
| "O+" | "O-" | "AB+" | "AB-";


export type BloodStock = Record<BloodGroup, number>;


export interface Hospital {
id: string;
name: string;
address: string;
location: null | { lat: number; lng: number };
bloodStock: BloodStock;
createdAt?: Timestamp;
}