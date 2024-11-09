// public/firebase-messaging-sw.js

/* eslint-env serviceworker */
/* global importScripts */

importScripts("https://www.gstatic.com/firebasejs/8.3.2/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.3.2/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyDSbPzFP2deH83yZaeqsfX6YloTqIpJYZY",
  authDomain: "happy-donors-57276.firebaseapp.com",
  projectId: "happy-donors-57276",
  storageBucket: "happy-donors-57276.firebasestorage.app",
  messagingSenderId: "839220046299",
  appId: "1:839220046299:web:b4c148b7d33251e84a1ffe",
  measurementId: "G-VX9F36K38W",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage((payload) => {
//   console.log("Received background message:", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
