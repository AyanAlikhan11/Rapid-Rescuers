"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  serverTimestamp,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { signOut } from "firebase/auth";

/* ================= TYPES ================= */

interface SOSRequest {
  id: string;
  bloodGroupNeeded: string;
  status: "open" | "accepted" | "rejected";
  city?: string;
}

/* ================= COMPONENT ================= */

export default function UserDashboard() {
  const router = useRouter();

  const [bloodGroup, setBloodGroup] = useState("O+");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<SOSRequest[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<SOSRequest[]>([]);

  const user = auth.currentUser;

  /* ================= FETCH USER REQUESTS ================= */

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "alerts"),
      where("requestedBy", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<SOSRequest, "id">),
      }));

      setRequests(data);
      setRecentAlerts(data.slice(0, 5));
    });

    return () => unsubscribe();
  }, [user]);

  /* ================= SUBMIT SOS ================= */

  const submitRequest = async () => {
    if (!city.trim()) {
      alert("Please enter city");
      return;
    }

    if (!user) {
      alert("User not authenticated");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "alerts"), {
        requestedBy: user.uid,
        bloodGroupNeeded: bloodGroup,
        city,
        status: "open",
        createdAt: serverTimestamp(),
      });

      setCity("");
      alert("🚨 SOS request sent successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to send SOS request");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOGOUT ================= */

  const logout = async () => {
    await signOut(auth);
    router.push("/auth/login");
  };

  /* ================= STATUS COLOR ================= */

  const statusColor = (status: SOSRequest["status"]) => {
    if (status === "accepted") return "text-green-600";
    if (status === "rejected") return "text-red-600";
    return "text-yellow-600";
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-red-100 to-blue-200 text-gray-900 flex">
      {/* ===== SIDEBAR ===== */}
      <aside className="w-64 hidden md:flex flex-col justify-between border-r-2 border-red-300 p-6 ">
        <div>
          <h2 className="text-2xl font-bold text-red-600 mb-10 ">
            🩸Rapid Rescuers
          </h2>

          <nav className="space-y-4 font-medium">
            {["Dashboard", "My Requests", "Nearby Donors", "Profile"].map(
              (item) => (
                <div
                  key={item}
                  className="cursor-pointer hover:text-red-600 transition"
                >
                  {item}
                </div>
              )
            )}
          </nav>
        </div>

        <button
          onClick={logout}
          className="text-sm text-red-600 hover:underline"
        >
          Logout
        </button>
      </aside>

      {/* ===== MAIN ===== */}
      <main className="flex-1 p-6 space-y-8">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">User Dashboard</h1>

          <button
            onClick={() => router.push("/emergency")}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl shadow transition"
          >
            🚨 SOS Emergency
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Stat title="Requests" value={requests.length} />
          <Stat title="Pending" value={requests.filter(r => r.status === "open").length} />
          <Stat title="Approved" value={requests.filter(r => r.status === "accepted").length} />
          <Stat title="Lives Impacted" value={requests.length * 2} />
        </div>

        {/* MAP */}
        <Card title="📍 Nearby Hospitals & Donors">
          <iframe
            className="w-full h-64 rounded-lg border"
            src="https://maps.google.com/maps?q=hospital&t=&z=13&ie=UTF8&iwloc=&output=embed"
          />
        </Card>

        {/* REQUEST FORM */}
        <Card title="🩸 Request Blood (SOS)">
          <div className="grid md:grid-cols-3 gap-4">
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="input-red"
            >
              {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(bg => (
                <option key={bg}>{bg}</option>
              ))}
            </select>

            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className="input-red"
            />

            <button
              onClick={submitRequest}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl transition"
            >
              {loading ? "Sending..." : "Send SOS"}
            </button>
          </div>
        </Card>

        {/* LIVE ALERTS */}
        <Card title="🔔 Your Recent SOS Requests">
          {recentAlerts.length === 0 && (
            <p className="text-sm text-gray-500">No requests yet</p>
          )}

          {recentAlerts.map((a) => (
            <div
              key={a.id}
              className="flex justify-between text-sm py-2 border-b border-red-100"
            >
              <span>
                🩸 {a.bloodGroupNeeded} — {a.city}
              </span>
              <span className={statusColor(a.status)}>
                {a.status.toUpperCase()}
              </span>
            </div>
          ))}
        </Card>

        {/* EMERGENCY TIPS */}
        <div className="bg-red-50 border border-red-100 p-6 rounded-2xl">
          <h2 className="font-semibold mb-2 text-red-600">
            🚑 Emergency Tips
          </h2>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Stay calm & keep patient hydrated</li>
            <li>Carry blood group report</li>
            <li>Reach nearest hospital immediately</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

/* ================= UI COMPONENTS ================= */

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white border border-red-100 p-6 rounded-2xl shadow hover:shadow-lg transition">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-red-600">{value}</p>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-red-100 p-6 rounded-2xl shadow">
      <h2 className="font-semibold mb-4 text-red-600">{title}</h2>
      {children}
    </div>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import { auth, db } from "@/lib/firebase";
// import {
//   collection,
//   query,
//   where,
//   addDoc,
//   serverTimestamp,
//   onSnapshot,
// } from "firebase/firestore";
// import { signOut } from "firebase/auth";
// import { useRouter } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Activity,
//   HeartPulse,
//   CheckCircle,
//   Clock,
//   LogOut,
//   Menu,
//   Droplet,
//   MapPin,
//   AlertCircle,
// } from "lucide-react";

// /* ================= TYPES ================= */
// interface SOSRequest {
//   id: string;
//   bloodGroupNeeded: string;
//   city?: string;
//   status: "open" | "accepted" | "rejected";
// }

// /* ================= PAGE ================= */
// export default function UserDashboard() {
//   const router = useRouter();
//   const user = auth.currentUser;

//   const [requests, setRequests] = useState<SOSRequest[]>([]);
//   const [bloodGroup, setBloodGroup] = useState("O+");
//   const [city, setCity] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [sidebar, setSidebar] = useState(false);
//   const [success, setSuccess] = useState(false);

//   /* ================= FETCH ================= */
//   useEffect(() => {
//     if (!user) return;
//     const q = query(
//       collection(db, "alerts"),
//       where("requestedBy", "==", user.uid)
//     );
//     return onSnapshot(q, (snap) =>
//       setRequests(
//         snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
//       )
//     );
//   }, [user]);

//   /* ================= DEFAULT SOS REQUESTS (for demo) ================= */
//   const defaultRequests: SOSRequest[] = [
//     { id: "1", bloodGroupNeeded: "A+", city: "Delhi", status: "open" },
//     { id: "2", bloodGroupNeeded: "B+", city: "Mumbai", status: "accepted" },
//     { id: "3", bloodGroupNeeded: "O-", city: "Kolkata", status: "rejected" },
//     { id: "4", bloodGroupNeeded: "AB+", city: "Chennai", status: "open" },
//     { id: "5", bloodGroupNeeded: "O+", city: "Bangalore", status: "accepted" },
//   ];

//   const combinedRequests = [...defaultRequests, ...requests];

//   /* ================= ACTION ================= */
//   const sendSOS = async () => {
//     if (!city) return alert("Enter city");
//     try {
//       setLoading(true);
//       await addDoc(collection(db, "alerts"), {
//         requestedBy: user?.uid,
//         bloodGroupNeeded: bloodGroup,
//         city,
//         status: "open",
//         createdAt: serverTimestamp(),
//       });
//       setCity("");
//       setSuccess(true);
//       setTimeout(() => setSuccess(false), 2500);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= SIDEBAR MENU ITEMS ================= */
//   const menuItems = [
//     { title: "Dashboard", icon: <Activity /> },
//     { title: "SOS Requests", icon: <Droplet /> },
//     { title: "Nearby Hospitals", icon: <MapPin /> },
//     { title: "Emergency Tips", icon: <AlertCircle /> },
//   ];

//   /* ================= EMERGENCY TIPS ================= */
//   const emergencyTips = [
//     "Stay calm and call for help immediately.",
//     "Check the patient's airway, breathing, and circulation.",
//     "Use a pressure bandage for severe bleeding.",
//     "Ensure proper hydration and warmth.",
//     "Transport to hospital if needed safely."
//   ];

//   /* ================= UI ================= */
//   return (
//     <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-red-100 to-blue-200 flex">

//       {/* SIDEBAR */}
//       <motion.aside
//         animate={{ width: sidebar ? 220 : 70 }}
//         className="glass fixed md:relative h-full flex flex-col justify-between p-4 z-20 transition-width duration-300"
//       >
//         {/* Top: Menu + Navigation */}
//         <div className="space-y-4">
//           {/* Hamburger Toggle */}
//           <button
//             onClick={() => setSidebar(!sidebar)}
//             className="flex items-center justify-center w-full p-2 rounded-lg hover:bg-red-100 transition"
//           >
//             <Menu />
//             {sidebar && <span className="ml-2 font-semibold">Menu</span>}
//           </button>

//           {/* Menu Items */}
//           <div className="mt-4 space-y-2">
//             {menuItems.map((item) => (
//               <div
//                 key={item.title}
//                 className="flex items-center gap-3 p-2 rounded-lg hover:bg-red-100 cursor-pointer transition"
//               >
//                 {item.icon}
//                 {sidebar && <span className="font-medium">{item.title}</span>}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Bottom: Logout */}
//         <button
//           onClick={() => signOut(auth).then(() => router.push("/auth/login"))}
//           className="flex items-center gap-2 text-red-600 p-2 rounded-lg hover:bg-red-100 transition"
//         >
//           <LogOut />
//           {sidebar && <span className="font-semibold">Logout</span>}
//         </button>
//       </motion.aside>

//       {/* MAIN */}
//       <main className="flex-1 p-4 md:p-8 ml-[70px] md:ml-0 space-y-6">

//         {/* HEADER */}
//         <div className="flex justify-between items-center">
//           <h1 className="text-2xl font-bold">Dashboard</h1>

//           {/* HEARTBEAT SOS */}
//           <motion.button
//             animate={{ scale: [1, 1.1, 1] }}
//             transition={{ repeat: Infinity, duration: 1.4 }}
//             onClick={sendSOS}
//             className="bg-red-600 text-white px-6 py-3 rounded-2xl shadow-xl"
//           >
//             🚨 SOS
//           </motion.button>
//         </div>

//         {/* STATS */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <Stat icon={<Activity />} title="Total" value={combinedRequests.length} />
//           <Stat icon={<Clock />} title="Pending" value={combinedRequests.filter(r => r.status === "open").length} />
//           <Stat icon={<CheckCircle />} title="Approved" value={combinedRequests.filter(r => r.status === "accepted").length} />
//           <Stat icon={<HeartPulse />} title="Lives" value={combinedRequests.length * 2} />
//         </div>
//             {/* MAP */}
//         <div className="glass p-4 rounded-2xl">
//           <h2 className="font-semibold text-red-600 mb-2">Nearby Hospitals</h2>
//           <iframe
//             className="w-full h-64 rounded-xl"
//             src="https://maps.google.com/maps?q=hospital&t=&z=13&ie=UTF8&iwloc=&output=embed"
//           />
//         </div>
        
//         {/* SOS REQUESTS TABLE */}
//         <div className="glass p-4 rounded-2xl">
//           <h2 className="font-semibold text-red-600 mb-2">Recent SOS Requests</h2>
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-left">
//               <thead>
//                 <tr className="border-b border-red-200">
//                   <th className="px-4 py-2">Blood Group</th>
//                   <th className="px-4 py-2">City</th>
//                   <th className="px-4 py-2">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {combinedRequests.map(r => (
//                   <tr key={r.id} className="border-b border-red-100">
//                     <td className="px-4 py-2">{r.bloodGroupNeeded}</td>
//                     <td className="px-4 py-2">{r.city}</td>
//                     <td className={`px-4 py-2 font-semibold ${r.status === 'open' ? 'text-yellow-500' : r.status === 'accepted' ? 'text-green-500' : 'text-red-500'}`}>
//                       {r.status.toUpperCase()}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

        

//         {/* SOS FORM */}
//         <div className="glass p-6 rounded-2xl space-y-4">
//           <h2 className="text-red-600 font-semibold">Request Blood</h2>
//           <div className="grid md:grid-cols-3 gap-4">
//             <select
//               className="input-red"
//               value={bloodGroup}
//               onChange={(e) => setBloodGroup(e.target.value)}
//             >
//               {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(b=>(<option key={b}>{b}</option>))}
//             </select>

//             <input
//               className="input-red"
//               placeholder="City"
//               value={city}
//               onChange={(e) => setCity(e.target.value)}
//             />

//             <button
//               disabled={loading}
//               onClick={sendSOS}
//               className="bg-red-600 text-white rounded-xl"
//             >
//               {loading ? "Sending..." : "Send SOS"}
//             </button>
//           </div>
//         </div>

//         {/* EMERGENCY TIPS */}
//         <div className="glass p-4 rounded-2xl space-y-2">
//           <h2 className="text-red-600 font-semibold">Emergency Tips</h2>
//           <ul className="list-disc list-inside text-gray-700">
//             {emergencyTips.map((tip, index) => (
//               <li key={index}>{tip}</li>
//             ))}
//           </ul>
//         </div>

//         {/* SUCCESS ANIMATION */}
//         <AnimatePresence>
//           {success && (
//             <motion.div
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0 }}
//               className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
//             >
//               <div className="glass p-10 rounded-3xl text-center">
//                 <CheckCircle size={64} className="text-green-500 mx-auto" />
//                 <p className="mt-4 font-semibold">SOS Sent Successfully</p>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//       </main>
//     </div>
//   );
// }

// /* ================= COMPONENT ================= */
// function Stat({ icon, title, value }: any) {
//   return (
//     <motion.div
//       initial={{ y: 20, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       className="glass p-4 rounded-2xl flex gap-3 items-center"
//     >
//       <div className="text-red-600">{icon}</div>
//       <div>
//         <p className="text-xs text-gray-500">{title}</p>
//         <p className="text-xl font-bold">{value}</p>
//       </div>
//     </motion.div>
//   );
// }
