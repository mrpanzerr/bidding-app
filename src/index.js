// Importing the core React library.
import React from "react";

// Importing a tool from React that allows us to render our app onto the webpage.
import ReactDOM from "react-dom/client";

// Importing BrowserRouter from the React Router library.
// This allows us to set up page navigation without refreshing the page.
import { BrowserRouter } from "react-router";

// Importing the main App component.
import App from "./App";

// This file allows you to measure how well your app is performing.
// It’s useful for analyzing performance issues, but optional.
import reportWebVitals from "./reportWebVitals";

// This line finds the HTML element on the page with the ID of "root".
const root = ReactDOM.createRoot(document.getElementById("root"));

// This tells React to render (display) our application inside the root element we found above.
root.render(
  // BrowserRouter wraps our entire app and enables navigation between different pages.
  <BrowserRouter>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>
);

// This optional function can help you track how well your app performs (load times, etc.).
// You can choose to log the results to the console or send them to an analytics tool.
reportWebVitals();
