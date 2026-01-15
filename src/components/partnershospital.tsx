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



// "use client";

// import { useState } from "react";
// import Image from "next/image";

// type Hospital = {
//   name: string;
//   address: string;
//   phone: string;
//   availableBlood: { group: string; count: number }[];
//   image: string;
// };

// const hospitals: Hospital[] = [
//   {
//     name: "Ruby General Hospital",
//     address: "Kasba, Kolkata, West Bengal 700107",
//     phone: "98311 79175 | 97489 32100",
//     availableBlood: [
//       { group: "O+", count: 20 },
//       { group: "A-", count: 15 },
//       { group: "B+", count: 10 },
//     ],
//     image: "/hospitals/RUBY.jpg",
//   },
//   {
//     name: "CMRI Kolkata",
//     address: "7/2, Diamond Harbour Road, Kolkata - 700027",
//     phone: "212-555-0102",
//     availableBlood: [
//       { group: "A+", count: 25 },
//       { group: "O-", count: 30 },
//       { group: "AB+", count: 5 },
//     ],
//     image: "/hospitals/CMRI_kolkata.jpeg",
//   },
//   {
//     name: "Calcutta Medical College",
//     address: "88, College Street, Kolkata - 700001",
//     phone: "323-555-0103",
//     availableBlood: [
//       { group: "B-", count: 12 },
//       { group: "O+", count: 40 },
//     ],
//     image: "/hospitals/calcutta-medical-college.jpg",
//   },
// ];

// export default function PartnerHospitals() {
//   const [showAll, setShowAll] = useState(false);
//   const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

//   return (
//     <section className="py-24 bg-gray-50 relative">
//       {/* Heading */}
//       <div className="text-center mb-12">
//         <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
//           Our Partner Hospitals
//         </h2>
//         <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
//           We collaborate with leading hospitals to ensure timely blood delivery during emergencies.
//         </p>
//       </div>

//       {/* Hospital Cards */}
//       <div className="max-w-6xl mx-auto px-6">
//         <div className="grid md:grid-cols-3 gap-8">
//           {(showAll ? hospitals : hospitals.slice(0, 3)).map((hospital, idx) => (
//             <HospitalCard
//               key={idx}
//               hospital={hospital}
//               onView={() => setSelectedHospital(hospital)}
//             />
//           ))}
//         </div>
//       </div>

//       {/* View All Button */}
//       {!showAll && (
//         <div className="mt-12 text-center">
//           <button
//             onClick={() => setShowAll(true)}
//             className="py-3 px-6 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
//           >
//             View All Hospitals
//           </button>
//         </div>
//       )}

//       {/* DETAILS MODAL */}
//       {selectedHospital && (
//         <HospitalModal
//           hospital={selectedHospital}
//           onClose={() => setSelectedHospital(null)}
//         />
//       )}
//     </section>
//   );
// }

// /* ---------------- CARD ---------------- */

// function HospitalCard({
//   hospital,
//   onView,
// }: {
//   hospital: Hospital;
//   onView: () => void;
// }) {
//   return (
//     <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col hover:scale-105 transition">
//       <div className="relative h-48">
//         <Image
//           src={hospital.image}
//           alt={hospital.name}
//           fill
//           className="object-cover"
//         />
//       </div>

//       <div className="p-6 flex flex-col flex-1">
//         <h3 className="text-lg font-semibold mb-1">{hospital.name}</h3>
//         <p className="text-sm text-gray-500 mb-3">{hospital.address}</p>

//         <div className="flex flex-wrap gap-2 mb-4">
//           {hospital.availableBlood.map((b, i) => (
//             <span
//               key={i}
//               className="text-xs bg-gray-100 px-2 py-1 rounded-full"
//             >
//               {b.group} ({b.count})
//             </span>
//           ))}
//         </div>

//         <button
//           onClick={onView}
//           className="mt-auto py-2 px-4 border rounded-md hover:bg-red-50 transition"
//         >
//           View Details
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ---------------- MODAL ---------------- */

// function HospitalModal({
//   hospital,
//   onClose,
// }: {
//   hospital: Hospital;
//   onClose: () => void;
// }) {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
//       <div className="bg-white max-w-lg w-full rounded-xl overflow-hidden relative">
//         {/* Close */}
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-xl font-bold"
//         >
//           ✕
//         </button>

//         <div className="relative h-56">
//           <Image
//             src={hospital.image}
//             alt={hospital.name}
//             fill
//             className="object-cover"
//           />
//         </div>

//         <div className="p-6">
//           <h3 className="text-2xl font-bold mb-2">{hospital.name}</h3>
//           <p className="text-gray-600 mb-2">📍 {hospital.address}</p>
//           <p className="text-gray-600 mb-4">📞 {hospital.phone}</p>

//           <h4 className="font-semibold mb-2">Available Blood</h4>
//           <div className="flex flex-wrap gap-2">
//             {hospital.availableBlood.map((b, i) => (
//               <span
//                 key={i}
//                 className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
//               >
//                 {b.group} — {b.count} units
//               </span>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }







// "use client";

// import { useEffect, useRef, useState } from "react";
// import Image from "next/image";
// import { motion, AnimatePresence } from "framer-motion";

// type Hospital = {
//   name: string;
//   address: string;
//   phone: string;
//   availableBlood: { group: string; count: number }[];
//   image: string;
// };

