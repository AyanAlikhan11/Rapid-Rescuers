// /components/DonorCard.tsx
import React from "react";

type Donor = {
  uid?: string;
  name?: string;
  bloodGroup?: string;
  phone?: string;
  availability?: boolean;
  distanceKm?: number;
};

export default function DonorCard({
  donor,
  onCall,
  onMessage,
}: {
  donor: Donor;
  onCall?: (d: Donor) => void;
  onMessage?: (d: Donor) => void;
}) {
  return (
    <div className="flex items-center gap-4 p-3 bg-white rounded shadow-sm">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${donor.availability ? "bg-green-500" : "bg-gray-400"}`}>
        {donor.name?.charAt(0) ?? "D"}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-baseline">
          <h3 className="font-semibold">{donor.name}</h3>
          <span className="text-xs text-gray-700">{donor.bloodGroup}</span>
        </div>
        <p className="text-sm text-gray-600">{donor.phone ?? "No phone"}</p>
        {donor.distanceKm != null && <p className="text-xs text-gray-500 mt-1">{donor.distanceKm.toFixed(1)} km away</p>}
      </div>

      <div className="flex gap-2">
        <button onClick={() => onCall && onCall(donor)} className="px-3 py-1 border rounded text-sm">Call</button>
        <button onClick={() => onMessage && onMessage(donor)} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Message</button>
      </div>
    </div>
  );
}
