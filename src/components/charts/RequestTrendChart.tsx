"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const mockData = [
  { day: "Mon", requests: 4 },
  { day: "Tue", requests: 6 },
  { day: "Wed", requests: 3 },
  { day: "Thu", requests: 7 },
  { day: "Fri", requests: 5 },
];

export default function RequestTrendChart() {
  return (
    <div className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition">
      <h3 className="text-lg font-semibold text-purple-700 mb-4">
        📈 Blood Request Trend
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={mockData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="requests"
            strokeWidth={3}
            dot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
