// /components/HospitalCard.tsx
export default function HospitalCard({ hospital }: { hospital: any }) {
  return (
    <div className="bg-white p-3 rounded shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{hospital.name}</h3>
          <p className="text-sm text-gray-600">{hospital.address}</p>
        </div>
        <div className="text-sm text-gray-500">{hospital.distanceKm ? hospital.distanceKm.toFixed(1) + " km" : ""}</div>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2">
        {Object.keys(hospital.bloodStock || {}).map((bg) => (
          <div key={bg} className="p-2 border rounded text-center">
            <div className="font-semibold">{bg}</div>
            <div className="text-sm text-gray-600">{hospital.bloodStock[bg]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
