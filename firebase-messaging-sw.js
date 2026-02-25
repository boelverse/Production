// firebase-messaging-sw.js

// Keep your basic lifecycle handlers
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

// Import Firebase compat SDKs
importScripts(
  "https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js"
);

// Same config as in your app / sw.js
const firebaseConfig = {
  apiKey: "AIzaSyCTA3NZsYoSeGskrIL_2isF2aCqLpEsRYc",
  authDomain: "rbgh-app.firebaseapp.com",
  databaseURL:
    "https://rbgh-app-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "rbgh-app",
  storageBucket: "rbgh-app.firebasestorage.app",
  messagingSenderId: "955092745966",
  appId: "1:955092745966:web:237adaa1a37752a93ebdff",
  measurementId: "G-004FZK6EXT",
};

function getTag(payload) {
  return payload?.data?.tag || null;
}
function getType(payload) {
  return payload?.data?.type || null;
}
function getTitle(payload) {
  return payload?.notification?.title || payload?.data?.title || null;
}
function getBody(payload) {
  return payload?.notification?.body || payload?.data?.body || "";
}

self.addEventListener("notificationclose", (event) => {
  const tag = event.notification.tag;
  const type = event.notification?.data?.type || null;
  console.log("[FMSW] Notification closed:", { tag, type });
});

async function maybeShowByTag(payload) {
  const tag = getTag(payload);
  const type = getType(payload);
  if (!tag) return;

  // If a notification with the same tag and type is already shown, skip duplicates.
  const existing = await self.registration.getNotifications({ tag });
  const hasSameTagAndType = existing.some((n) => {
    const nType = n?.data?.type || null;
    return n.tag === tag && nType === type;
  });
  if (hasSameTagAndType) return;

  const title = getTitle(payload);
  if (!title) return;

  const body = getBody(payload);

  self.registration.showNotification(title, {
    body,
    icon: payload?.data?.icon || "/pwa-192x192.png",
    data: { ...(payload?.data || {}), type },
    tag,
    renotify: false,
    requireInteraction: true,
  });
}

try {
  if (!firebase?.apps?.length) {
    firebase.initializeApp(firebaseConfig);
    console.log("[FMSW] Firebase app initialized");
  } else {
    console.log("[FMSW] Firebase app already initialized");
  }

  const messaging = firebase.messaging?.();
  if (!messaging) {
    console.warn("[FMSW] Firebase messaging unavailable (compat API missing)");
  } else {
    console.log("[FMSW] Firebase Messaging initialized");

    messaging.onBackgroundMessage(async (payload) => {
      try {
        await maybeShowByTag(payload);
      } catch (err) {
        console.warn("[FMSW] maybeShowByTag failed", err);
      }

      const hasTag = !!payload?.data?.tag;
      if (hasTag) return;

      const title = payload?.notification?.title || payload?.data?.title;
      if (!title) {
        console.warn("[FMSW] Skipping notification: missing title");
        return;
      }

      const options = {
        body: payload?.notification?.body || payload?.data?.body || "",
        icon: payload?.data?.icon || "/pwa-192x192.png",
        data: payload?.data || {},
      };

      self.registration.showNotification(title, options);
    });
  }
} catch (err) {
  console.warn("[FMSW] Firebase initialization failed", err);
}
