import Link from "next/link";
import { BellAlertIcon } from "@heroicons/react/24/outline";

export default function EmergencyCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-red-600 to-red-700 text-white py-24 text-center">
      {/* Background Pulse */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[500px] h-[500px] rounded-full bg-red-500 opacity-20 animate-ping" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
          Emergency Blood Required?
        </h2>
        <p className="text-lg text-red-100 mb-10">
          Instantly notify nearby donors and hospitals with one click.
        </p>

        <Link
          href="/emergency"
          className="group inline-flex items-center gap-4 bg-white text-red-700 font-semibold px-10 py-5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/40"
        >
          {/* Icon with glow */}
          <span className="relative flex items-center justify-center">
            <span className="absolute inline-flex h-10 w-10 rounded-full bg-red-600 opacity-20 animate-ping" />
            <BellAlertIcon className="w-7 h-7 relative" />
          </span>

          <span className="text-lg tracking-wide">
            Activate SOS
          </span>
        </Link>

        <p className="mt-6 text-sm text-red-200">
          🚑 For life-threatening emergencies only
        </p>
      </div>
    </section>
  );
}
