// src/main.jsx

import { createRoot } from "react-dom/client";
import App from "./App";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const root = createRoot(document.getElementById("root"));

// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker
//     .register("/firebase-messaging-sw.js")
//     .then((registration) => {
//       console.log("Service Worker registered with scope:", registration.scope);
//     })
//     .catch((error) => {
//       console.error("Service Worker registration failed:", error);
//     });
// }

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
