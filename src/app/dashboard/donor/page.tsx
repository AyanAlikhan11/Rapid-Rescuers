"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import useGeoLocation from "@/hooks/useGeoLocation";
import Link from "next/link";
import AvailabilityToggle from "@/components/AvailabilityToggle";
import { signOut } from "firebase/auth";
import DonationChart from "@/components/charts/DonationChart";

type DonorUser = {
  name?: string;
  bloodGroup?: string;
  availability?: boolean;
};

export default function DonorDashboardPage() {
  const [user, setUser] = useState<DonorUser | null>(null);
  const [loading, setLoading] = useState(true);
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
    const u = auth.currentUser;
    if (!u || !location) return;

    updateDoc(doc(db, "users", u.uid), { location });
  }, [location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading donor dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-8 py-6 space-y-8">
      {/* TOP BAR */}
      <div className="flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-400
                          flex items-center justify-center text-white font-bold shadow-lg
                          group-hover:scale-110 transition"
          >
            RR
          </div>
          <span className="font-bold text-xl group-hover:text-red-700 transition">
            Rapid Rescuers
          </span>
        </Link>

        <button
          onClick={async () => {
            await signOut(auth);
            window.location.href = "/auth/login";
          }}
          className="px-4 py-2 text-sm border border-red-600 text-red-600
                     rounded-lg hover:bg-red-50 transition"
        >
          Logout
        </button>
      </div>

      {/* HEADER */}
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Donor Dashboard 🩸</h1>
        <p className="text-gray-500 mt-1">Every drop matters ❤️</p>
      </header>

      {user && (
        <>
          {/* PROFILE */}
          <section className="bg-white rounded-2xl shadow p-6 flex flex-col sm:flex-row items-center gap-6 hover:shadow-lg transition">
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-semibold">
                {user.name || "Anonymous Donor"}
              </h2>
              <p className="text-gray-600 mt-1">
                Blood Group:{" "}
                <span className="font-medium">
                  {user.bloodGroup || "Not set"}
                </span>
              </p>
              {!user.bloodGroup && (
                <p className="text-sm text-red-500 mt-1">
                  Please update your blood group
                </p>
              )}
            </div>

            <AvailabilityToggle />
          </section>

          {/* STATS */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard title="Lives Saved" value="12+" />
            <StatCard title="Requests Seen" value="24" />
            <StatCard
              title="Availability"
              value={user.availability ? "Active" : "Offline"}
            />
            <StatCard title="Location" value={location ? "Shared" : "Off"} />
          </section>
          {/* DONATION CHART */}
          <section>
            <DonationChart />
          </section>

          {/* ACTIONS */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/map"
              className="bg-blue-600 text-white py-4 rounded-xl font-semibold
                         text-center hover:bg-blue-700 transition transform hover:-translate-y-1"
            >
              View Live Requests 🗺️
            </Link>

            <Link
              href="/donor/history"
              className="bg-green-600 text-white py-4 rounded-xl font-semibold
                         text-center hover:bg-green-700 transition transform hover:-translate-y-1"
            >
              Donation History 📜
            </Link>
          </section>
        </>
      )}
    </div>
  );
}

/* STAT CARD */
function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div
      className="bg-white rounded-2xl shadow p-4 text-center
                    hover:shadow-lg transition transform hover:-translate-y-1"
    >
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-xl font-bold mt-2">{value}</p>
    </div>
  );
}
