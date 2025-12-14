// /components/Footer.tsx
export default function Footer() {
  return (
    <footer className=" bg-gradient-to-b from-white to-red-50 border-t">
  <div className="container mx-auto px-6 py-12 grid md:grid-cols-3 gap-10 text-gray-700">

    {/* Left Section */}
    <div>
      <h3 className="text-xl font-bold mb-3 text-red-600">Rapid Rescuers</h3>
      <p className="text-sm text-gray-600 leading-relaxed">
        A real-time blood donor & emergency response platform built for Hack2Skill.
      </p>

      <div className="flex items-center gap-4 mt-4">
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
      <p className="text-sm text-gray-600 mb-3">Help us improve the platform!</p>

      <form className="space-y-3">
        <input
          type="text"
          placeholder="Your name"
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-400 outline-none transition"
        />

        <textarea
          placeholder="Your feedback..."
          rows={3}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-400 outline-none transition"
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

  );
}
