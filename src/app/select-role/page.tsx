"use client";

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export default function SelectRolePage() {
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [bloodGroup, setBloodGroup] = useState("");
  const [loading, setLoading] = useState(false);

  const saveRole = async () => {
    const user = auth.currentUser;
    if (!user || !selectedRole) return;

    // 🚫 Donor must select blood group
    if (selectedRole === "donor" && !bloodGroup) return;

    setLoading(true);

    const payload: any = { role: selectedRole };

    if (selectedRole === "donor") {
      payload.bloodGroup = bloodGroup;
      payload.availability = false;
    }

    await updateDoc(doc(db, "users", user.uid), payload);

    router.push(
      selectedRole === "user"
        ? "/dashboard"
        : selectedRole === "donor"
        ? "/donor/dashboard"
        : selectedRole === "hospital"
        ? "/hospital/dashboard"
        : "/admin/dashboard"
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Select your role
        </h1>

        {/* Role buttons */}
        <div className="space-y-3">
          {["user", "donor", "hospital", "admin"].map((role) => (
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

        {/* Blood Group Selector (ONLY for Donor) */}
        {selectedRole === "donor" && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Blood Group
            </label>

            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-red-500"
            >
              <option value="">Choose blood group</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>

            {!bloodGroup && (
              <p className="text-xs text-red-500 mt-1">
                Blood group is required for donors
              </p>
            )}
          </div>
        )}

        {/* Continue Button */}
        {selectedRole && (
          <button
            onClick={saveRole}
            disabled={loading || (selectedRole === "donor" && !bloodGroup)}
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
