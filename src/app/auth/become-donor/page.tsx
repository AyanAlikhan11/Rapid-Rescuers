"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { HeartIcon } from "@heroicons/react/24/outline";
import { doc, setDoc } from "firebase/firestore";


export default function BecomeDonorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    bloodGroup: "",
    location: "",
    agree: false,
  });

  // ✅ Handle input & checkbox properly
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setForm((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!form.agree) {
    alert("Please agree to the terms and conditions.");
    return;
  }

  try {
    setLoading(true);

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      form.email,
      form.password
    );

    await setDoc(doc(db, "users", userCredential.user.uid), {
  uid: userCredential.user.uid,
  name: `${form.firstName} ${form.lastName}`,
  email: form.email,
  bloodGroup: form.bloodGroup,
  location: form.location,
  role: "donor",
  availability: true,
  createdAt: serverTimestamp(),
});

// 🚀 Redirect to EXACT dashboard route
router.push("/dashboard/donor");

  } catch (error: unknown) {
    if (error instanceof Error) {
      alert(error.message);
    } else {
      alert("Something went wrong. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-red-10 to-red-50 py-24 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md rounded-xl shadow-lg p-8"
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <HeartIcon className="w-6 h-6 text-red-500" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-center mb-1 text-red-700">
          Become a Lifesaver
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Join our community of donors and make a difference.
        </p>

        {/* First & Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">First Name</label>
            <input
              name="firstName"
              required
              value={form.firstName}
              onChange={handleChange}
              className="input"
              placeholder="John"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Last Name</label>
            <input
              name="lastName"
              required
              value={form.lastName}
              onChange={handleChange}
              className="input"
              placeholder="Doe"
            />
          </div>
        </div>

        {/* Email */}
        <div className="mt-4">
          <label className="text-sm font-medium">Email Address</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="input"
            placeholder="you@example.com"
          />
        </div>

        {/* Blood Group */}
        <div className="mt-4">
          <label className="text-sm font-medium">Blood Group</label>
          <select
            name="bloodGroup"
            required
            value={form.bloodGroup}
            onChange={handleChange}
            className="input"
          >
            <option value="">Select your blood group</option>
            {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div className="mt-4">
          <label className="text-sm font-medium">Location</label>
          <input
            name="location"
            required
            value={form.location}
            onChange={handleChange}
            className="input"
            placeholder="City, State"
          />
        </div>

        {/* Password */}
        <div className="mt-4">
          <label className="text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            required
            value={form.password}
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* Checkbox */}
        <div className="flex items-center gap-2 mt-4 text-sm">
          <input
            type="checkbox"
            name="agree"
            checked={form.agree}
            onChange={handleChange}
            className="accent-red-600 cursor-pointer"
          />
          <span>
            I agree to the{" "}
            <span className="text-red-600 underline cursor-pointer">
              terms and conditions
            </span>
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !form.agree}
          className="mt-6 w-full bg-red-600 disabled:bg-gray-300 text-white py-3 rounded-md transition"
        >
          {loading ? "Creating Account..." : "Create My Donor Account"}
        </button>
      </form>

      {/* Input Styling */}
      <style jsx>{`
        .input {
          width: 100%;
          margin-top: 4px;
          padding: 10px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          outline: none;
        }
        .input:focus {
          border-color: #ef4444;
          box-shadow: 0 0 0 1px #ef4444;
        }
      `}</style>
    </section>
  );
}
