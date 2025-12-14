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
    <div>
      <h2 className="text-2xl mb-4">Live Map</h2>
      <MapComponent markers={markers} />
    </div>
  );
}
