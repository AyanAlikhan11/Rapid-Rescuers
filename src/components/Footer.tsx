"use client";

import { useState } from "react";

export default function Footer() {
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 👉 Here you can send data to Firebase / API
    console.log({ name, feedback });

    setShowPopup(true);
    setName("");
    setFeedback("");
  };

  return (
    <>
      <footer className="bg-gradient-to-b from-white to-red-50 border-t">
        <div className="container mx-auto px-6 py-12 grid md:grid-cols-3 gap-10 text-gray-700">

          {/* Left Section */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-red-600">Rapid Rescuers</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              A real-time blood donor & emergency response platform built for Hack2Skill.
            </p>

            <div className="flex items-center gap-4 mt-4 text-sm">
              <a className="hover:text-red-600 transition" href="#">Privacy Policy</a>
              <a className="hover:text-red-600 transition" href="#">Contact</a>
            </div>
          </div>

          {/* Middle Quick Links */}
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/map" className="hover:text-red-600 transition">Find Blood</a></li>
              <li><a href="/donor/dashboard" className="hover:text-red-600 transition">Donor Dashboard</a></li>
              <li><a href="/hospital/dashboard" className="hover:text-red-600 transition">Hospital Panel</a></li>
              <li><a href="/emergency" className="hover:text-red-600 transition">Emergency SOS</a></li>
            </ul>
          </div>

          {/* Right Feedback Form */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Feedback</h4>
            <p className="text-sm text-gray-600 mb-3">
              Help us improve the platform!
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-md border border-gray-300
                           focus:border-red-500 focus:ring-1 focus:ring-red-400
                           outline-none transition"
              />

              <textarea
                placeholder="Your feedback..."
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-md border border-gray-300
                           focus:border-red-500 focus:ring-1 focus:ring-red-400
                           outline-none transition"
              />

              <button
                type="submit"
                className="w-full py-2 bg-red-600 text-white rounded-md shadow-md
                           hover:bg-red-700 hover:shadow-lg transition active:scale-95"
              >
                Submit
              </button>
            </form>
          </div>
        </div>

        <div className="border-t py-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Rapid Rescuers — Built for Hack2Skill
        </div>
      </footer>

      {/* POPUP MODAL */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-[90%] max-w-sm text-center">
            <h2 className="text-lg font-semibold text-green-600">
              ✅ Feedback Submitted
            </h2>
            <p className="text-gray-600 mt-2">
              Thank you for helping us improve Rapid Rescuers!
            </p>

            <button
              onClick={() => setShowPopup(false)}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-md
                         hover:bg-red-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
