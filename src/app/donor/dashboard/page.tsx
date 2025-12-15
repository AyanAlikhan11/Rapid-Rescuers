// /app/donor/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import useGeoLocation from "../../../hooks/useGeoLocation";
import Link from "next/link";
import AvailabilityToggle from "../../../components/AvailabilityToggle";

export default function DonorDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const { location } = useGeoLocation();

  useEffect(() => {
    const u = auth.currentUser;
    if (!u) return (window.location.href = "/auth/login");
    (async () => {
      const snap = await getDoc(doc(db, "users", u.uid));
      if (snap.exists()) setUser(snap.data());
    })();
  }, []);

  useEffect(() => {
    // Update location in DB while user is on dashboard and available
    const update = async () => {
      const u = auth.currentUser;
      if (!u || !location) return;
      await updateDoc(doc(db, "users", u.uid), { location });
    };
    update();
  }, [location]);

  return (
    <div className="px-4 sm:px-6 py-6">
  <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center sm:text-left">
    Donor Dashboard
  </h2>

  {user && (
    <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 bg-white p-4 rounded-xl shadow">
      
      {/* User Info */}
      <div className="text-center sm:text-left flex-1">
        <p className="font-semibold text-lg">{user.name}</p>
        <p className="text-gray-600">Blood Group: {user.bloodGroup}</p>
      </div>

      {/* Availability Toggle */}
      <div className="w-full sm:w-auto flex justify-center sm:justify-end">
        <AvailabilityToggle />
      </div>
    </div>
  )}

  {/* Action Button */}
  <div className="mt-6 flex justify-center sm:justify-start">
    <Link
      href="/map"
      className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg text-center font-medium hover:bg-blue-700 transition"
    >
      View Live Map
    </Link>
  </div>
</div>

  );
}
