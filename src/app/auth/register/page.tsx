// /app/auth/register/page.tsx
"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", bloodGroup: "O+", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const uid = cred.user.uid;

      let loc = null;
      if ("geolocation" in navigator) {
        const p = await new Promise<{ lat: number; lng: number }>((res, rej) =>
          navigator.geolocation.getCurrentPosition((pos) => res({ lat: pos.coords.latitude, lng: pos.coords.longitude }), rej)
        );
        loc = p;
      }

      await setDoc(doc(db, "users", uid), {
        uid,
        name: form.name,
        phone: form.phone,
        email: form.email,
        role: "donor",
        bloodGroup: form.bloodGroup,
        lastDonation: serverTimestamp(),
        availability: false,
        location: loc,
        createdAt: serverTimestamp(),
      });

      alert("Registered! Redirecting to donor dashboard.");
      router.push("/donor/dashboard");
    } catch (err: any) {
      console.error(err);
      alert("Error: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-start justify-center px-4 sm:px-6">
  <div className="w-full max-w-md bg-white p-5 sm:p-6 rounded-xl shadow-lg mt-16 sm:mt-20">
    
    <h2 className="text-xl sm:text-2xl font-semibold text-black mb-4 text-center">
      Become a Donor
    </h2>

    <form onSubmit={handleSubmit} className="space-y-3 text-black">
      
      <input
        required
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full border p-3 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500"
      />

      <input
        required
        placeholder="Phone"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        className="w-full border p-3 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500"
      />

      <input
        required
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full border p-3 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500"
      />

      <select
        value={form.bloodGroup}
        onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
        className="w-full border p-3 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(b => (
          <option key={b}>{b}</option>
        ))}
      </select>

      <input
        required
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="w-full border p-3 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500"
      />

      <button
        disabled={loading}
        className="w-full py-3 bg-red-600 text-white rounded-lg text-sm sm:text-base font-medium hover:bg-red-700 transition disabled:opacity-60"
      >
        {loading ? "Registering..." : "Register"}
      </button>

    </form>
  </div>
</div>

  );
}
