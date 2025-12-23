"use client";

import { useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

type UserRole = "user" | "donor" | "hospital" | "admin";

interface AppUser {
  uid: string;
  email: string;
  role: UserRole;
}

export default function DashboardRouter() {
  const router = useRouter();

  useEffect(() => {
    const redirectUser = async () => {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        router.replace("/auth/login");
        return;
      }

      const snap = await getDoc(doc(db, "users", currentUser.uid));

      if (!snap.exists()) {
        router.replace("/auth/login");
        return;
      }

      const userData = snap.data() as AppUser;

      switch (userData.role) {
        case "user":
          router.replace("/dashboard/user");
          break;

        case "donor":
          router.replace("/dashboard/donor");
          break;

        case "hospital":
          router.replace("/dashboard/hospital");
          break;

        case "admin":
          router.replace("/admin/dashboard");
          break;

        default:
          router.replace("/auth/login");
      }
    };

    redirectUser();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <p className="text-gray-500">Redirecting to your dashboard...</p>
    </div>
  );
}
