import { Timestamp } from "firebase/firestore";
import { BloodGroup } from "./hospital";


export interface Donor {
id: string;
name: string;
bloodGroup: BloodGroup;
availability: boolean;
location: null | { lat: number; lng: number };
fcmToken?: string;
createdAt?: Timestamp;
}