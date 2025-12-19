"use client";

import Link from "next/link";
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
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      if (!auth.currentUser) {
        router.push("/auth/login");
        return;
      }

      try {
        const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (!snap.exists()) {
          router.push("/auth/login");
          return;
        }
        setUser(snap.data() as AppUser);
      } catch (err) {
        console.error("Error fetching user:", err);
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [router]);

  if (loading) return <p className="p-8">Loading...</p>;
  if (!user) return null;

  // Navigation handler
  const handleCardClick = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      {/* Logo + Logout */}
      <div className="flex items-center justify-between mb-8 mt-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl 
            bg-gradient-to-br from-red-600 to-red-400 
            flex items-center justify-center text-white font-extrabold shadow-lg 
            transition-transform duration-300 transform 
            hover:scale-125 hover:rotate-12 hover:shadow-2xl">
            RR
          </div>
          <span className="font-bold text-lg sm:text-xl transition-colors duration-300 group-hover:text-red-700">
            Rapid Rescuers
          </span>
        </Link>

        <button
          onClick={async () => {
            await signOut(auth);
            router.push("/auth/login");
          }}
          className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition"
        >
          Logout
        </button>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Welcome 👋
        </h1>
        <p className="text-gray-500 mt-1">Rapid Rescuers Dashboard</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow p-5 sm:p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium text-gray-800 break-all">{user.email}</p>
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
          onClick={() => handleCardClick("/search")}
        />
        <DashboardCard
          title="Nearby Hospitals"
          desc="View hospitals around your location with emergency facilities."
          btn="View Hospitals"
          onClick={() => handleCardClick("/hospitals")}
        />
        <DashboardCard
          title="Donor Network"
          desc="Access verified donors available in your area."
          btn="View Donors"
          onClick={() => handleCardClick("/donors")}
        />
      </div>

      {/* Role-based info */}
      {user.role === "user" && (
        <div className="mt-10 bg-red-50 border border-red-100 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-red-700 mb-2">User Access</h3>
          <p className="text-sm text-red-600">
            You can search donors, hospitals, and request emergency help.
          </p>
        </div>
      )}

      {user.role === "donor" && (
        <div className="mt-10 bg-green-50 border border-green-100 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-green-700 mb-2">Donor Access</h3>
          <p className="text-sm text-green-600">
            You can manage your donations and respond to emergency requests.
          </p>
        </div>
      )}

      {user.role === "hospital" && (
        <div className="mt-10 bg-blue-50 border border-blue-100 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">Hospital Access</h3>
          <p className="text-sm text-blue-600">
            You can manage hospital records, beds, and emergency cases.
          </p>
        </div>
      )}

      {user.role === "admin" && (
        <div className="mt-10 bg-gray-50 border border-gray-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Admin Access</h3>
          <p className="text-sm text-gray-600">You can manage users, donors, and hospitals.</p>
        </div>
      )}
    </div>
  );
}
