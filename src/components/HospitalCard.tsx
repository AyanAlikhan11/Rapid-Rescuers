
import type { Hospital, BloodGroup } from "@/types/hospital";

interface HospitalCardProps {
  hospital: Hospital & {
    distanceKm?: number; // derived field (not stored in Firestore)
  };
}

export default function HospitalCard({ hospital }: HospitalCardProps) {
  return (
    <div className="bg-white p-3 rounded shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{hospital.name}</h3>
          <p className="text-sm text-gray-600">{hospital.address}</p>
        </div>

        {/* Distance (optional, calculated at runtime) */}
        {typeof hospital.distanceKm === "number" && (
          <div className="text-sm text-gray-500">
            {hospital.distanceKm.toFixed(1)} km
          </div>
        )}
      </div>

      {/* Blood stock */}
      <div className="mt-3 grid grid-cols-4 gap-2">
        {(Object.entries(hospital.bloodStock) as [BloodGroup, number][]).map(
          ([bg, count]) => (
            <div key={bg} className="p-2 border rounded text-center">
              <div className="font-semibold">{bg}</div>
              <div className="text-sm text-gray-600">{count}</div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
