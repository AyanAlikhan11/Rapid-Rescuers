"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import DarkModeToggle from "./DarkModeToggle";


type UserRole = "user" | "donor" | "hospital" | "admin" | null;

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);

      if (u) {
        const snap = await getDoc(doc(db, "users", u.uid));
        if (snap.exists()) {
          setRole(snap.data().role);
        }
      } else {
        setRole(null);
      }
    });

    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const handleProtectedNav = (path: string) => {
    if (!user) {
      router.push("/auth/login");
    } else {
      router.push(path);
    }
  };

  return (
    <header className="backdrop-blur-xl bg-white/70 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-red-600 to-red-400 
              flex items-center justify-center text-white font-extrabold shadow-lg 
              transition group-hover:scale-110 group-hover:rotate-6">
            RR
          </div>
          <span className="font-bold text-lg sm:text-xl group-hover:text-red-600">
            Rapid Rescuers
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/map" className="nav-link">Map</Link>
          <Link href="/emergency" className="nav-link">SOS</Link>

          <button onClick={() => handleProtectedNav("/donor")} className="nav-link">
            Donor
          </button>
          <button onClick={() => handleProtectedNav("/hospital")} className="nav-link">
            Hospital
          </button>
          

          {!user ? (
            <>
              <Link href="/auth/signup" className="btn-primary">Sign Up</Link>
              <Link href="/auth/login" className="btn-primary">Login</Link>
            </>
          ) : (
            <>
              <Link
                href={
                  role === "donor"
                    ? "/dashboard/donor"
                    : role === "hospital"
                    ? "/dashboard/hospital"
                    : role === "admin"
                    ? "/admin/dashboard"
                    : "/dashboard"
                }
                className="btn-outline"
              >
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-danger">
                Logout
              </button>
              
            </>
            
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-red-50"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-t shadow-lg">
          <nav className="flex flex-col p-4 gap-4">

            <Link href="/map" className="nav-link" onClick={() => setMenuOpen(false)}>
              Map
            </Link>

            <Link href="/emergency" className="nav-link" onClick={() => setMenuOpen(false)}>
              SOS 
            </Link>
           


            <button
              onClick={() => {
                handleProtectedNav("/donor");
                setMenuOpen(false);
              }}
              className="nav-link text-left"
            >
              Donor
            </button>

            <button
              onClick={() => {
                handleProtectedNav("/hospital");
                setMenuOpen(false);
              }}
              className="nav-link text-left"
            >
              Hospital
            </button>

            <div className="border-t pt-4 flex flex-col gap-3">
              {!user ? (
                <>
                  <Link href="/auth/signup" className="btn-primary text-center">
                    Sign Up
                  </Link>
                  <Link href="/auth/login" className="btn-primary text-center">
                    Login
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href={
                      role === "donor"
                        ? "/dashboard/donor"
                        : role === "hospital"
                        ? "/dashboard/hospital"
                        : role === "admin"
                        ? "/admin/dashboard"
                        : "/dashboard"
                    }
                    className="btn-outline text-center"
                  >
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="btn-danger">
                    Logout
                  </button>
                </>
              )}
              
            </div>
            
          </nav>
          
        </div>
      )}
    </header>
  );
}
