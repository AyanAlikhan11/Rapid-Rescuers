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

type RequestStatus = "Pending" | "Approved" | "Rejected";

interface SOSRequest {
  id: string;
  bloodGroupNeeded: string;
  status: "open" | "accepted" | "rejected";
  acceptedByRole?: "hospital" | "donor" | null;
}

/* ================= COMPONENT ================= */

export default function UserDashboard() {
  const router = useRouter();

  const [bloodGroup, setBloodGroup] = useState("O+");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<SOSRequest[]>([]);

  const user = auth.currentUser;

  /* ================= FETCH SOS REQUESTS ================= */

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "alerts"),
      where("requestedBy", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveRequests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<SOSRequest, "id">),
      }));

      setRequests(liveRequests);
    });

    return () => unsubscribe();
  }, [user]);

  /* ================= SUBMIT REQUEST ================= */

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
        acceptedBy: null,
        acceptedByRole: null,
        createdAt: serverTimestamp(),
      });

      alert("SOS request sent successfully 🚨");
      setCity("");
    } catch (error) {
      console.error(error);
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

  /* ================= STATUS FORMATTER ================= */

  function formatStatus(req: SOSRequest): {
    label: RequestStatus;
    className: string;
  } {
    if (req.status === "accepted") {
      return {
        label: "Approved",
        className: "bg-green-100 text-green-700",
      };
    }

    if (req.status === "rejected") {
      return {
        label: "Rejected",
        className: "bg-red-100 text-red-700",
      };
    }

    return {
      label: "Pending",
      className: "bg-yellow-100 text-yellow-700",
    };
  }

  /* ================= UI ================= */

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* ===== SIDEBAR ===== */}
      <aside className="w-64 bg-white shadow-lg p-6 hidden md:block">
        <h2 className="text-2xl font-bold text-red-500 mb-10">
          Rapid Rescuers
        </h2>

        <ul className="space-y-4 font-medium">
          <li className="hover:text-red-500 cursor-pointer">Dashboard</li>
          <li className="hover:text-red-500 cursor-pointer">My Requests</li>
          <li className="hover:text-red-500 cursor-pointer">Nearby Donors</li>
          <li className="hover:text-red-500 cursor-pointer">Profile</li>
          <li
            onClick={logout}
            className="text-red-500 cursor-pointer hover:underline"
          >
            Logout
          </li>
        </ul>
      </aside>

      {/* ===== MAIN ===== */}
      <main className="flex-1 p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">User Dashboard</h1>

          <button
            onClick={() => router.push("/emergency")}
            className="bg-red-500 text-white px-6 py-2 rounded-xl animate-pulse hover:bg-red-600 transition"
          >
            🚨 SOS Emergency
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <StatCard title="My Requests" value={requests.length} />
          <StatCard
            title="Pending"
            value={requests.filter((r) => r.status === "open").length}
          />
          <StatCard
            title="Approved"
            value={requests.filter((r) => r.status === "accepted").length}
          />
          <StatCard title="Lives Impacted" value={requests.length * 2} />
        </div>

        {/* REQUEST FORM */}
        <div className="bg-white p-6 rounded-xl shadow mb-10">
          <h2 className="text-xl font-semibold mb-4">
            Request Blood (SOS)
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="p-3 border rounded focus:ring-2 focus:ring-red-400"
            >
              {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map((bg) => (
                <option key={bg}>{bg}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="p-3 border rounded focus:ring-2 focus:ring-red-400"
            />

            <button
              onClick={submitRequest}
              disabled={loading}
              className="bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              {loading ? "Sending..." : "Send SOS"}
            </button>
          </div>
        </div>

        {/* REQUEST TABLE */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">
            My SOS Requests
          </h2>

          {requests.length === 0 ? (
            <p className="text-gray-500">No SOS requests found</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Blood Group</th>
                  <th>Status</th>
                  <th>Accepted By</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => {
                  const status = formatStatus(req);
                  return (
                    <tr
                      key={req.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="py-2">{req.bloodGroupNeeded}</td>
                      <td>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="text-sm text-gray-600">
                        {req.acceptedByRole
                          ? req.acceptedByRole
                          : "--"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

/* ================= SMALL COMPONENT ================= */

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:-translate-y-1 hover:shadow-lg transition-all">
      <p className="text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-red-500">{value}</p>
    </div>
  );
}
