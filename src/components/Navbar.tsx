// /components/Navbar.tsx
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
// import { auth } from "../lib/firebase";
// import { onAuthStateChanged, signOut, User } from "firebase/auth";

export default function Navbar() {
  //   const [user, setUser] = useState<User | null>(null);

  //   useEffect(() => {
  //     const unsub = onAuthStateChanged(auth, (u) => setUser(u));
  //     return () => unsub();
  //   }, []);

  //   async function handleLogout() {
  //     await signOut(auth);
  //     window.location.href = "/";
  //   }

  return (
    <header className="backdrop-blur-xl bg-white/70 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div
            className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-600 to-red-400 
                      flex items-center justify-center text-white font-extrabold 
                      shadow-lg transition-all duration-300 group-hover:scale-110 
                      group-hover:rotate-6"
          >
            RR
          </div>
          <Link
            href="/"
            className="font-bold text-xl tracking-wide transition-all duration-300 
                   group-hover:text-red-600 group-hover:tracking-wider"
          >
            Rapid Rescuers
          </Link>
        </div>

        <nav className="flex items-center gap-6">
          {/* Navigation Links */}
          {[
            { name: "Map", href: "/map" },
            { name: "SOS", href: "/emergency" },
            { name: "Donor", href: "/donor/dashboard" },
            { name: "Hospital", href: "/hospital/dashboard" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium relative text-gray-700 transition-all duration-300 
                 hover:text-red-600 after:content-[''] after:absolute after:w-0 
                 after:h-[2px] after:bg-red-600 after:-bottom-1 after:left-0 
                 after:transition-all after:duration-300 hover:after:w-full"
            >
              {item.name}
            </Link>
          ))}

          <Link
            href="/auth/signup"
            className="ml-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm 
                 shadow-md transition-all duration-300 
                 hover:bg-red-700 hover:shadow-lg hover:scale-105"
          >
            SignUp
          </Link>
          {/* ) : ( */}
          <Link
            href="/auth/login"
            className="ml-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm 
                 shadow-md transition-all duration-300 
                 hover:bg-red-700 hover:shadow-lg hover:scale-105"
          >
            Login
          </Link>
          {/* )} */}
        </nav>
      </div>
    </header>
  );
}
