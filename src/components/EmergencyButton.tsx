"use client";
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function EmergencyButton({
  defaultGroup = "O+",
}: {
  defaultGroup?: string;
}) {
  const [loading, setLoading] = useState(false);

  async function sendSOS() {
    try {
      setLoading(true);

      const pos = await new Promise<{ lat: number; lng: number }>((res, rej) =>
        navigator.geolocation.getCurrentPosition(
          (p) =>
            res({ lat: p.coords.latitude, lng: p.coords.longitude }),
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
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Unknown error occurred";
      alert("Could not send SOS: " + message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={sendSOS}
      disabled={loading}
      className={`px-4 py-3 rounded shadow text-white transition
        ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
    >
      {loading ? "Sending..." : "One-Tap SOS"}
    </button>
  );
}
