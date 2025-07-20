// Core React import for building UI components.
import React from "react";

// ReactDOM provides methods to interact with the DOM.
import ReactDOM from "react-dom/client";

// Enables client-side routing without full page reloads.
import { BrowserRouter } from "react-router";

// Main application component.
import App from "./App";

// Utility for measuring app performance (optional).
import reportWebVitals from "./reportWebVitals";

// Initialize React root rendering at the #root DOM element.
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the app wrapped in BrowserRouter for routing and StrictMode for highlighting potential problems.
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>
);

// Start measuring app performance (optional; can log results or send to analytics).
reportWebVitals();
