"use client";

import { useEffect, useState } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import type { Hospital, BloodStock, BloodGroup } from "@/types/hospital";
import { auth } from "../../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { serverTimestamp } from "firebase/firestore";


const EMPTY_STOCK: BloodStock = {
  "A+": 0, "A-": 0,
  "B+": 0, "B-": 0,
  "O+": 0, "O-": 0,
  "AB+": 0, "AB-": 0,
};

export default function HospitalDashboardPage() {
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [stock, setStock] = useState<BloodStock>(EMPTY_STOCK);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    const hospitalId = user.uid;

    const hospitalRef = doc(db, "hospitals", hospitalId);
    const hospitalSnap = await getDoc(hospitalRef);

    const userRef = doc(db, "users", hospitalId);
    const userSnap = await getDoc(userRef);

    const hospitalName =
      userSnap.exists() && userSnap.data().name
        ? userSnap.data().name
        : "Unnamed Hospital";

    if (hospitalSnap.exists()) {
      const data = hospitalSnap.data() as Hospital;

      // 🔥 FIX old data if name was wrong
      if (data.name !== hospitalName) {
        await updateDoc(hospitalRef, { name: hospitalName });
        data.name = hospitalName;
      }

      setHospital(data);
      setStock(data.bloodStock ?? EMPTY_STOCK);
    } else {
      const newHospital: Hospital = {
        id: hospitalId,
        name: hospitalName,
        address: "",
        location: null,
        bloodStock: EMPTY_STOCK,
        createdAt: serverTimestamp(),
      };

      await setDoc(hospitalRef, newHospital);
      setHospital(newHospital);
      setStock(EMPTY_STOCK);
    }
  });

  return () => unsubscribe();
}, []);



  async function saveStock() {
    if (!hospital) return;
    setSaving(true);
    await updateDoc(doc(db, "hospitals", hospital.id), {
      bloodStock: stock,
    });
    setSaving(false);
    alert("Blood stock updated successfully");
  }

  if (!hospital) {
    return <p className="p-6">Loading hospital dashboard...</p>;
  }

  return (
    <div className="p-4 sm:p-6 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-green-600">
          🏥 {hospital.name}
        </h2>
        <p className="text-sm text-gray-500">{hospital.address}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="Active Emergencies" value="3" color="red" />
        <DashboardCard title="Available Beds" value="12" color="blue" />
        <DashboardCard title="Ambulances" value="4" color="yellow" />
        <DashboardCard title="Blood Requests" value="5" color="purple" />
      </div>

      {/* Blood Stock Section */}
      <section className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-green-700">
          🩸 Blood Stock Management
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {(Object.keys(stock) as BloodGroup[]).map((key) => (
            <div
              key={key}
              className="border rounded-xl p-4 flex flex-col gap-2"
            >
              <span className="font-semibold text-gray-700">{key}</span>
              <input
                type="number"
                min={0}
                value={stock[key]}
                onChange={(e) =>
                  setStock({ ...stock, [key]: Number(e.target.value) })
                }
                className="border rounded-lg p-2 focus:ring-2 focus:ring-green-500"
              />
            </div>
          ))}
        </div>

        <button
          onClick={saveStock}
          disabled={saving}
          className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg
                     hover:bg-green-700 transition disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Blood Stock"}
        </button>
      </section>

      {/* Emergency Requests Preview */}
      <section className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-red-600">
          🚨 Emergency Requests (Preview)
        </h3>

        <p className="text-gray-500 text-sm">
          Incoming SOS requests will appear here with patient details,
          blood group, severity, and action buttons.
        </p>
      </section>

      {/* Resources Status */}
      <section className="grid md:grid-cols-2 gap-6">
        <ResourceCard title="🚑 Ambulance Status">
          Available: 3 <br />
          Busy: 1
        </ResourceCard>

        <ResourceCard title="🛏 Bed & ICU Status">
          General Beds: 8 <br />
          ICU Beds: 4
        </ResourceCard>
      </section>
    </div>
  );
}

/* Reusable Components */

function DashboardCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
    </div>
  );
}

function ResourceCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-sm text-gray-600">{children}</p>
    </div>
  );
}
