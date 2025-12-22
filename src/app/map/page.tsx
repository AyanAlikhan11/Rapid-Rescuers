"use client";

import { useEffect, useMemo, useState } from "react";
import MapComponent from "../../components/MapComponent";
import { db } from "../../lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

/* ================= TYPES ================= */

type Location = {
  lat: number;
  lng: number;
};

type Marker = {
  id: string;
  name: string;
  type: "hospital" | "donor";
  bloodGroup?: string;
  city?: string;
  location: Location;
};

type FilterType = "all" | "hospital" | "donor";

/* ================= PAGE ================= */

export default function MapPage() {
  const [allMarkers, setAllMarkers] = useState<Marker[]>([]);
  const [userLoc, setUserLoc] = useState<Location | null>(null);

  const [filter, setFilter] = useState<FilterType>("all");
  const [blood, setBlood] = useState<string>("all");
  const [city, setCity] = useState("");
  const [satellite, setSatellite] = useState(false);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    const load = async () => {
      const hospitals = await getDocs(collection(db, "hospitals"));
      const users = await getDocs(collection(db, "users"));

      const list: Marker[] = [];

      hospitals.forEach((d) => {
        const x = d.data();
        if (x?.location?.lat && x?.location?.lng) {
          list.push({
            id: d.id,
            name: x.name ?? "Hospital",
            type: "hospital",
            city: x.city,
            location: x.location,
          });
        }
      });

      users.forEach((d) => {
        const x = d.data();
        if (x?.location?.lat && x?.location?.lng) {
          list.push({
            id: d.id,
            name: x.name ?? "Donor",
            type: "donor",
            bloodGroup: x.bloodGroup,
            city: x.city,
            location: x.location,
          });
        }
      });

      setAllMarkers(list);
    };

    load();

    navigator.geolocation.getCurrentPosition(
      (p) =>
        setUserLoc({
          lat: p.coords.latitude,
          lng: p.coords.longitude,
        }),
      () => null
    );
  }, []);

  /* ================= DISTANCE ================= */

  const distanceKm = (a: Location, b: Location) => {
    const R = 6371;
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLng = ((b.lng - a.lng) * Math.PI) / 180;
    const x =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((a.lat * Math.PI) / 180) *
        Math.cos((b.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  };

  /* ================= FILTER ================= */

  const filtered = useMemo(() => {
    return allMarkers.filter((m) => {
      if (filter !== "all" && m.type !== filter) return false;
      if (blood !== "all" && m.bloodGroup !== blood) return false;
      if (city && !m.city?.toLowerCase().includes(city.toLowerCase()))
        return false;
      return true;
    });
  }, [allMarkers, filter, blood, city]);

  /* ================= NEAREST HOSPITAL ================= */

  const nearestHospital = useMemo(() => {
    if (!userLoc) return null;
    const hospitals = filtered.filter((m) => m.type === "hospital");
    if (hospitals.length === 0) return null;

    return hospitals.reduce((a, b) =>
      distanceKm(userLoc, a.location) <
      distanceKm(userLoc, b.location)
        ? a
        : b
    );
  }, [filtered, userLoc]);

  /* ================= SOS ================= */

  const sendSOS = async () => {
    if (!userLoc) return alert("Location needed");

    await addDoc(collection(db, "sos_alerts"), {
      location: userLoc,
      createdAt: serverTimestamp(),
      status: "active",
    });

    alert("🚨 SOS sent successfully");
  };

  /* ================= UI ================= */

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-red-600 text-center">
        🚑 Emergency Map
      </h1>

      {/* CONTROLS */}
      <div className="grid md:grid-cols-5 gap-3">
        <select
          value={filter}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "all" || v === "hospital" || v === "donor")
              setFilter(v);
          }}
          className="border p-2 rounded"
        >
          <option value="all">All</option>
          <option value="hospital">Hospitals</option>
          <option value="donor">Donors</option>
        </select>

        <select
          value={blood}
          onChange={(e) => setBlood(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All Blood</option>
          {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
            (b) => (
              <option key={b}>{b}</option>
            )
          )}
        </select>

        <input
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          onClick={() => setSatellite(!satellite)}
          className="bg-gray-800 text-white rounded px-3"
        >
          🛰 {satellite ? "Normal" : "Satellite"}
        </button>

        <button
          onClick={sendSOS}
          className="bg-red-600 text-white rounded px-3"
        >
          🚨 SOS
        </button>
      </div>

      {/* MAP */}
      <div className="h-[70vh] border rounded-xl overflow-hidden">
        <MapComponent
          center={
            nearestHospital?.location ??
            userLoc ??
            { lat: 20.5937, lng: 78.9629 }
          }
          satellite={satellite}
        />
      </div>

      {/* LIST */}
      <div className="bg-white border rounded-xl p-4 space-y-2">
        {filtered.map((m) => {
          const km =
            userLoc && distanceKm(userLoc, m.location).toFixed(2);

          return (
            <div
              key={m.id}
              className={`flex justify-between p-2 rounded ${
                m.id === nearestHospital?.id
                  ? "bg-red-100 border border-red-400"
                  : "border"
              }`}
            >
              <div>
                <p className="font-semibold">{m.name}</p>
                <p className="text-sm text-gray-600">
                  {m.type} {m.bloodGroup && `| ${m.bloodGroup}`}
                </p>
                {km && <p className="text-sm">📍 {km} km away</p>}
              </div>

              <button
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${m.location.lat},${m.location.lng}`,
                    "_blank"
                  )
                }
                className="text-red-600 font-semibold"
              >
                ⏱ ETA
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
