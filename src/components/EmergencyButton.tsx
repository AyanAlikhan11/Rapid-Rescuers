// /components/EmergencyButton.tsx
"use client";
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function EmergencyButton({ defaultGroup = "O+" }: { defaultGroup?: string }) {
  const [loading, setLoading] = useState(false);

  async function sendSOS() {
    try {
      setLoading(true);
      const pos = await new Promise<{ lat: number; lng: number }>((res, rej) =>
        navigator.geolocation.getCurrentPosition(
          (p) => res({ lat: p.coords.latitude, lng: p.coords.longitude }),
          rej,
          { enableHighAccuracy: true }
        )
      );

      const docRef = await addDoc(collection(db, "requests"), {
        bloodGroupNeeded: defaultGroup,
        location: pos,
        radiusKm: 5,
        status: "open",
        createdAt: serverTimestamp(),
      });

      alert("SOS sent! Request id: " + docRef.id);
    } catch (err: any) {
      console.error(err);
      alert("Could not send SOS: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={sendSOS} className={`px-4 py-3 rounded shadow text-white ${loading ? "bg-gray-400" : "bg-red-600"}`} disabled={loading}>
      {loading ? "Sending..." : "One-Tap SOS"}
    </button>
  );
}
