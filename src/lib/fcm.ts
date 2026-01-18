
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export async function initFCMAndSaveToken(vapidKey?: string) {
  if (typeof window === "undefined") return null;
  try {
    const messaging = getMessaging();
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    const token = await getToken(messaging, { vapidKey });
    if (!token) return null;

    const user = auth.currentUser;
    if (user) {
      const ref = doc(db, "users", user.uid);
      await setDoc(ref, { fcmToken: token }, { merge: true });
    }

    return token;
  } catch (err) {
    console.error("FCM init error:", err);
    return null;
  }
}

export function registerOnMessageHandler(handler: (payload: any) => void) {
  if (typeof window === "undefined") return;
  try {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      handler && handler(payload);
    });
  } catch (err) {
    console.warn("onMessage not available", err);
  }
}
