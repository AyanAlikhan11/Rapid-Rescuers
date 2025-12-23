"use client";

import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import FloatingBloodCells from "./FloatingBloodCells";


// import Snowfall from "react-snowfall";


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
      router.push("/auth/become-donor");
    } else {
      router.push("/dashboard/donor");
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-red-50 py-24 px-4">
        {/* <Snowfall color="red"/> */}
       <FloatingBloodCells/>
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
      </div>
    </section>
  );
}

