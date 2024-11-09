// src/firebase.js

import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { toast } from "react-toastify";

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
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Function to register the service worker and get the FCM token
export const requestForToken = async () => {
  try {
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );
    // console.log("Service Worker registered with scope:", registration.scope);

    const currentToken = await getToken(messaging, {
      serviceWorkerRegistration: registration,
    });
    if (currentToken) {
      console.log("FCM Token:", currentToken);
      return currentToken;
    } else {
      console.log(
        "No registration token available. Request permission to generate one."
      );
    }
  } catch (error) {
    console.error("An error occurred while retrieving token:", error);
  }
};

onMessage(messaging, (payload) => {
  console.log("Received FCM payload: ", payload);

  toast.info(`${payload.notification.title}: ${payload.notification.body}`);
});

// Listener for foreground messages
// export const onMessageListener = () =>
//     new Promise((resolve) => {
//       // Hardcoded payload for testing purposes
//       const testPayload = {
//         notification: {
//           title: "Test Notification",
//           body: "This is a test notification message.",
//           icon: "/path-to-icon.png", // Optional icon path
//         },
//       };

//       // Immediately resolve with the test payload for testing
//       console.log("Simulating payload: ", testPayload);
//       resolve(testPayload);

//       // Also handle real FCM messages when they come in
//       onMessage(messaging, (payload) => {
//         console.log("Received FCM payload: ", payload);
//         resolve(payload);
//       });
//     });

export default app;
