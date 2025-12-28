//ALERT SOUND UPDATED CODE

"use client";

import { useEffect, useRef, useState } from "react";
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
import { onAuthStateChanged } from "firebase/auth";

import BloodStockChart from "@/components/charts/BloodStockChart";
import RequestTrendChart from "@/components/charts/RequestTrendChart";

import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "@/components/ui/sidebar";

import {
  IconLayoutDashboard,
  IconDroplet,
  IconBell,
  IconLogout,
} from "@tabler/icons-react";

/* ---------------- TYPES ---------------- */

type BloodGroup =
  | "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";

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

/* ---------------- CONSTANT ---------------- */

const EMPTY_STOCK: BloodStock = {
  "A+": 0, "A-": 0, "B+": 0, "B-": 0,
  "O+": 0, "O-": 0, "AB+": 0, "AB-": 0,
};

export default function HospitalDashboardPage() {
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [stock, setStock] = useState<BloodStock>(EMPTY_STOCK);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [popupAlert, setPopupAlert] = useState<AlertItem | null>(null);
  const [saving, setSaving] = useState(false);

  /* Sidebar state */
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* 🔊 Audio handling (FIXED) */
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const soundUnlocked = useRef(false);
  const seenAlerts = useRef<Set<string>>(new Set());

  const links = [
    {
      label: "Dashboard",
      href: "/hospital/dashboard",
      icon: <IconLayoutDashboard />,
    },
    {
      label: "Blood Stock",
      href: "/hospital/blood-stock",
      icon: <IconDroplet />,
    },
    {
      label: "Blood Alerts",
      href: "/hospital/alerts",
      icon: <IconBell />,
    },
    {
      label: "Logout",
      href: "/logout",
      icon: <IconLogout />,
    },
  ];

  /* 🔓 Unlock audio on first user interaction */
  useEffect(() => {
    audioRef.current = new Audio("/alert.mp3");
    audioRef.current.volume = 1;

    const unlock = () => {
      audioRef.current
        ?.play()
        .then(() => {
          audioRef.current?.pause();
          audioRef.current!.currentTime = 0;
          soundUnlocked.current = true;
        })
        .catch(() => {});
      window.removeEventListener("click", unlock);
    };

    window.addEventListener("click", unlock);
    return () => window.removeEventListener("click", unlock);
  }, []);

  /* ---------------- AUTH + REALTIME ALERTS ---------------- */

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

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

      const alertQuery = query(
        collection(db, "alerts"),
        where("status", "==", "open")
      );

      onSnapshot(alertQuery, (snap) => {
        const incoming = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<AlertItem, "id">),
        }));

        setAlerts(incoming);

        incoming.forEach((alert) => {
          if (!seenAlerts.current.has(alert.id)) {
            seenAlerts.current.add(alert.id);
            setPopupAlert(alert);

            if (soundUnlocked.current && audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch(() => {});
            }
          }
        });
      });
    });

    return () => unsubAuth();
  }, []);

  /* ---------------- ACTIONS ---------------- */

  async function acceptAlert(alert: AlertItem) {
    if (!auth.currentUser) return;

    await updateDoc(doc(db, "alerts", alert.id), {
      status: "accepted",
      acceptedBy: auth.currentUser.uid,
      acceptedAt: serverTimestamp(),
    });

    await addDoc(
      collection(db, "notifications", alert.requestedBy, "items"),
      {
        message: "🏥 Hospital accepted your emergency request",
        createdAt: serverTimestamp(),
      }
    );

    setPopupAlert(null);
  }

  async function rejectAlert(alertId: string) {
    await updateDoc(doc(db, "alerts", alertId), { status: "rejected" });
    setPopupAlert(null);
  }

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

  if (!hospital) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-red-50 px-5 py-5">

      {/* SIDEBAR */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} animate>
        <SidebarBody>
          <div className="flex flex-col gap-4 mt-6">
            {links.map((link) => (
              <SidebarLink key={link.label} link={link} />
            ))}
          </div>
        </SidebarBody>
      </Sidebar>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 space-y-8 relative">

        {/* 🚨 POPUP ALERT */}
        {popupAlert && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-96 animate-pulse">
              <h2 className="text-xl font-bold text-red-600 mb-2">
                🚨 Emergency Blood Required
              </h2>
              <p className="text-lg mb-4">
                Blood Group Needed:{" "}
                <span className="font-bold">
                  {popupAlert.bloodGroupNeeded}
                </span>
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => rejectAlert(popupAlert.id)}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Reject
                </button>
                <button
                  onClick={() => acceptAlert(popupAlert)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  Accept Now
                </button>
              </div>
            </div>
          </div>
        )}

        <h1 className="text-2xl font-bold text-green-700">
          🏥 {hospital.name}
        </h1>

        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold text-red-600 mb-4">
            🚨 Active Emergency Requests
          </h2>
          {alerts.length === 0 ? (
            <p>No active alerts</p>
          ) : (
            alerts.map((a) => (
              <p key={a.id}>
                Blood Needed: <b>{a.bloodGroupNeeded}</b>
              </p>
            ))
          )}
        </section>

        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">🩸 Blood Stock</h2>
          <div className="grid grid-cols-4 gap-4">
            {(Object.keys(stock) as BloodGroup[]).map((g) => (
              <input
                key={g}
                type="number"
                value={stock[g]}
                onChange={(e) =>
                  setStock({ ...stock, [g]: Number(e.target.value) })
                }
                className="border p-2 rounded"
              />
            ))}
          </div>
          <button
            onClick={saveStock}
            disabled={saving}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            Update Stock
          </button>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BloodStockChart stock={stock} />
          <RequestTrendChart />
        </section>
      </main>
    </div>
  );
}