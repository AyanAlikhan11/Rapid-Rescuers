"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BellAlertIcon } from "@heroicons/react/24/solid";

export default function MobileSOSButton() {
  const pathname = usePathname();


  if (pathname === "/emergency") return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 md:hidden">
      <Link
        href="/emergency"
        aria-label="Emergency SOS"
        className="relative flex items-center justify-center w-16 h-16 rounded-full 
                   bg-red-600 text-white shadow-2xl 
                   animate-pulse hover:scale-110 transition-transform
                   focus:outline-none focus:ring-4 focus:ring-red-300"
      >
        {/* Outer Ping Glow */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-20 animate-ping" />

        {/* Icon */}
        <BellAlertIcon className="w-8 h-8 relative z-10" />
      </Link>
    </div>
  );
}
