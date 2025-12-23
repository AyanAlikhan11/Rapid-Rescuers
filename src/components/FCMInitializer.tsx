// // /components/FCMInitializer.tsx
// "use client";
// import { useEffect } from "react";
// import { initFCMAndSaveToken, registerOnMessageHandler } from "../lib/fcm";

// export default function FCMInitializer() {
//   useEffect(() => {
//     const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "YOUR_FIREBASE_VAPID_KEY";
//     (async () => {
//       try {
//         const token = await initFCMAndSaveToken(vapidKey);
//         console.log("FCM Token:", token);
//       } catch (err) {
//         console.error(err);
//       }
//     })();

//     registerOnMessageHandler((payload) => {
//       const title = payload?.notification?.title || "Notification";
//       const body = payload?.notification?.body || "";
//       if (Notification.permission === "granted") {
//         new Notification(title, { body });
//       } else {
//         alert(`${title}\n${body}`);
//       }
//     });
//   }, []);

//   return null;
// }
