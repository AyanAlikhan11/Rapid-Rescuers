"use client";

import Image from "next/image";

type Hospital = {
  name: string;
  address: string;
  phone: string;
  availableBlood: { group: string; count: number }[];
  image: string;
};

const hospitals: Hospital[] = [
  {
    name: "Ruby General Hospital",
    address: "Kasba, Kolkata, West Bengal 700107",
    phone: "98311 79175 |  97489 32100",
    availableBlood: [
      { group: "O+", count: 20 },
      { group: "A-", count: 15 },
      { group: "B+", count: 10 },
    ],
    image: "/hospitals/RUBY.jpg",
  },
  {
    name: "CMRI Kolkata",
    address: "7/2, Diamond Harbour Road, Kolkata, West Bengal - 700027",
    phone: "212-555-0102",
    availableBlood: [
      { group: "A+", count: 25 },
      { group: "O-", count: 30 },
      { group: "AB+", count: 5 },
    ],
    image: "/hospitals/CMRI_kolkata.jpeg",
  },
  {
    name: "Calcutta Medical College",
    address: "88, College Street, College Square, Kolkata - 700001",
    phone: "323-555-0103",
    availableBlood: [
      { group: "B-", count: 12 },
      { group: "O+", count: 40 },
    ],
    image: "/hospitals/calcutta-medical-college.jpg",
  },
];

export default function PartnerHospitals() {
  return (
    <section className="py-24 bg-gray-50">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Our Partner Hospitals
        </h2>
        <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
          We collaborate with leading hospitals to ensure timely blood delivery during emergencies.
        </p>
      </div>

      {/* Hospital Cards */}
      <div className="max-w-6xl mx-auto px-6">
        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {hospitals.map((hospital, idx) => (
            <HospitalCard key={idx} hospital={hospital} />
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden flex overflow-x-auto space-x-4 scrollbar-hide px-2">
          {hospitals.map((hospital, idx) => (
            <div key={idx} className="min-w-[260px] flex-shrink-0">
              <HospitalCard hospital={hospital} />
            </div>
          ))}
        </div>
      </div>

      {/* View All Button */}
      <div className="mt-12 text-center">
        <button className="py-3 px-6 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
          View All Hospitals
        </button>
      </div>
    </section>
    
  );
}

function HospitalCard({ hospital }: { hospital: Hospital }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col transform transition duration-300 hover:scale-105 hover:shadow-xl hover:bg-red-50">
      {/* Image */}
      <div className="relative h-48 w-full">
        <Image
          src={hospital.image}
          alt={hospital.name}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{hospital.name}</h3>
        <p className="text-sm text-gray-500 mb-1">
          <span className="mr-2">📍</span>
          {hospital.address}
        </p>
        <p className="text-sm text-gray-500 mb-3">
          <span className="mr-2">📞</span>
          {hospital.phone}
        </p>

        <p className="font-semibold text-gray-700 mb-2">Available Blood</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {hospital.availableBlood.map((b, i) => (
            <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
              {b.group} ({b.count})
            </span>
          ))}
        </div>

        <button className="mt-auto py-2 px-4 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-red-50 transition">
          View Details
        </button>
      </div>
    </div>
  );
}

