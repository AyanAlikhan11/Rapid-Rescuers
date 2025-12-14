// // /components/AvailabilityToggle.tsx
// "use client";
// import { useEffect, useState } from "react";
// import { auth, db } from "../lib/firebase";
// import { doc, getDoc, updateDoc } from "firebase/firestore";
// import useGeoLocation from "../hooks/useGeoLocation";

// export default function AvailabilityToggle() {
//   const [avail, setAvail] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const { location } = useGeoLocation();

//   useEffect(() => {
//     (async () => {
//       const u = auth.currentUser;
//       if (!u) return;
//       const snap = await getDoc(doc(db, "users", u.uid));
//       if (snap.exists()) setAvail(snap.data().availability ?? false);
//     })();
//   }, []);

//   async function toggle() {
//     const u = auth.currentUser;
//     if (!u) return alert("Not logged in");
//     setLoading(true);
//     const newVal = !avail;
//     const ref = doc(db, "users", u.uid);
//     const updateData: any = { availability: newVal };
//     if (location) updateData.location = location;
//     await updateDoc(ref, updateData);
//     setAvail(newVal);
//     setLoading(false);
//   }

//   return (
//     <button onClick={toggle} className={`px-4 py-2 rounded ${avail ? "bg-green-600 text-white" : "bg-gray-200"}`} disabled={loading}>
//       {loading ? "..." : avail ? "Available" : "Set Available"}
//     </button>
//   );
// }


"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import useGeoLocation from "../hooks/useGeoLocation";

/* ------------------------------------------
   Type-safe Firestore update object
------------------------------------------- */
type DonorUpdate = Partial<{
  availability: boolean;
  location: {
    lat: number;
    lng: number;
  };
}>;

export default function AvailabilityToggle() {
  const [avail, setAvail] = useState(false);
  const [loading, setLoading] = useState(false);
  const { location } = useGeoLocation();

  /* ------------------------------------------
     Fetch current availability from Firestore
  ------------------------------------------- */
  useEffect(() => {
    (async () => {
      const u = auth.currentUser;
      if (!u) return;

      const snap = await getDoc(doc(db, "users", u.uid));
      if (snap.exists()) {
        setAvail(snap.data().availability ?? false);
      }
    })();
  }, []);

  /* ------------------------------------------
     Toggle availability + send location
  ------------------------------------------- */
  async function toggle() {
    const u = auth.currentUser;
    if (!u) return alert("Not logged in");

    setLoading(true);

    const newVal = !avail;

    const ref = doc(db, "users", u.uid);

    const updateData: DonorUpdate = {
      availability: newVal,
    };

    if (location) {
      updateData.location = {
        lat: location.lat,
        lng: location.lng,
      };
    }

    await updateDoc(ref, updateData);

    setAvail(newVal);
    setLoading(false);
  }

  /* ------------------------------------------
     Button UI
  ------------------------------------------- */
  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`px-4 py-2 rounded transition ${
        avail ? "bg-green-600 text-white" : "bg-gray-200"
      }`}
    >
      {loading ? "..." : avail ? "Available" : "Set Available"}
    </button>
  );
}

