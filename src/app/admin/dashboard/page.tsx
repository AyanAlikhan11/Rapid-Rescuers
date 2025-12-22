"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { signOut } from "firebase/auth";

/* ================= TYPES ================= */

type UserRole = "user" | "donor" | "hospital" | "admin";
type RoleFilter = UserRole | "all";

interface AppUser {
  id: string;
  email?: string;
  role: UserRole;
}

interface Alert {
  id: string;
  bloodGroupNeeded: string;
  city?: string;
  status: string;
}

/* ================= COMPONENT ================= */

export default function AdminDashboard() {
  const router = useRouter();

  const [users, setUsers] = useState<AppUser[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");

  /* ================= FETCH USERS ================= */

  useEffect(() => {
    const q = query(collection(db, "users"), where("role", "!=", null));

    return onSnapshot(q, (snap) => {
      const list: AppUser[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<AppUser, "id">),
      }));
      setUsers(list);
    });
  }, []);

  /* ================= FETCH ALERTS ================= */

  useEffect(() => {
    return onSnapshot(collection(db, "alerts"), (snap) => {
      const list: Alert[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Alert, "id">),
      }));
      setAlerts(list);
    });
  }, []);

  /* ================= FILTER USERS ================= */

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.id.includes(search);

      const matchRole =
        roleFilter === "all" ? true : u.role === roleFilter;

      return matchSearch && matchRole;
    });
  }, [users, search, roleFilter]);

  /* ================= UPDATE ROLE ================= */

  const updateRole = async (uid: string, role: UserRole) => {
    await updateDoc(doc(db, "users", uid), { role });
    alert("Role updated successfully ✅");
  };

  /* ================= LOGOUT ================= */

  const logout = async () => {
    await signOut(auth);
    router.push("/auth/login");
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-white text-gray-700">
      {/* HEADER */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-red-100">
        <h1 className="text-2xl font-bold text-red-600">
          🛡️ Admin Dashboard
        </h1>

        <button
          onClick={logout}
          className="px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition shadow"
        >
          Logout
        </button>
      </header>

      {/* MAIN */}
      <main className="p-6 space-y-10">
        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Stat title="Total Users" value={users.length} />
          <Stat title="Donors" value={users.filter(u => u.role === "donor").length} />
          <Stat title="Hospitals" value={users.filter(u => u.role === "hospital").length} />
          <Stat title="SOS Alerts" value={alerts.length} />
        </div>

        {/* USER MANAGEMENT */}
        <section className="bg-white border border-red-200 rounded-2xl p-6 shadow">
          <h2 className="text-lg font-semibold text-red-600 mb-4">
            👥 User Role Management
          </h2>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email or UID"
              className="input-red ring-red-200"
            />

            <select
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(e.target.value as RoleFilter)
              }
              className="input-red"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="donor">Donor</option>
              <option value="hospital">Hospital</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="space-y-2 max-h-[420px] overflow-y-auto">
            {filteredUsers.length === 0 && (
              <p className="text-sm text-gray-500">
                No users found
              </p>
            )}

            {filteredUsers.map((u) => (
              <div
                key={u.id}
                className="flex justify-between items-center border-b border-red-100 py-3"
              >
                <div className="text-sm break-all">
                  {u.email || u.id}
                </div>

                <select
                  value={u.role}
                  onChange={(e) =>
                    updateRole(u.id, e.target.value as UserRole)
                  }
                  className="px-3 py-1 rounded-lg border border-red-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="user">User</option>
                  <option value="donor">Donor</option>
                  <option value="hospital">Hospital</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            ))}
          </div>
        </section>

        {/* ALERTS */}
        <section className="bg-white border border-red-100 rounded-2xl p-6 shadow">
          <h2 className="font-semibold text-red-600 mb-4">
            🚨 Live SOS Alerts
          </h2>

          {alerts.slice(0, 5).map((a) => (
            <div
              key={a.id}
              className="flex justify-between text-sm border-b border-red-100 py-2"
            >
              <span>
                🩸 {a.bloodGroupNeeded} | {a.city}
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-red-50 text-red-600 font-medium">
                {a.status}
              </span>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white border border-red-100 rounded-2xl p-6 shadow hover:shadow-lg transition">
      <p className="text-sm text-gray-500">
        {title}
      </p>
      <p className="text-2xl font-bold text-red-600">
        {value}
      </p>
    </div>
  );
}
