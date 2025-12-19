"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function EmergencyPage() {
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationGranted, setLocationGranted] = useState(false);

  // Function to request location access
  const requestLocationAccess = async () => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported on this device");
      return;
    }

    try {
      await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });
      setLocationGranted(true);
      setError(null);
    } catch (err: any) {
      if (err.code === err.PERMISSION_DENIED) {
        setError("Please allow location access to send SOS");
      } else if (err.code === err.POSITION_UNAVAILABLE) {
        setError("Location information is unavailable");
      } else if (err.code === err.TIMEOUT) {
        setError("Location request timed out");
      } else {
        setError("Failed to get your location");
      }
    }
  };

  async function handleSOS() {
    setSubmitting(true);
    setSuccess(false);
    setError(null);

    try {
      if (!locationGranted) {
        throw new Error("Please enable location access first");
      }

      const position = await new Promise<{ lat: number; lng: number }>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) =>
              resolve({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              }),
            (err) => {
              if (err.code === err.PERMISSION_DENIED) {
                reject(new Error("Please allow location access to send SOS"));
              } else if (err.code === err.POSITION_UNAVAILABLE) {
                reject(new Error("Location information is unavailable"));
              } else if (err.code === err.TIMEOUT) {
                reject(new Error("Location request timed out"));
              } else {
                reject(new Error("Failed to get your location"));
              }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
          );
        }
      );

      await addDoc(collection(db, "alert"), {
        bloodGroupNeeded: bloodGroup,
        location: position,
        radiusKm: 5,
        status: "open",
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
    } catch (err: unknown) {
      console.error("SOS ERROR:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white px-4 py-10">
      <div className="w-full max-w-lg mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-xl">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-red-600">
            🚨 Emergency Blood Alert
          </h1>
          <p className="text-gray-600 text-sm mt-2">
            Use this feature only in real emergencies. Nearby donors will be notified immediately.
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-sm text-gray-700">
          <ul className="list-disc pl-5 space-y-1">
            <li>Your live location will be used to find nearby donors</li>
            <li>Search radius is limited to 5 km</li>
            <li>False alerts may lead to account restrictions</li>
          </ul>
        </div>

        {/* Location Access Button */}
        {!locationGranted && (
          <button
            onClick={requestLocationAccess}
            className="w-full mb-5 py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition"
          >
            📍 Enable Location Access
          </button>
        )}

        {/* Blood Group */}
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Required Blood Group
        </label>
        <select
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
          className="w-full p-3 border rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        {/* Error Message */}
        {error && (
          <div className="mb-4 text-sm text-red-600 text-center font-medium">
            ❌ {error}
          </div>
        )}

        {/* SOS Button */}
        <button
          disabled={submitting || !locationGranted}
          onClick={handleSOS}
          className="w-full py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-60"
        >
          {submitting ? "Sending Alert..." : "🚨 Send Emergency Alert"}
        </button>

        {/* Success Message */}
        {success && (
          <div className="mt-4 text-green-600 text-sm text-center font-medium">
            ✅ Emergency alert sent successfully. Donors are being notified.
          </div>
        )}

        {/* Footer */}
        <p className="mt-6 text-xs text-center text-gray-500">
          If the situation is critical, please also contact local emergency services.
        </p>
      </div>
    </div>
  );
}