// const hospitals: Hospital[] = [
//   {
//     name: "Ruby General Hospital",
//     address: "Kasba, Kolkata, West Bengal 700107",
//     phone: "98311 79175 | 97489 32100",
//     availableBlood: [
//       { group: "O+", count: 20 },
//       { group: "A-", count: 15 },
//       { group: "B+", count: 10 },
//     ],
//     image: "/hospitals/RUBY.jpg",
//   },
//   {
//     name: "CMRI Kolkata",
//     address: "7/2 Diamond Harbour Road, Kolkata - 700027",
//     phone: "212-555-0102",
//     availableBlood: [
//       { group: "A+", count: 25 },
//       { group: "O-", count: 30 },
//       { group: "AB+", count: 5 },
//     ],
//     image: "/hospitals/CMRI_kolkata.jpeg",
//   },
//   {
//     name: "Calcutta Medical College",
//     address: "88 College Street, Kolkata - 700001",
//     phone: "323-555-0103",
//     availableBlood: [
//       { group: "B-", count: 12 },
//       { group: "O+", count: 40 },
//     ],
//     image: "/hospitals/calcutta-medical-college.jpg",
//   },
// ];

// export default function PartnerHospitals() {
//   const [current, setCurrent] = useState(0);
//   const timerRef = useRef<NodeJS.Timeout | null>(null);

//   const next = () =>
//     setCurrent((c) => (c === hospitals.length - 1 ? 0 : c + 1));
//   const prev = () =>
//     setCurrent((c) => (c === 0 ? hospitals.length - 1 : c - 1));

//   /* AUTO PLAY */
//   useEffect(() => {
//     timerRef.current = setInterval(next, 4000);
//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current);
//     };
//   }, []);

//   const stopAutoPlay = () => {
//     if (timerRef.current) clearInterval(timerRef.current);
//   };

//   return (
//     <section className="relative py-28 bg-gradient-to-b from-red-50 via-white to-red-50 overflow-hidden">
//       {/* Background */}
//       <div className="absolute -top-32 -left-32 h-96 w-96 bg-red-100 rounded-full blur-3xl opacity-60" />
//       <div className="absolute -bottom-32 -right-32 h-96 w-96 bg-red-200 rounded-full blur-3xl opacity-50" />

//       {/* Heading */}
//       <div className="relative z-10 text-center mb-14 px-4">
//         <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
//           Our Partner Hospitals
//         </h2>
//         <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
//           Trusted hospitals ensuring rapid blood availability.
//         </p>
//       </div>

//       {/* Carousel */}
//       <div
//         className="relative z-10 flex flex-col items-center"
//         onMouseEnter={stopAutoPlay}
//         onTouchStart={stopAutoPlay}
//       >
//         <div className="relative h-[500px] w-[340px]">
//           <AnimatePresence>
//             {hospitals.map((hospital, index) => {
//               const pos = index - current;
//               if (Math.abs(pos) > 1) return null;

//               return (
//                 <motion.div
//                   key={hospital.name}
//                   drag={pos === 0 ? "x" : false}
//                   dragConstraints={{ left: 0, right: 0 }}
//                   onDragEnd={(_, info) => {
//                     if (info.offset.x < -80) next();
//                     if (info.offset.x > 80) prev();
//                   }}
//                   initial={{ opacity: 0 }}
//                   animate={{
//                     opacity: 1,
//                     scale: pos === 0 ? 1 : 0.92,
//                     rotate: pos === -1 ? -4 : pos === 1 ? 4 : 0,
//                     x: pos === -1 ? -70 : pos === 1 ? 70 : 0,
//                     y: pos === 0 ? 0 : 25,
//                     zIndex: pos === 0 ? 10 : 5,
//                   }}
//                   exit={{ opacity: 0 }}
//                   transition={{ duration: 0.45 }}
//                   className="absolute inset-0 cursor-grab active:cursor-grabbing"
//                 >
//                   <HospitalCard hospital={hospital} />
//                 </motion.div>
//               );
//             })}
//           </AnimatePresence>
//         </div>

//         {/* Dots */}
//         <div className="mt-10 flex gap-3">
//           {hospitals.map((_, i) => (
//             <button
//               key={i}
//               onClick={() => setCurrent(i)}
//               className={`h-3 w-3 rounded-full transition ${
//                 current === i
//                   ? "bg-red-600 scale-125"
//                   : "bg-red-300 hover:bg-red-400"
//               }`}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// function HospitalCard({ hospital }: { hospital: Hospital }) {
//   return (
//     <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-xl">
//       <div className="relative h-44 w-full">
//         <Image
//           src={hospital.image}
//           alt={hospital.name}
//           fill
//           className="object-cover"
//           priority
//         />
//       </div>

//       <div className="p-6 flex flex-col flex-1">
//         <h3 className="text-lg font-semibold text-gray-900 mb-2">
//           {hospital.name}
//         </h3>
//         <p className="text-sm text-gray-500 mb-1">📍 {hospital.address}</p>
//         <p className="text-sm text-gray-500 mb-3">📞 {hospital.phone}</p>

//         <p className="font-semibold text-gray-700 mb-2">
//           Available Blood
//         </p>

//         <div className="flex flex-wrap gap-2 mb-4">
//           {hospital.availableBlood.map((b, i) => (
//             <span
//               key={i}
//               className="text-xs bg-red-50 text-red-700 px-3 py-1 rounded-full"
//             >
//               {b.group} ({b.count})
//             </span>
//           ))}
//         </div>

//         <button className="mt-auto py-2 px-4 border border-red-600 text-red-600 rounded-md hover:bg-red-600 hover:text-white transition">
//           View Details
//         </button>
//       </div>
//     </div>
//   );
// }


