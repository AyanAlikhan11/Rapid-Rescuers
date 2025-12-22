"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  onSnapshot,
  query,
  where,
  addDoc,
  orderBy,
  limit,
} from "firebase/firestore";

import {
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";

import BloodStockChart from "@/components/charts/BloodStockChart";
import RequestTrendChart from "@/components/charts/RequestTrendChart";

/* ---------------- TYPES ---------------- */

type BloodGroup = "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";

type BloodStock = Record<BloodGroup, number>;

type Hospital = {
  id: string;
  name: string;
  address: string;
  bloodStock: BloodStock;
};

type AlertItem = {
  id: string;
  bloodGroupNeeded: BloodGroup;
  requestedBy: string;
  status: "open" | "accepted" | "rejected";
};

type NotificationItem = {
  id: string;
  message: string;
  alertId?: string;
};

/* ---------------- CONSTANTS ---------------- */

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

/* ---------------- PAGE ---------------- */

export default function HospitalDashboardPage() {
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [stock, setStock] = useState<BloodStock>(EMPTY_STOCK);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  /* ---------------- AUTH + DATA ---------------- */

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      /* Hospital profile */
      const ref = doc(db, "hospitals", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data() as Hospital;
        setHospital(data);
        setStock(data.bloodStock ?? EMPTY_STOCK);
      } else {
        const newHospital: Hospital = {
          id: user.uid,
          name: "Hospital",
          address: "",
          bloodStock: EMPTY_STOCK,
        };
        await setDoc(ref, newHospital);
        setHospital(newHospital);
      }

      /* OPEN Emergency Alerts ONLY */
      const alertQuery = query(
        collection(db, "alerts"),
        where("status", "==", "open")
      );

      onSnapshot(alertQuery, (snap) => {
        setAlerts(
          snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<AlertItem, "id">),
          }))
        );
      });

      /* Notifications */
      const notifQuery = query(
        collection(db, "notifications", user.uid, "items"),
        orderBy("createdAt", "desc"),
        limit(5)
      );

      onSnapshot(notifQuery, (snap) => {
        const list = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<NotificationItem, "id">),
        }));
        setNotifications(list);
      });
    });

    return () => unsub();
  }, []);

  /* ---------------- ACTIONS ---------------- */

  async function saveStock() {
    if (!hospital) return;
    setSaving(true);

    await updateDoc(doc(db, "hospitals", hospital.id), {
      bloodStock: stock,
      updatedAt: serverTimestamp(),
    });

    setSaving(false);
    alert("Blood stock updated ✅");
  }

  async function acceptAlert(alert: AlertItem) {
    if (!auth.currentUser) return;

    /* 1️⃣ Update alert */
    await updateDoc(doc(db, "alerts", alert.id), {
      status: "accepted",
      acceptedBy: auth.currentUser.uid,
      acceptedByRole: "hospital",
      acceptedAt: serverTimestamp(),
    });

    /* 2️⃣ Notify requester */
    await addDoc(collection(db, "notifications", alert.requestedBy, "items"), {
      type: "accepted",
      message: "🏥 A hospital accepted your emergency request",
      alertId: alert.id,
      createdAt: serverTimestamp(),
    });

    /* 3️⃣ Notify hospital itself (STATUS CHANGE) */
    await addDoc(
      collection(db, "notifications", auth.currentUser.uid, "items"),
      {
        type: "info",
        message: `✅ You accepted emergency request for ${alert.bloodGroupNeeded}`,
        alertId: alert.id,
        createdAt: serverTimestamp(),
      }
    );
  }

  async function rejectAlert(alertId: string) {
    await updateDoc(doc(db, "alerts", alertId), {
      status: "rejected",
    });
  }

  async function resetPassword() {
    if (!auth.currentUser?.email) return;
    await sendPasswordResetEmail(auth, auth.currentUser.email);
    alert("Password reset email sent 📧");
  }

  if (!hospital) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading hospital dashboard...
      </div>
    );
  }

  /* ---------------- UI (UNCHANGED) ---------------- */

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      {/* HEADER */}
      <header className="bg-white rounded-2xl shadow p-6 flex justify-between items-center relative">
        <div>
          <h1 className="text-2xl font-bold text-green-700">
            🏥 {hospital.name}
          </h1>
          <p className="text-sm text-gray-500">Hospital Dashboard</p>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-10 h-10 bg-gray-100 rounded-full"
        >
          ☰
        </button>

        {menuOpen && (
          <div className="absolute right-6 top-20 bg-white shadow-xl rounded-xl w-64 p-4 z-50">
            <p className="text-sm mb-2">{auth.currentUser?.email}</p>
            {/* NOTIFICATIONS */}
            <section className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-lg font-semibold text-green-700 mb-4">
                🔔 Notifications
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
            <button
              onClick={resetPassword}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
            >
              🔐 Reset Password
            </button>
            <button
              onClick={async () => {
                await signOut(auth);
                window.location.href = "/auth/login";
              }}
              className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded"
            >
              🚪 Logout
            </button>
          </div>
        )}
      </header>

      {/* EMERGENCY REQUESTS */}
      <section className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold text-red-600 mb-4">
          🚨 Emergency Requests
        </h2>

        {alerts.length === 0 ? (
          <p className="text-sm text-gray-500">No active emergencies</p>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="border rounded-xl p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">
                    Blood Needed: {alert.bloodGroupNeeded}
                  </p>
                  <p className="text-xs text-gray-500">Alert ID: {alert.id}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => acceptAlert(alert)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => rejectAlert(alert.id)}
                    className="px-4 py-2 bg-gray-200 rounded-lg"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* BLOOD STOCK */}
      <section className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold text-green-700 mb-4">
          🩸 Blood Stock
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(Object.keys(stock) as BloodGroup[]).map((group) => (
            <div key={group} className="border rounded-lg p-3">
              <p className="font-semibold">{group}</p>
              <input
                type="number"
                min={0}
                value={stock[group]}
                onChange={(e) =>
                  setStock({ ...stock, [group]: Number(e.target.value) })
                }
                className="mt-2 w-full border rounded p-2"
              />
            </div>
          ))}
        </div>

        <button
          onClick={saveStock}
          disabled={saving}
          className="mt-6 bg-green-600 text-white px-6 py-3 rounded-xl"
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
