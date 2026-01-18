"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db, googleProvider } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

/* 🔁 CENTRAL ROLE → DASHBOARD ROUTES */
const ROLE_ROUTES: Record<string, string> = {
  user: "/dashboard/user",
  donor: "/dashboard/donor",
  hospital: "/dashboard/hospital",
  admin: "/admin/dashboard",
};

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const router = useRouter();

  /* =======================
     EMAIL / PASSWORD LOGIN
     ======================= */
  const handleEmailLogin = async () => {
    setError("");
    setMessage("");

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const userRef = doc(db, "users", cred.user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        throw new Error("User profile not found");
      }

      await setDoc(
        userRef,
        { lastLogin: serverTimestamp() },
        { merge: true }
      );

      const data = snap.data();
      const role = typeof data?.role === "string" ? data.role : null;

      if (!role) {
        router.push("/select-role");
      } else {
        router.push(ROLE_ROUTES[role] || "/dashboard");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /*GOOGLE LOGIN*/
  const handleGoogleLogin = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName ?? "",
          email: user.email ?? "",
          role: null,
          provider: "google",
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        });

        router.push("/select-role");
        return;
      }

      await setDoc(
        userRef,
        { lastLogin: serverTimestamp() },
        { merge: true }
      );

      const data = snap.data();
      const role = typeof data?.role === "string" ? data.role : null;

      if (!role) {
        router.push("/select-role");
      } else {
        router.push(ROLE_ROUTES[role] || "/dashboard");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  /* FORGOT PASSWORD */
  const handleForgotPassword = async () => {
    setError("");
    setMessage("");

    if (!formData.email) {
      setError("Please enter your email to reset password");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, formData.email);
      setMessage("Password reset link sent to your email");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send reset email"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-white to-red-50 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-red-600 text-white text-xl font-bold">
            RR
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mt-4">
            Welcome Back
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Login to Rapid Rescuers
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Success Message */}
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-lg mb-4">
            {message}
          </div>
        )}

        {/* Email Login */}
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-red-500 focus:outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-red-500 focus:outline-none"
          />

          {/* Forgot Password */}
          <div className="text-right">
            <button
              onClick={handleForgotPassword}
              className="text-sm text-red-600 hover:underline"
              type="button"
            >
              Forgot password?
            </button>
          </div>

          <button
            onClick={handleEmailLogin}
            disabled={loading}
            className={`w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition
              ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-xl transition
            ${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-50"}`}
        >
          <Image src="/google.svg" alt="Google" width={20} height={20} />
          <span className="font-medium text-gray-700">
            Continue with Google
          </span>
        </button>

        {/* Footer */}
        <p className="text-sm text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-red-600 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
