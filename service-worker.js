importScripts("https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js");

const messaging = firebase.messaging();

self.addEventListener("install", (event) => {
  console.log("Service Worker installed.");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated.");
  event.waitUntil(self.clients.claim());
});

// Listen for background messages from Firebase
messaging.onBackgroundMessage((payload) => {
  console.log("[service-worker.js] Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Listen for messages from the app (if needed)
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    console.log("Skipping waiting and activating new Service Worker.");
    self.skipWaiting();
  }
});