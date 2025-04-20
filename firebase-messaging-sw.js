importScripts("https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCTA3NZsYoSeGskrIL_2isF2aCqLpEsRYc",
  appId: "1:955092745966:web:237adaa1a37752a93ebdff",
  messagingSenderId: "955092745966",
  projectId: "rbgh-app",
  authDomain: "rbgh-app.firebaseapp.com",
  storageBucket: "rbgh-app.appspot.com",
  measurementId: "G-004FZK6EXT",
  databaseURL: "https://rbgh-app-default-rtdb.europe-west1.firebasedatabase.app/",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[Service Worker] Background message received", payload);

  const title = payload.data.title || "Notification";
  const options = {
    body: payload.data.body,
    icon: payload.data.icon || "/images/icons/icon-192x192.png",
  };

  self.registration.showNotification(title, options);
});
