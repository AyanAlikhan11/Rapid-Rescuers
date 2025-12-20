"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const donationData = [
  { month: "Jan", donations: 1 },
  { month: "Feb", donations: 0 },
  { month: "Mar", donations: 2 },
  { month: "Apr", donations: 1 },
  { month: "May", donations: 3 },
];

export default function DonationChart() {
  return (
    <div className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition">
      <h3 className="text-lg font-semibold text-red-600 mb-4">
        ❤️ Donation Activity
      </h3>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={donationData}>
          <defs>
            <linearGradient id="colorDonation" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopOpacity={0.8} />
              <stop offset="95%" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="donations"
            strokeWidth={3}
            fill="url(#colorDonation)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
