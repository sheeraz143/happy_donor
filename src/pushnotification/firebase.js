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

// Function to register the service worker, get FCM token, and listen for messages
export const requestForToken = async (onMessageReceived) => {
  try {
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    const currentToken = await getToken(messaging, {
      serviceWorkerRegistration: registration,
    });
    if (currentToken) {
      // console.log("FCM Token:", currentToken);
      return currentToken;
    } else {
      console.log(
        "No registration token available. Request permission to generate one."
      );
    }
  } catch (error) {
    console.error("An error occurred while retrieving token:", error);
  }

  // Set up the onMessage listener for foreground messages
  onMessage(messaging, (payload) => {
    console.log("Received FCM payload: ", payload);
    toast.info(`${payload.notification.title}: ${payload.notification.body}`);

    // Trigger the callback to refresh notifications in Navbar
    if (onMessageReceived) onMessageReceived();
  });
};

export default app;
