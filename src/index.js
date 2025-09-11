// Core React import for building UI components.
import React from "react";

// ReactDOM provides methods to interact with the DOM.
import ReactDOM from "react-dom/client";

// Enables client-side routing without full page reloads.
import { BrowserRouter } from "react-router";

// Main application component.
import App from "./App";

// Auth context provider for managing user authentication state.
import { AuthProvider } from "./contexts/AuthContext";

// Utility for measuring app performance (optional).
import reportWebVitals from "./reportWebVitals";

const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === "string" &&
    args[0].includes(
      "ResizeObserver loop completed with undelivered notifications"
    )
  ) {
    return; // ignore this specific warning
  }
  originalConsoleError(...args);
};

// Initialize React root rendering at the #root DOM element.
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the app wrapped in BrowserRouter for routing and StrictMode for highlighting potential problems.
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>
  </BrowserRouter>
);

// Start measuring app performance (optional; can log results or send to analytics).
reportWebVitals();
