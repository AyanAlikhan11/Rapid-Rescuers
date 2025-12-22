"use client";

import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import Snowfall from "react-snowfall";

export default function HeroSection() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleFindBlood = () => {
    if (!loggedIn) {
      router.push("/auth/login");
    } else {
      router.push("/map");
    }
  };

  const handleBecomeDonor = () => {
    if (!loggedIn) {
      router.push("/auth/signup");
    } else {
      router.push("/donor/dashboard");
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-red-50 py-24 px-4">
        <Snowfall color="red"/>
      {/* Decorative blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-200/40 rounded-full blur-3xl" />
      <div className="absolute top-20 -right-24 w-96 h-96 bg-red-300/30 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight
          bg-gradient-to-r from-red-600 to-red-400 text-transparent bg-clip-text">
          Find Blood • Save Lives
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Real-time blood availability, verified donors, and the fastest way
          to save lives during emergencies.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-14">

          <button
            onClick={handleFindBlood}
            className="px-10 py-4 rounded-xl bg-red-600 text-white font-semibold shadow-lg
              transition-all duration-300 hover:bg-red-700 hover:shadow-xl
              hover:scale-105 active:scale-95"
          >
            🔍 Find Blood Now
          </button>

          <button
            onClick={handleBecomeDonor}
            className="px-10 py-4 rounded-xl border border-red-600 text-red-600 font-semibold
              transition-all duration-300 hover:bg-red-50 hover:shadow-md
              hover:scale-105 active:scale-95"
          >
            🩸 Become a Donor
          </button>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <Stat title="Donors" value="5,000+" />
          <Stat title="Hospitals" value="120+" />
          <Stat title="Lives Saved" value="15,000+" />
          <Stat title="Cities" value="40+" />
        </div>
        
        {/* HOW IT WORKS */}
      <section className="py-20  text-center mt-2">
        <h2 className="text-3xl font-bold mb-12">How Rapid Rescuers Works</h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto px-6">
          {[
            ["📝 Request Blood", "Submit an emergency blood request in seconds"],
            ["📍 Get Matched", "Nearby donors & hospitals are instantly notified"],
            ["❤️ Save Lives", "Fast response helps save precious lives"],
          ].map(([title, desc]) => (
            <div
              key={title}
              className="p-8 rounded-2xl bg-red-50 hover:bg-red-100 transition-all duration-300 hover:scale-105"
            >
              <h3 className="font-semibold text-xl mb-2">{title}</h3>
              <p className="text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-red-50 text-center">
        <h2 className="text-3xl font-bold mb-10">What People Say</h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto px-6">
          {[
            ["Ayan", "This platform helped us find blood in 10 minutes."],
            ["Hospital Admin", "Extremely reliable in emergencies."],
            ["Volunteer", "Easy to use and impactful."],
          ].map(([name, text]) => (
            <div
              key={name}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <p className="italic text-gray-600 mb-3">“{text}”</p>
              <p className="font-semibold">{name}</p>
            </div>
          ))}
        </div>
      </section>

        {/* Trust line */}
        <p className="mt-10 text-sm text-gray-500">
          Trusted by hospitals, NGOs, and volunteers across India 🇮🇳
        </p>
      </div>
    </section>
  );
}

/* Small stat card */
function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold text-red-600">{value}</p>
    </div>
  );
}
