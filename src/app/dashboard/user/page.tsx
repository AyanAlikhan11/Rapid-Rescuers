// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { auth, db } from "@/lib/firebase";
// import {
//   collection,
//   query,
//   where,
//   serverTimestamp,
//   addDoc,
//   onSnapshot,
// } from "firebase/firestore";
// import { signOut } from "firebase/auth";

// /* ================= TYPES ================= */

// interface SOSRequest {
//   id: string;
//   bloodGroupNeeded: string;
//   status: "open" | "accepted" | "rejected";
//   city?: string;
// }

// /* ================= COMPONENT ================= */

// export default function UserDashboard() {
//   const router = useRouter();

//   const [bloodGroup, setBloodGroup] = useState("O+");
//   const [city, setCity] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [requests, setRequests] = useState<SOSRequest[]>([]);
//   const [recentAlerts, setRecentAlerts] = useState<SOSRequest[]>([]);

//   const user = auth.currentUser;

//   /* ================= FETCH USER REQUESTS ================= */

//   useEffect(() => {
//     if (!user) return;

//     const q = query(
//       collection(db, "alerts"),
//       where("requestedBy", "==", user.uid)
//     );

//     const unsubscribe = onSnapshot(q, (snap) => {
//       const data = snap.docs.map((d) => ({
//         id: d.id,
//         ...(d.data() as Omit<SOSRequest, "id">),
//       }));

//       setRequests(data);
//       setRecentAlerts(data.slice(0, 5));
//     });

//     return () => unsubscribe();
//   }, [user]);

//   /* ================= SUBMIT SOS ================= */

//   const submitRequest = async () => {
//     if (!city.trim()) {
//       alert("Please enter city");
//       return;
//     }

//     if (!user) {
//       alert("User not authenticated");
//       return;
//     }

//     try {
//       setLoading(true);

//       await addDoc(collection(db, "alerts"), {
//         requestedBy: user.uid,
//         bloodGroupNeeded: bloodGroup,
//         city,
//         status: "open",
//         createdAt: serverTimestamp(),
//       });

//       setCity("");
//       alert("🚨 SOS request sent successfully");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to send SOS request");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= LOGOUT ================= */

//   const logout = async () => {
//     await signOut(auth);
//     router.push("/auth/login");
//   };

//   /* ================= STATUS COLOR ================= */

//   const statusColor = (status: SOSRequest["status"]) => {
//     if (status === "accepted") return "text-green-600";
//     if (status === "rejected") return "text-red-600";
//     return "text-yellow-600";
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-red-100 to-blue-200 text-gray-900 flex">
//       {/* ===== SIDEBAR ===== */}
//       <aside className="w-64 hidden md:flex flex-col justify-between border-r-2 border-red-300 p-6 ">
//         <div>
//           <h2 className="text-2xl font-bold text-red-600 mb-10 ">
//             Rapid Rescuers
//           </h2>

//           <nav className="space-y-4 font-medium">
//             {["Dashboard", "My Requests", "Nearby Donors", "Profile"].map(
//               (item) => (
//                 <div
//                   key={item}
//                   className="cursor-pointer hover:text-red-600 transition"
//                 >
//                   {item}
//                 </div>
//               )
//             )}
//           </nav>
//         </div>

//         <button
//           onClick={logout}
//           className="text-sm text-red-600 hover:underline"
//         >
//           Logout
//         </button>
//       </aside>

//       {/* ===== MAIN ===== */}
//       <main className="flex-1 p-6 space-y-8">
//         {/* HEADER */}
//         <div className="flex justify-between items-center">
//           <h1 className="text-2xl font-bold">Dashboard</h1>

//           <button
//             onClick={() => router.push("/emergency")}
//             className="group relative flex items-center justify-center
//               bg-red-600 hover:bg-red-700
//               text-white font-semibold
//               h-11 w-20 hover:w-48
//               rounded-xl shadow
//               transition-all duration-300 overflow-hidden"
//           >
//             <span className="absolute group-hover:-translate-x-20 group-hover:opacity-0 transition">
//               SOS
//             </span>
//             <span className="absolute translate-x-20 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition whitespace-nowrap">
//               🚨 SOS Emergency
//             </span>
//           </button>
//         </div>

