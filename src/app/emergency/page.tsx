// /app/emergency/page.tsx
"use client";
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function EmergencyPage() {
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [submitting, setSubmitting] = useState(false);

  async function handleSOS() {
    setSubmitting(true);
    try {
      const pos = await new Promise<{ lat: number; lng: number }>((res, rej) =>
        navigator.geolocation.getCurrentPosition((p) => res({ lat: p.coords.latitude, lng: p.coords.longitude }), rej)
      );

      const docRef = await addDoc(collection(db, "requests"), {
        bloodGroupNeeded: bloodGroup,
        location: pos,
        radiusKm: 5,
        status: "open",
        createdAt: serverTimestamp(),
      });

      alert("SOS sent! Request id: " + docRef.id);
    } catch (err: any) {
      alert("Error: " + (err.message || err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="px-4 sm:px-6">
  <div className="w-full max-w-md mx-auto mt-6 bg-white p-5 sm:p-6 rounded-xl shadow-lg">
    
    <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center sm:text-left text-black">
      Emergency Request
    </h2>

    <select
      value={bloodGroup}
      onChange={(e) => setBloodGroup(e.target.value)}
      className="w-full p-3 border rounded-lg mb-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500 "
    >
      {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(b => (
        <option key={b}>{b}</option>
      ))}
    </select>

    <button
      disabled={submitting}
      onClick={handleSOS}
      className="w-full py-3 bg-red-600 text-white rounded-lg text-sm sm:text-base font-medium hover:bg-red-700 transition disabled:opacity-60"
    >
      {submitting ? "Sending..." : "Send SOS"}
    </button>

  </div>
</div>

  );
}
