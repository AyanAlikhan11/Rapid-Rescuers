"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import type { BloodGroup, BloodStock, Hospital } from "@/types/hospital";
import BloodStockChart from "@/components/charts/BloodStockChart";
import RequestTrendChart from "@/components/charts/RequestTrendChart";
import { signOut } from "firebase/auth";

const EMPTY_STOCK: BloodStock = {
  "A+": 0,
  "A-": 0,
  "B+": 0,
  "B-": 0,
  "O+": 0,
  "O-": 0,
  "AB+": 0,
  "AB-": 0,
};

export default function HospitalDashboardPage() {
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [stock, setStock] = useState<BloodStock>(EMPTY_STOCK);
  const [saving, setSaving] = useState(false);

  /* AUTH + DATA */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const ref = doc(db, "hospitals", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data() as Hospital;
        setHospital(data);
        setStock(data.bloodStock ?? EMPTY_STOCK);
      } else {
        const newHospital: Hospital = {
          id: user.uid,
          name: user.displayName || "Hospital",
          address: "",
          location: null,
          bloodStock: EMPTY_STOCK,
          createdAt: serverTimestamp(),
        };
        await setDoc(ref, newHospital);
        setHospital(newHospital);
      }
    });

    return () => unsub();
  }, []);

  async function saveStock() {
    if (!hospital) return;
    setSaving(true);

    await updateDoc(doc(db, "hospitals", hospital.id), {
      bloodStock: stock,
      updatedAt: serverTimestamp(),
    });

    setSaving(false);
    alert("Blood stock updated successfully ✅");
  }

  if (!hospital) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading hospital dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 space-y-8">
      {/* HEADER */}
      <header className="bg-white rounded-2xl shadow p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-green-700">
            🏥 {hospital.name}
          </h1>
          <p className="text-gray-500 text-sm">Hospital Control Panel</p>
        </div>

        <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium">
          Active
        </span>
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
      </header>

      {/* QUICK STATS */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Emergencies" value="3" color="red" />
        <StatCard title="Available Beds" value="12" color="blue" />
        <StatCard title="Ambulances" value="4" color="yellow" />
        <StatCard title="Blood Requests" value="5" color="purple" />
      </section>

      {/* BLOOD STOCK */}
      <section className="bg-white rounded-2xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-green-700">
            🩸 Blood Stock Management
          </h2>
          <span className="text-sm text-gray-500">Units available</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {(Object.keys(stock) as BloodGroup[]).map((group) => (
            <div
              key={group}
              className="border rounded-xl p-4 hover:shadow-md transition"
            >
              <p className="font-semibold text-gray-700">{group}</p>
              <input
                type="number"
                min={0}
                value={stock[group]}
                onChange={(e) =>
                  setStock({
                    ...stock,
                    [group]: Number(e.target.value),
                  })
                }
                className="mt-2 w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500"
              />
            </div>
          ))}
        </div>

        <button
          onClick={saveStock}
          disabled={saving}
          className="mt-6 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold
                     hover:bg-green-700 transition active:scale-95 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Update Stock"}
        </button>
      </section>
      {/* CHARTS */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BloodStockChart stock={stock} />
        <RequestTrendChart />
      </section>
    </div>
  );
}

/* COMPONENTS */

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: "red" | "blue" | "yellow" | "purple";
}) {
  const colors = {
    red: "text-red-600 bg-red-50",
    blue: "text-blue-600 bg-blue-50",
    yellow: "text-yellow-600 bg-yellow-50",
    purple: "text-purple-600 bg-purple-50",
  };

  return (
    <div
      className={`rounded-2xl p-5 shadow hover:shadow-lg transition transform hover:-translate-y-1 ${colors[color]}`}
    >
      <p className="text-sm">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