//         {/* STATS */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//           <Stat title="Requests" value={requests.length} />
//           <Stat title="Pending" value={requests.filter(r => r.status === "open").length} />
//           <Stat title="Approved" value={requests.filter(r => r.status === "accepted").length} />
//           <Stat title="Lives Impacted" value={requests.length * 2} />
//         </div>

//         {/* MAP */}
//         <Card title="📍 Nearby Hospitals & Donors">
//           <iframe
//             className="w-full h-64 rounded-lg border"
//             src="https://maps.google.com/maps?q=hospital&t=&z=13&ie=UTF8&iwloc=&output=embed"
//           />
//         </Card>

//         {/* REQUEST FORM */}
//         <Card title="🩸 Request Blood (SOS)">
//           <div className="grid md:grid-cols-3 gap-4">
//             <select
//               value={bloodGroup}
//               onChange={(e) => setBloodGroup(e.target.value)}
//               className="input-red"
//             >
//               {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(bg => (
//                 <option key={bg}>{bg}</option>
//               ))}
//             </select>

//             <input
//               value={city}
//               onChange={(e) => setCity(e.target.value)}
//               placeholder="City"
//               className="input-red"
//             />

//             <button
//               onClick={submitRequest}
//               disabled={loading}
//               className="bg-red-600 hover:bg-red-700 text-white rounded-xl transition"
//             >
//               {loading ? "Sending..." : "Send SOS"}
//             </button>
//           </div>
//         </Card>

//         {/* LIVE ALERTS */}
//         <Card title="🔔 Your Recent SOS Requests">
//           {recentAlerts.length === 0 && (
//             <p className="text-sm text-gray-500">No requests yet</p>
//           )}

//           {recentAlerts.map((a) => (
//             <div
//               key={a.id}
//               className="flex justify-between text-sm py-2 border-b border-red-100"
//             >
//               <span>
//                 🩸 {a.bloodGroupNeeded} — {a.city}
//               </span>
//               <span className={statusColor(a.status)}>
//                 {a.status.toUpperCase()}
//               </span>
//             </div>
//           ))}
//         </Card>

//         {/* EMERGENCY TIPS */}
//         <div className="bg-red-50 border border-red-100 p-6 rounded-2xl">
//           <h2 className="font-semibold mb-2 text-red-600">
//             🚑 Emergency Tips
//           </h2>
//           <ul className="list-disc pl-5 text-sm space-y-1">
//             <li>Stay calm & keep patient hydrated</li>
//             <li>Carry blood group report</li>
//             <li>Reach nearest hospital immediately</li>
//           </ul>
//         </div>
//       </main>
//     </div>
//   );
// }

// /* ================= UI COMPONENTS ================= */

// function Stat({ title, value }: { title: string; value: number }) {
//   return (
//     <div className="bg-white border border-red-100 p-6 rounded-2xl shadow hover:shadow-lg transition">
//       <p className="text-sm text-gray-500">{title}</p>
//       <p className="text-2xl font-bold text-red-600">{value}</p>
//     </div>
//   );
// }

// function Card({
//   title,
//   children,
// }: {
//   title: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="bg-white border border-red-100 p-6 rounded-2xl shadow">
//       <h2 className="font-semibold mb-4 text-red-600">{title}</h2>
//       {children}
//     </div>
//   );
// }




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
  getDoc,
  doc
} from "firebase/firestore";

