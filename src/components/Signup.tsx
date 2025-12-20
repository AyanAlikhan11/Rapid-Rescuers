"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db, googleProvider } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    role: "user",
    bloodGroup: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setError("");
    
    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!form.email || !form.password || !form.confirm) {
      setError("All fields are required");
      return;
    }

    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }

    // ✅ Donor blood group validation
    if (form.role === "donor" && !form.bloodGroup) {
      setError("Please select your blood group");
      return;
    }

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const uid = cred.user.uid;

      await setDoc(doc(db, "users", uid), {
        uid,
        email: form.email,
        role: form.role,
        bloodGroup: form.role === "donor" ? form.bloodGroup : null,
        createdAt: serverTimestamp(),
      });

      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userRef = doc(db, "users", user.uid);

      await setDoc(
        userRef,
        {
          uid: user.uid,
          name: user.displayName ?? "",
          email: user.email ?? "",
          role: null,
          provider: "google",
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        },
        { merge: true }
      );

      router.push("/select-role");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Google signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-red-600">Rapid Rescuers</h1>
          <p className="text-gray-500 text-sm mt-1">
            Join the life-saving network
          </p>
        </div>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <div className="space-y-3">
          <input
            type="text"
            placeholder={
              form.role === "hospital" ? "Hospital Name" : "Username"
            }
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-gray-100
             focus:ring-2 focus:ring-red-400 focus:outline-none"
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-gray-100 focus:ring-2 focus:ring-red-400 focus:outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-gray-100 focus:ring-2 focus:ring-red-400 focus:outline-none"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-gray-100 focus:ring-2 focus:ring-red-400 focus:outline-none"
          />

          {/* Role Select */}
          <select
            value={form.role}
            onChange={(e) =>
              setForm({
                ...form,
                role: e.target.value,
                bloodGroup: e.target.value === "donor" ? form.bloodGroup : "",
              })
            }
            className="w-full px-4 py-3 rounded-lg bg-gray-100 focus:ring-2 focus:ring-red-400 focus:outline-none"
          >
            <option value="user">User</option>
            <option value="donor">Donor</option>
            <option value="hospital">Hospital</option>
            <option value="admin">Admin</option>
          </select>

          {/* ✅ Blood Group (Donor Only) */}
          {form.role === "donor" && (
            <select
              value={form.bloodGroup}
              onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-gray-100 focus:ring-2 focus:ring-red-400 focus:outline-none"
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Creating..." : "Signup"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-400 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Google Signup */}
          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-xl transition ${
              loading
                ? "opacity-60 cursor-not-allowed"
                : "hover:bg-gray-50 cursor-pointer"
            }`}
          >
            <Image src="/google.svg" alt="Google" width={20} height={20} />
            <span className="font-medium text-gray-700">
              Signup with Google
            </span>
          </button>
        </div>

        {/* Footer */}
        <p className="text-sm text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-red-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
