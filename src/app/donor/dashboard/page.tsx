"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import useGeoLocation from "@/hooks/useGeoLocation";
import Link from "next/link";
import AvailabilityToggle from "@/components/AvailabilityToggle";
import { signOut } from "firebase/auth";

type DonorUser = {
  name?: string;                 // ✅ optional
  bloodGroup?: string;           // ✅ optional
  availability?: boolean;        // ✅ optional
};

export default function DonorDashboardPage() {
  const [user, setUser] = useState<DonorUser | null>(null);
  const [loading, setLoading] = useState(true); // ✅ loading state
  const { location } = useGeoLocation();

  useEffect(() => {
    const u = auth.currentUser;
    if (!u) {
      window.location.href = "/auth/login";
      return;
    }

    (async () => {
      const snap = await getDoc(doc(db, "users", u.uid));
      if (snap.exists()) {
        setUser(snap.data() as DonorUser);
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    const updateLocation = async () => {
      const u = auth.currentUser;
      if (!u || !location) return;
      await updateDoc(doc(db, "users", u.uid), { location });
    };
    updateLocation();
  }, [location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-8 py-6">
      {/* Top Header with Logo + Logout */}
<div className="flex items-center justify-between mb-8 mt-4">
  {/* Logo */}
  <Link href="/" className="flex items-center gap-3 group">
    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl 
      bg-gradient-to-br from-red-600 to-red-400 
      flex items-center justify-center text-white font-extrabold shadow-lg 
      transition-transform duration-300 transform 
      hover:scale-125 hover:rotate-12 hover:shadow-2xl">
      RR
    </div>
    <span className="font-bold text-lg sm:text-xl transition-colors duration-300 group-hover:text-red-700">
      Rapid Rescuers
    </span>
  </Link>

  {/* Logout Button */}
  <button
    onClick={async () => {
      await signOut(auth);
      window.location.href = "/auth/login";
    }}
    className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition"
  >
    Logout
  </button>
</div>


      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Donor Dashboard 🩸
        </h1>
        <p className="text-gray-500 mt-1">
          Thank you for being a lifesaver
        </p>
      </div>

      {user && (
        <>
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow p-5 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 text-center sm:text-left">
              <p className="text-lg font-semibold">
                {user.name || "Anonymous Donor"}
              </p>

              <p className="text-gray-600">
                Blood Group:{" "}
                <span className="font-medium">
                  {user.bloodGroup || "Not set"} {/* ✅ FIX */}
                </span>
              </p>

              {!user.bloodGroup && (
                <p className="text-sm text-red-500 mt-1">
                  Please add your blood group
                </p>
              )}
            </div>

            <AvailabilityToggle />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <StatCard title="Lives Saved" value="12+" />
            <StatCard title="Requests Seen" value="24" />
            <StatCard
              title="Availability"
              value={user.availability ? "Active" : "Offline"}
            />
            <StatCard title="Location" value={location ? "Shared" : "Off"} />
          </div>

          {/* Actions */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/map"
              className="bg-blue-600 text-white py-4 rounded-xl text-center font-semibold hover:bg-blue-700 transition"
            >
              View Live Requests 🗺️
            </Link>

            <Link
              href="/donor/history"
              className="bg-green-600 text-white py-4 rounded-xl text-center font-semibold hover:bg-green-700 transition"
            >
              Donation History 📜
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

/* Small reusable stat card */
function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 text-center">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );
}
