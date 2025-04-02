importScripts(
  "https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js"
);

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyCTA3NZsYoSeGskrIL_2isF2aCqLpEsRYc",
  appId: "1:955092745966:web:237adaa1a37752a93ebdff",
  messagingSenderId: "955092745966",
  projectId: "rbgh-app",
  authDomain: "rbgh-app.firebaseapp.com",
  storageBucket: "rbgh-app.appspot.com",
  measurementId: "G-004FZK6EXT",
  databaseURL:
    "https://rbgh-app-default-rtdb.europe-west1.firebasedatabase.app/",
});

// Necessary to receive background messages:
const messaging = firebase.messaging();

// Optional:
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});