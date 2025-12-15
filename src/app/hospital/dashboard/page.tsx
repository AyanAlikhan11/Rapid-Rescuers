// /app/hospital/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

export default function HospitalDashboardPage() {
  const [hospital, setHospital] = useState<any>(null);
  const [stock, setStock] = useState<Record<string, number>>({
    "A+":0,"A-":0,"B+":0,"B-":0,"O+":0,"O-":0,"AB+":0,"AB-":0
  });

  useEffect(() => {
    const id = "demo-hospital-id";
    (async () => {
      const snap = await getDoc(doc(db, "hospitals", id));
      if (snap.exists()) {
        setHospital(snap.data());
        setStock(snap.data().bloodStock || stock);
      } else {
        await setDoc(doc(db, "hospitals", id), { id, name: "Demo Hospital", address: "Demo address", location: null, bloodStock: stock });
        setHospital({ id, name: "Demo Hospital", address: "Demo address", bloodStock: stock });
      }
    })();
  }, []);

  async function saveStock() {
    await updateDoc(doc(db, "hospitals", "demo-hospital-id"), { bloodStock: stock });
    alert("Stock updated");
  }

  return (
    <div className="px-4 sm:px-6 py-6">
  <h2 className="text-xl sm:text-2xl font-semibold text-center sm:text-left text-green-600">
    Hospital Dashboard
  </h2>

  {/* Blood Stock Grid */}
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
    {Object.keys(stock).map((key) => (
      <div
        key={key}
        className="bg-white p-3 sm:p-4 rounded-xl shadow text-black"
      >
        <p className="font-semibold text-center sm:text-left">
          {key}
        </p>

        <input
          type="number"
          min={0}
          value={stock[key]}
          onChange={(e) =>
            setStock({ ...stock, [key]: Number(e.target.value) })
          }
          className="w-full mt-2 border p-2 rounded-lg text-sm sm:text-base
                     focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
    ))}
  </div>

  {/* Save Button */}
  <div className="mt-6 flex justify-center sm:justify-start">
    <button
      onClick={saveStock}
      className="w-full sm:w-auto bg-green-600 text-white px-6 py-3 rounded-lg
                 font-medium hover:bg-green-700 transition"
    >
      Save Stock
    </button>
  </div>
</div>

  );
}
