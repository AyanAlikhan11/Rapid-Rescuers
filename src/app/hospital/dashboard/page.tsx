"use client";

import { useEffect, useState } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import type { Hospital, BloodStock, BloodGroup } from "@/types/hospital";

const EMPTY_STOCK: BloodStock = {
  "A+": 0, "A-": 0,
  "B+": 0, "B-": 0,
  "O+": 0, "O-": 0,
  "AB+": 0, "AB-": 0,
};

export default function HospitalDashboardPage() {
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [stock, setStock] = useState<BloodStock>(EMPTY_STOCK);

  useEffect(() => {
    const id = "demo-hospital-id";

    (async () => {
      const ref = doc(db, "hospitals", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data() as Hospital;
        setHospital(data);
        setStock(data.bloodStock ?? EMPTY_STOCK);
      } else {
        const newHospital: Hospital = {
          id,
          name: "Demo Hospital",
          address: "Demo address",
          location: null,
          bloodStock: EMPTY_STOCK,
        };

        await setDoc(ref, newHospital);
        setHospital(newHospital);
        setStock(EMPTY_STOCK);
      }
    })();
  }, []);

  async function saveStock() {
    if (!hospital) return;
    await updateDoc(doc(db, "hospitals", hospital.id), {
      bloodStock: stock,
    });
    alert("Stock updated");
  }

  if (!hospital) {
    return <p className="p-6">Loading hospital data...</p>;
  }

  return (
    <div className="px-4 sm:px-6 py-6">
      <h2 className="text-xl sm:text-2xl font-semibold text-green-600">
        Hospital Dashboard
      </h2>

      {/* Blood Stock Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
        {(Object.keys(stock) as BloodGroup[]).map((key) => (
          <div
            key={key}
            className="bg-white p-4 rounded-xl shadow text-black"
          >
            <p className="font-semibold">{key}</p>

            <input
              type="number"
              min={0}
              value={stock[key]}
              onChange={(e) =>
                setStock({ ...stock, [key]: Number(e.target.value) })
              }
              className="w-full mt-2 border p-2 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="mt-6">
        <button
          onClick={saveStock}
          className="bg-green-600 text-white px-6 py-3 rounded-lg
                     font-medium hover:bg-green-700 transition"
        >
          Save Stock
        </button>
      </div>
    </div>
  );
}
