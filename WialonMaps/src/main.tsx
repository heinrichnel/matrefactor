import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Initialize Wialon SDK
const wialonScript = document.createElement("script");
wialonScript.src = "https://hst-api.wialon.com/wsdk/script/wialon.js";
document.head.appendChild(wialonScript);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