import { signOut } from "firebase/auth";
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  FileText,
  MapPin,
  User,
  LogOut,
} from "lucide-react";

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

  const [collapsed, setCollapsed] = useState(false);

  const user = auth.currentUser;
  const [isDonorVerified, setIsDonorVerified] = useState(false);

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
    const fetchUserStatus = async () => {
    const snap = await getDoc(doc(db, "users", user.uid));
    if (snap.exists()) {
      setIsDonorVerified(!!snap.data().isDonorVerified);
    }
  };

  fetchUserStatus();
    return () => unsubscribe();
  }, [user]);

  /* ================= SUBMIT SOS ================= */

  const submitRequest = async () => {
    if (!city.trim()) return alert("Please enter city");
    if (!user) return alert("User not authenticated");

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
    <div className="min-h-screen flex bg-gradient-to-b from-red-100 to-blue-200 text-gray-900">

      {/* ===== SIDEBAR ===== */}
      <aside
        className={`bg-white border-r-2 border-red-300 transition-all duration-300
        ${collapsed ? "w-20" : "w-64"} hidden md:flex flex-col`}
      >
        <div className="flex items-center justify-between p-4">
          {!collapsed && (
            <h2 className="text-xl font-bold text-red-600">
              Rapid Rescuers
            </h2>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded hover:bg-red-100"
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-2">
          <SidebarItem icon={<LayoutDashboard />} text="Dashboard" collapsed={collapsed} />
          <SidebarItem icon={<FileText />} text="My Requests" collapsed={collapsed} />
          <SidebarItem icon={<MapPin />} text="Nearby Donors" collapsed={collapsed} />
          <SidebarItem icon={<User />} text="Profile" collapsed={collapsed} />
          {/* VERIFIED DONOR */}
  <div
    onClick={() => {
      if (!isDonorVerified) {
        router.push("/auth/donorveif");
      }
    }}
    className={`flex items-center gap-3 p-3 rounded cursor-pointer
      ${isDonorVerified ? "bg-green-50 text-green-700" : "hover:bg-red-50"}`}
  >
    <input
      type="checkbox"
      checked={isDonorVerified}
      readOnly
      className="accent-green-600 cursor-pointer"
    />

    {!collapsed && (
      <span className="flex items-center gap-2">
        Verified Donor
        {isDonorVerified && "✅"}
      </span>
    )}
  </div>
        </nav>

        <button
          onClick={logout}
          className="flex items-center gap-3 p-4 text-red-600 hover:bg-red-50"
        >
          <LogOut />
          {!collapsed && "Logout"}
        </button>
      </aside>

      {/* ===== MAIN (UNCHANGED) ===== */}
      <main className="flex-1 p-6 space-y-8">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>

          <button
            onClick={() => router.push("/emergency")}
            className="group relative flex items-center justify-center
              bg-red-600 hover:bg-red-700
              text-white font-semibold
              h-11 w-20 hover:w-48
              rounded-xl shadow
              transition-all duration-300 overflow-hidden"
          >
            <span className="absolute group-hover:-translate-x-20 group-hover:opacity-0 transition">
              🚨SOS
            </span>
            <span className="absolute translate-x-20 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition whitespace-nowrap">
              🚨 SOS Emergency
            </span>
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
            src="https://maps.google.com/maps?q=hospital&t=&z=13&output=embed"
          />
        </Card>

        {/* REQUEST FORM */}
        <Card title="🩸 Request Blood (SOS)">
          <div className="grid md:grid-cols-3 gap-4">
            <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className="input-red">
              {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(bg => (
                <option key={bg}>{bg}</option>
              ))}
            </select>

            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="input-red" />

            <button onClick={submitRequest} disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl transition">
              {loading ? "Sending..." : "Send SOS"}
            </button>
          </div>
        </Card>

        {/* LIVE ALERTS */}
        <Card title="🔔 Your Recent SOS Requests">
          {recentAlerts.map((a) => (
            <div key={a.id} className="flex justify-between text-sm py-2 border-b border-red-100">
              <span>🩸 {a.bloodGroupNeeded} — {a.city}</span>
              <span className={statusColor(a.status)}>{a.status.toUpperCase()}</span>
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

function SidebarItem({ icon, text, collapsed }: any) {
  return (
    <div className="flex items-center gap-3 p-3 rounded hover:bg-red-50 cursor-pointer">
      {icon}
      {!collapsed && text}
    </div>
  );
}

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white border border-red-100 p-6 rounded-2xl shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-red-600">{value}</p>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-red-100 p-6 rounded-2xl shadow">
      <h2 className="font-semibold mb-4 text-red-600">{title}</h2>
      {children}
    </div>
  );
}
