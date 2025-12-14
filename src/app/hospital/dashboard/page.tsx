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
    <div>
      <h2 className="text-2xl">Hospital Dashboard</h2>
      <div className="grid grid-cols-4 gap-3 mt-4">
        {Object.keys(stock).map(key => (
          <div key={key} className="bg-white p-3 rounded shadow">
            <p className="font-semibold">{key}</p>
            <input type="number" value={stock[key]} min={0}
              onChange={e=> setStock({...stock, [key]: Number(e.target.value)})}
              className="w-full mt-2 border p-1 rounded"/>
          </div>
        ))}
      </div>
      <button onClick={saveStock} className="mt-4 bg-green-600 text-white px-4 py-2 rounded">Save Stock</button>
    </div>
  );
}
