"use client";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white p-4 rounded shadow">
          👤 Manage Users
        </div>

        <div className="bg-white p-4 rounded shadow">
          🏥 Approve Hospitals
        </div>

        <div className="bg-white p-4 rounded shadow">
          📊 Platform Analytics
        </div>
      </div>
    </div>
  );
}
