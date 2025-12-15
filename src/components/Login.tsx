"use client";

import Link from "next/link";
import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError(""); // reset first

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
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white w-1/3 flex justify-center items-center flex-col py-10 rounded-2xl shadow-md">
        
        <div className="py-5 text-left">
          <p className="text-gray-300 text-sm">Login Here</p>
          <h1 className="text-4xl">Login</h1>
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <div className="w-full px-5 flex gap-4 flex-col py-2">

          {/* Email */}
          <input
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            value={formData.email}
            className="w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100 py-2 px-2 rounded-md"
            type="email"
            placeholder="email"
          />

          {/* Password */}
          <input
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            value={formData.password}
            className="w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100 py-2 px-2 rounded-md"
            type="password"
            placeholder="password"
          />

          {/* Button */}
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white w-full py-2 px-2 rounded-md cursor-pointer"
          >
            Login
          </button>

          {/* Link */}
          <p className="text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link href="/" className="text-blue-600 cursor-pointer">
              Signup
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;
