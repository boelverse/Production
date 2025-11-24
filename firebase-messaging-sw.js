// firebase-messaging-sw.js

// Keep your basic lifecycle handlers
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

// Import Firebase compat SDKs
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');

// Same config as in your app / sw.js
const firebaseConfig = {
  apiKey: "AIzaSyCTA3NZsYoSeGskrIL_2isF2aCqLpEsRYc",
  authDomain: "rbgh-app.firebaseapp.com",
  databaseURL: "https://rbgh-app-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "rbgh-app",
  storageBucket: "rbgh-app.firebasestorage.app",
  messagingSenderId: "955092745966",
  appId: "1:955092745966:web:237adaa1a37752a93ebdff",
  measurementId: "G-004FZK6EXT",
};

try {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  // Log for debugging
  console.log('[FMSW] Firebase Messaging initialized in firebase-messaging-sw.js');

  messaging.onBackgroundMessage(function(payload) {
    console.log('[FMSW] Background message received', payload);

    const title =
      payload?.notification?.title ||
      payload?.data?.title ||
      "Notification";

    const options = {
      body:
        payload?.notification?.body ||
        payload?.data?.body ||
        "",
      icon: payload?.data?.icon || "/pwa-192x192.png",
      data: payload?.data || {},
    };

    self.registration.showNotification(title, options);
  });
} catch (err) {
  console.warn('[FMSW] Firebase messaging not initialized', err);
}
