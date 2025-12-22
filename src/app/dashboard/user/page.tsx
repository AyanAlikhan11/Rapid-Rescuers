"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  serverTimestamp,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { signOut } from "firebase/auth";

/* ================= TYPES ================= */

interface SOSRequest {
  id: string;
  bloodGroupNeeded: string;
  status: "open" | "accepted" | "rejected";
  city?: string;
}

/* ================= COMPONENT ================= */

export default function UserDashboard() {
  const router = useRouter();

  const [bloodGroup, setBloodGroup] = useState("O+");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<SOSRequest[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<SOSRequest[]>([]);

  const user = auth.currentUser;

  /* ================= FETCH USER REQUESTS ================= */

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "alerts"),
      where("requestedBy", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<SOSRequest, "id">),
      }));

      setRequests(data);
      setRecentAlerts(data.slice(0, 5));
    });

    return () => unsubscribe();
  }, [user]);

  /* ================= SUBMIT SOS ================= */

  const submitRequest = async () => {
    if (!city.trim()) {
      alert("Please enter city");
      return;
    }

    if (!user) {
      alert("User not authenticated");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "alerts"), {
        requestedBy: user.uid,
        bloodGroupNeeded: bloodGroup,
        city,
        status: "open",
        createdAt: serverTimestamp(),
      });

      setCity("");
      alert("🚨 SOS request sent successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to send SOS request");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOGOUT ================= */

  const logout = async () => {
    await signOut(auth);
    router.push("/auth/login");
  };

  /* ================= STATUS COLOR ================= */

  const statusColor = (status: SOSRequest["status"]) => {
    if (status === "accepted") return "text-green-600";
    if (status === "rejected") return "text-red-600";
    return "text-yellow-600";
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-white text-gray-900 flex">
      {/* ===== SIDEBAR ===== */}
      <aside className="w-64 hidden md:flex flex-col justify-between border-r border-red-100 p-6">
        <div>
          <h2 className="text-2xl font-bold text-red-600 mb-10">
            🩸 Rapid Rescuers
          </h2>

          <nav className="space-y-4 font-medium">
            {["Dashboard", "My Requests", "Nearby Donors", "Profile"].map(
              (item) => (
                <div
                  key={item}
                  className="cursor-pointer hover:text-red-600 transition"
                >
                  {item}
                </div>
              )
            )}
          </nav>
        </div>

        <button
          onClick={logout}
          className="text-sm text-red-600 hover:underline"
        >
          Logout
        </button>
      </aside>

      {/* ===== MAIN ===== */}
      <main className="flex-1 p-6 space-y-8">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">User Dashboard</h1>

          <button
            onClick={() => router.push("/emergency")}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl shadow transition"
          >
            🚨 SOS Emergency
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Stat title="Requests" value={requests.length} />
          <Stat title="Pending" value={requests.filter(r => r.status === "open").length} />
          <Stat title="Approved" value={requests.filter(r => r.status === "accepted").length} />
          <Stat title="Lives Impacted" value={requests.length * 2} />
        </div>

        {/* MAP */}
        <Card title="📍 Nearby Hospitals & Donors">
          <iframe
            className="w-full h-64 rounded-lg border"
            src="https://maps.google.com/maps?q=hospital&t=&z=13&ie=UTF8&iwloc=&output=embed"
          />
        </Card>

        {/* REQUEST FORM */}
        <Card title="🩸 Request Blood (SOS)">
          <div className="grid md:grid-cols-3 gap-4">
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="input-red"
            >
              {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(bg => (
                <option key={bg}>{bg}</option>
              ))}
            </select>

            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className="input-red"
            />

            <button
              onClick={submitRequest}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl transition"
            >
              {loading ? "Sending..." : "Send SOS"}
            </button>
          </div>
        </Card>

        {/* LIVE ALERTS */}
        <Card title="🔔 Your Recent SOS Requests">
          {recentAlerts.length === 0 && (
            <p className="text-sm text-gray-500">No requests yet</p>
          )}

          {recentAlerts.map((a) => (
            <div
              key={a.id}
              className="flex justify-between text-sm py-2 border-b border-red-100"
            >
              <span>
                🩸 {a.bloodGroupNeeded} — {a.city}
              </span>
              <span className={statusColor(a.status)}>
                {a.status.toUpperCase()}
              </span>
            </div>
          ))}
        </Card>

        {/* EMERGENCY TIPS */}
        <div className="bg-red-50 border border-red-100 p-6 rounded-2xl">
          <h2 className="font-semibold mb-2 text-red-600">
            🚑 Emergency Tips
          </h2>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Stay calm & keep patient hydrated</li>
            <li>Carry blood group report</li>
            <li>Reach nearest hospital immediately</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

/* ================= UI COMPONENTS ================= */

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white border border-red-100 p-6 rounded-2xl shadow hover:shadow-lg transition">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-red-600">{value}</p>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-red-100 p-6 rounded-2xl shadow">
      <h2 className="font-semibold mb-4 text-red-600">{title}</h2>
      {children}
    </div>
  );
}
