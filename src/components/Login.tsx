"use client";

import Link from "next/link";
import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    try {
      const res = await axios.post("/api/login", formData);
      if (res.status === 200) {
        setError("Login successful!");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-red-600">Rapid Rescuers</h1>
          <p className="text-gray-500 text-sm mt-1">
            Login to save lives faster
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg bg-gray-100 focus:ring-2 focus:ring-red-400 focus:outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg bg-gray-100 focus:ring-2 focus:ring-red-400 focus:outline-none"
          />

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
          >
            Login
          </button>
        </div>

        {/* Footer */}
        <p className="text-sm text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link href="/auth/signup" className="text-red-600 font-medium hover:underline">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}
