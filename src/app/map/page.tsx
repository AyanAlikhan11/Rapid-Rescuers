// /app/map/page.tsx
"use client";
import MapComponent from "../../components/MapComponent";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function MapPage() {
  const [markers, setMarkers] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const uSnap = await getDocs(collection(db, "users"));
      const hSnap = await getDocs(collection(db, "hospitals"));
      const m: any[] = [];
      uSnap.forEach(d => {
        const data = d.data();
        if (data.location) m.push({ position: data.location, title: `${data.name} (${data.bloodGroup})`});
      });
      hSnap.forEach(d => {
        const data = d.data();
        if (data.location) m.push({ position: data.location, title: `${data.name} (Hospital)`});
      });
      setMarkers(m);
    })();
  }, []);

  return (
    <div className="px-4 sm:px-6 py-6">
  <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center sm:text-left">
    Live Map
  </h2>

  <div className="w-full h-[60vh] sm:h-[70vh] lg:h-[80vh] rounded-xl overflow-hidden shadow">
    <MapComponent markers={markers} />
  </div>
</div>

  );
}
