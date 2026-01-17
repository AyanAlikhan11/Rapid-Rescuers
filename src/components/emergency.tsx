"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const BLOOD_GROUPS = ["A+","A-","B+","B-","O+","O-","AB+","AB-"];

type LocationCoords = {
  lat: number;
  lng: number;
};

export default function EmergencyPage() {
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationCoords | null>(null);

  /* ======================
     REQUEST LOCATION
     ====================== */
  const requestLocationAccess = async () => {
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
          })
      );

      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    } catch {
      setError("Location access is required to send SOS");
    }
  };

  /* ======================
        SEND SOS
     ====================== */
  const handleSOS = async () => {
    if (!auth.currentUser) {
      setError("You must be logged in");
      return;
    }

    if (!location) {
      setError("Please enable location first");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // 🔥 CREATE ALERT (this is what dashboards listen to)
      await addDoc(collection(db, "alerts"), {
        bloodGroupNeeded: bloodGroup,
        requestedBy: auth.currentUser.uid,
        requesterName: auth.currentUser.displayName ?? "Unknown",
        location,
        status: "open",              // 🚨 VERY IMPORTANT
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
    } catch (err) {
      console.error("SOS ERROR:", err);
      setError("Failed to send SOS. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
      <div className="bg-white p-6 rounded-xl shadow max-w-md w-full">

        <h1 className="text-2xl font-bold text-red-600 mb-2">
          🚨 Emergency Blood Alert
        </h1>

        <p className="text-gray-600 text-sm mb-4">
          Use this only in real emergencies.
        </p>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-sm">
          <ul className="list-disc pl-5 space-y-1">
            <li>Your live location will be shared</li>
            <li>Nearby donors & hospitals notified</li>
            <li>False alerts may restrict your account</li>
          </ul>
        </div>

        {!location && (
          <button
            onClick={requestLocationAccess}
            className="w-full bg-yellow-500 text-white py-2 rounded mb-4 hover:bg-yellow-600"
          >
            📍 Enable Location Access
          </button>
        )}

        <select
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
          className="w-full border p-3 rounded mb-4"
        >
          {BLOOD_GROUPS.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        {error && (
          <p className="text-red-600 text-sm text-center mb-3">
            ❌ {error}
          </p>
        )}

        <button
          onClick={handleSOS}
          disabled={submitting}
          className="w-full bg-red-600 text-white py-3 rounded font-semibold hover:bg-red-700 disabled:opacity-60"
        >
          {submitting ? "Sending SOS..." : "🚨 Send SOS"}
        </button>

        {success && (
          <p className="text-green-600 text-sm mt-4 text-center font-medium">
            ✅ SOS sent successfully. Donors & hospitals notified.
          </p>
        )}

        <p className="mt-6 text-xs text-center text-gray-500">
          Also contact local emergency services if required.
        </p>
      </div>
    </div>
  );
}
