"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { onSnapshot } from "firebase/firestore";


/* ================= TYPES ================= */

type RequestStatus = "Pending" | "Approved" | "Rejected";

interface BloodRequest {
  id: string;
  bloodGroup: string;
  city: string;
  status: RequestStatus;
  createdAt?: unknown; // Firestore Timestamp
}

/* ================= COMPONENT ================= */

export default function UserDashboard() {
  const router = useRouter();

  const [bloodGroup, setBloodGroup] = useState<string>("O+");
  const [city, setCity] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [requests, setRequests] = useState<BloodRequest[]>([]);

  const user = auth.currentUser;

  /* ================= FETCH REQUESTS ================= */

  useEffect(() => {
  if (!user) return;

  const q = query(
    collection(db, "bloodRequests"),
    where("userId", "==", user.uid)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const liveRequests: BloodRequest[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<BloodRequest, "id">),
    }));

    setRequests(liveRequests);
  });

  // cleanup listener
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

      await addDoc(collection(db, "bloodRequests"), {
        userId: user.uid,
        bloodGroup,
        city,
        status: "Pending",
        createdAt: serverTimestamp(),
      });

      alert("Blood request submitted successfully");
      setCity("");
    } catch (error) {
      console.error(error);
      alert("Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOGOUT ================= */

  const logout = async () => {
    await signOut(auth);
    router.push("/auth/login");
  };

  /* ================= UI ================= */

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* ===== SIDEBAR ===== */}
      <aside className="w-64 bg-white shadow-lg p-6 hidden md:block">
        <h2 className="text-2xl font-bold text-red-500 mb-10">
          Rapid Rescuers
        </h2>

        <ul className="space-y-4 font-medium">
          <li className="hover:text-red-500 cursor-pointer transition">
            Dashboard
          </li>
          <li className="hover:text-red-500 cursor-pointer transition">
            My Requests
          </li>
          <li className="hover:text-red-500 cursor-pointer transition">
            Nearby Donors
          </li>
          <li className="hover:text-red-500 cursor-pointer transition">
            Profile
          </li>
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
            value={requests.filter((r) => r.status === "Pending").length}
          />
          <StatCard
            title="Approved"
            value={requests.filter((r) => r.status === "Approved").length}
          />
          <StatCard title="Lives Impacted" value={requests.length * 2} />
        </div>

        {/* REQUEST FORM */}
        <div className="bg-white p-6 rounded-xl shadow mb-10">
          <h2 className="text-xl font-semibold mb-4">
            Request Blood
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="p-3 border rounded focus:ring-2 focus:ring-red-400"
            >
              {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                (bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                )
              )}
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
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </div>

        {/* REQUEST TABLE */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">
            My Requests
          </h2>

          {requests.length === 0 ? (
            <p className="text-gray-500">No requests found</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Blood Group</th>
                  <th>City</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr
                    key={req.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-2">{req.bloodGroup}</td>
                    <td>{req.city}</td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          req.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : req.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

/* ================= SMALL COMPONENT ================= */

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:-translate-y-1 hover:shadow-lg transition-all">
      <p className="text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-red-500">{value}</p>
    </div>
  );
}
