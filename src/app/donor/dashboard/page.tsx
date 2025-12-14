// /app/donor/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import useGeoLocation from "../../../hooks/useGeoLocation";
import Link from "next/link";
import AvailabilityToggle from "../../../components/AvailabilityToggle";

export default function DonorDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const { location } = useGeoLocation();

  useEffect(() => {
    const u = auth.currentUser;
    if (!u) return (window.location.href = "/auth/login");
    (async () => {
      const snap = await getDoc(doc(db, "users", u.uid));
      if (snap.exists()) setUser(snap.data());
    })();
  }, []);

  useEffect(() => {
    // Update location in DB while user is on dashboard and available
    const update = async () => {
      const u = auth.currentUser;
      if (!u || !location) return;
      await updateDoc(doc(db, "users", u.uid), { location });
    };
    update();
  }, [location]);

  return (
    <div>
      <h2 className="text-2xl mb-4">Donor Dashboard</h2>
      {user && (
        <div className="flex items-center gap-4">
          <div>
            <p className="font-semibold">{user.name}</p>
            <p>{user.bloodGroup}</p>
          </div>
          <div>
            <AvailabilityToggle />
          </div>
        </div>
      )}

      <div className="mt-6">
        <Link className="px-4 py-2 bg-blue-600 text-white rounded" href="/map">View Live Map</Link>
      </div>
    </div>
  );
}
