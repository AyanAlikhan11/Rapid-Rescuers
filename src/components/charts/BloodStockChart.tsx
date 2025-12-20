"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { BloodStock } from "@/types/hospital";

export default function BloodStockChart({
  stock,
}: {
  stock: BloodStock;
}) {
  const data = Object.entries(stock).map(([group, units]) => ({
    group,
    units,
  }));

  return (
    <div className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition">
      <h3 className="text-lg font-semibold text-green-700 mb-4">
        🩸 Blood Stock Overview
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="group" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="units" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
