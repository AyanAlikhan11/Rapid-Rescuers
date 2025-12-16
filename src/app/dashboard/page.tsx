"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import DashboardCard from "@/components/DashboardCard";
import { signOut } from "firebase/auth";



type UserRole = "user" | "donor" | "hospital" | "admin";

interface AppUser {
  uid: string;
  email: string;
  role: UserRole;
}

export default function Dashboard() {
  const [user, setUser] = useState<AppUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      if (!auth.currentUser) {
        router.push("/auth/login");
        return;
      }

      const snap = await getDoc(
        doc(db, "users", auth.currentUser.uid)
      );

      if (!snap.exists()) {
        router.push("/auth/login");
        return;
      }

      setUser(snap.data() as AppUser);
    };

    loadUser();
  }, [router]);

  if (!user) {
    return <p className="p-8">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">

  {/* Top Header */}
  <div className="flex items-center justify-between mb-8">
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
        Welcome 👋
      </h1>
      <p className="text-gray-500 mt-1">
        Rapid Rescuers Dashboard
      </p>
    </div>

    {/* Logout Button */}
    <button
      onClick={async () => {
        await signOut(auth);
        window.location.href = "/auth/login";
      }}
      className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition"
    >
      Logout
    </button>
  </div>

  {/* Profile Card */}
  <div className="bg-white rounded-2xl shadow p-5 sm:p-6 mb-8">
    <h2 className="text-lg font-semibold text-gray-800 mb-4">
      Your Profile
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
      <div>
        <p className="text-gray-500">Email</p>
        <p className="font-medium text-gray-800 break-all">
          {user.email}
        </p>
      </div>

      <div>
        <p className="text-gray-500">Role</p>
        <span className="inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-600">
          {user.role.toUpperCase()}
        </span>
      </div>
    </div>
  </div>

  {/* Action Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
    <DashboardCard
      title="Find Help Fast"
      desc="Search nearby donors and hospitals in emergency situations."
      btn="Search Now"
    />
    <DashboardCard
      title="Nearby Hospitals"
      desc="View hospitals around your location with emergency facilities."
      btn="View Hospitals"
    />
    <DashboardCard
      title="Donor Network"
      desc="Access verified donors available in your area."
      btn="View Donors"
    />
  </div>

  {/* Role-based info */}
  {user.role === "user" && (
    <div className="mt-10 bg-red-50 border border-red-100 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-red-700 mb-2">
        User Access
      </h3>
      <p className="text-sm text-red-600">
        You can search donors, hospitals, and request emergency help.
      </p>
    </div>
  )}
</div>


  );
}
