"use client";

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

/* -------------------- CONSTANTS -------------------- */

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] as const;

type BloodGroup = (typeof BLOOD_GROUPS)[number];
type Role = "user" | "donor" | "hospital" | "admin";

type UserUpdatePayload = {
  role: Role;
  roleSelectedAt: Date;
  bloodGroup?: BloodGroup;
  availability?: boolean;
};

/* -------------------- COMPONENT -------------------- */

export default function SelectRolePage() {
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* -------------------- SAVE ROLE -------------------- */

  const saveRole = async () => {
    setError(null);

    const user = auth.currentUser;
    if (!user || !selectedRole) {
      setError("Authentication error. Please login again.");
      return;
    }

    // 🚫 Donor must select blood group
    if (selectedRole === "donor" && !bloodGroup) {
      setError("Blood group is required for donors.");
      return;
    }

    setLoading(true);

    try {
      const payload: UserUpdatePayload = {
        role: selectedRole,
        roleSelectedAt: new Date(),
      };

      if (selectedRole === "donor") {
        payload.bloodGroup = bloodGroup; // ✅ now type-safe
        payload.availability = false;
      }

      await updateDoc(doc(db, "users", user.uid), payload);

      // Dashboards handle routing by role
      router.replace("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to save role. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Select your role
        </h1>

        {/* Role Buttons */}
        <div className="space-y-3">
          {(["user", "donor", "hospital", "admin"] as Role[]).map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`w-full py-3 rounded-lg font-semibold transition
                ${
                  selectedRole === role
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {role.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Blood Group (Donor Only) */}
        {selectedRole === "donor" && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Blood Group
            </label>

            <select
              value={bloodGroup ?? ""}
              onChange={(e) =>
                setBloodGroup(
                  e.target.value
                    ? (e.target.value as BloodGroup)
                    : undefined
                )
              }
              className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-red-500"
            >
              <option value="">Choose blood group</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-sm text-red-600 mt-4 text-center">{error}</p>
        )}

        {/* Continue Button */}
        {selectedRole && (
          <button
            onClick={saveRole}
            disabled={loading}
            className="w-full mt-6 bg-red-600 text-white py-3 rounded-lg font-semibold
              hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Continue"}
          </button>
        )}
      </div>
    </div>
  );
}
