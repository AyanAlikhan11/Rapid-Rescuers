"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  onSnapshot,
  query,
  where,
  addDoc,
  serverTimestamp,
  orderBy,
  limit,
} from "firebase/firestore";
import useGeoLocation from "@/hooks/useGeoLocation";
import Link from "next/link";
import AvailabilityToggle from "@/components/AvailabilityToggle";
import { signOut } from "firebase/auth";
import DonationChart from "@/components/charts/DonationChart";
import { Timestamp } from "firebase/firestore";


/* ================= TYPES ================= */

type DonorUser = {
  name?: string;
  bloodGroup?: string;
  availability?: boolean;
};

type AlertItem = {
  id: string;
  bloodGroupNeeded: string;
  requestedBy: string;
  status: "open" | "accepted" | "rejected";
};

type NotificationItem = {
  id: string;
  message: string;
  type: "sos" | "accepted" | "info";
  alertId?: string;
  createdAt: Timestamp; // Firestore Timestamp
};

/* ================= COMPONENT ================= */

export default function DonorDashboardPage() {
  const [user, setUser] = useState<DonorUser | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { location } = useGeoLocation();

  /* ================= LOAD USER ================= */

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

  /* ================= UPDATE LOCATION ================= */

  useEffect(() => {
    const u = auth.currentUser;
    if (!u || !location) return;

    updateDoc(doc(db, "users", u.uid), { location });
  }, [location]);

  /* ================= LISTEN OPEN ALERTS ================= */

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "alerts"),
      where("status", "==", "open")
    );

    const unsub = onSnapshot(q, (snap) => {
      setAlerts(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<AlertItem, "id">),
        }))
      );
    });

    return () => unsub();
  }, []);

  /* ================= LISTEN NOTIFICATIONS (LATEST 5) ================= */

  useEffect(() => {
    if (!auth.currentUser) return;

    const notifQuery = query(
      collection(db, "notifications", auth.currentUser.uid, "items"),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const unsub = onSnapshot(notifQuery, (snap) => {
      setNotifications(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<NotificationItem, "id">),
        }))
      );
    });

    return () => unsub();
  }, []);

  /* ================= ACCEPT ALERT ================= */

  async function acceptAlert(alert: AlertItem) {
    if (!auth.currentUser) return;

    /* Update alert */
    await updateDoc(doc(db, "alerts", alert.id), {
      status: "accepted",
      acceptedBy: auth.currentUser.uid,
      acceptedByRole: "donor",
      acceptedAt: serverTimestamp(),
    });

    /* Notify requester */
    await addDoc(
      collection(db, "notifications", alert.requestedBy, "items"),
      {
        type: "accepted",
        alertId: alert.id,
        message: "🩸 A donor accepted your emergency request",
        createdAt: serverTimestamp(),
      }
    );

    /* Notify donor (self) */
    await addDoc(
      collection(db, "notifications", auth.currentUser.uid, "items"),
      {
        type: "info",
        alertId: alert.id,
        message: `✅ You accepted an emergency request for ${alert.bloodGroupNeeded}`,
        createdAt: serverTimestamp(),
      }
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading donor dashboard...
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-red-100 to-blue-200 px-4 sm:px-8 py-6 space-y-8">

      {/* TOP BAR */}
      <div className="flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-400
                          flex items-center justify-center text-white font-bold shadow-lg
                          group-hover:scale-110 transition">
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
        <h1 className="text-3xl font-bold text-gray-800">
          Donor Dashboard 🩸
        </h1>
        <p className="text-gray-500 mt-1">Every drop matters ❤️</p>
      </header>

      {user && (
        <>
          {/* PROFILE */}
          <section className="bg-white rounded-2xl shadow p-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-semibold">
                {user.name || "Anonymous Donor"}
              </h2>
              <p className="text-gray-600 mt-1">
                Blood Group: <b>{user.bloodGroup || "Not set"}</b>
              </p>
            </div>
            <AvailabilityToggle />
          </section>

          {/* EMERGENCY REQUESTS */}
          <section className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold text-red-600 mb-4">
              🚨 Emergency Requests
            </h2>

            {alerts.length === 0 ? (
              <p className="text-sm text-gray-500">
                No emergency requests right now
              </p>
            ) : (
              alerts.map((a) => (
                <div
                  key={a.id}
                  className="border rounded-xl p-4 flex justify-between items-center mb-3"
                >
                  <p>
                    Blood Needed: <b>{a.bloodGroupNeeded}</b>
                  </p>
                  <button
                    onClick={() => acceptAlert(a)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    Accept
                  </button>
                </div>
              ))
            )}
          </section>

          {/* NOTIFICATIONS */}
          <section className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold text-green-700 mb-4">
              🔔 Notifications (Latest 5)
            </h2>

            {notifications.length === 0 ? (
              <p className="text-sm text-gray-500">No notifications</p>
            ) : (
              <ul className="space-y-2">
                {notifications.map((n) => (
                  <li key={n.id} className="border p-3 rounded-lg text-sm">
                    {n.message}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* STATS */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard title="Lives Saved" value="12+" />
            <StatCard title="Requests Seen" value={`${alerts.length}`} />
            <StatCard
              title="Availability"
              value={user.availability ? "Active" : "Offline"}
            />
            <StatCard title="Location" value={location ? "Shared" : "Off"} />
          </section>

          <DonationChart />
        </>
      )}
    </div>
  );
}

/* ================= STAT CARD ================= */

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 text-center">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-xl font-bold mt-2">{value}</p>
    </div>
  );
}
