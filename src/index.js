// Importing the core React library.
// React is a JavaScript library for building user interfaces.
import React from "react";

// Importing a tool from React that allows us to render our app onto the webpage.
import ReactDOM from "react-dom/client";

// Importing BrowserRouter from the React Router library.
// This allows us to set up page navigation (like going from home page to about page) without refreshing the page.
import { BrowserRouter } from "react-router";

// Importing the main App component.
// This is the root of your entire application — all other components will be children of this.
import App from "./App";

// This file allows you to measure how well your app is performing.
// It’s useful for analyzing performance issues, but totally optional.
import reportWebVitals from "./reportWebVitals";

// This line finds the HTML element on the page with the ID of "root".
// That's where our entire React app will be displayed.
const root = ReactDOM.createRoot(document.getElementById("root"));

// This tells React to render (display) our application inside the root element we found above.
root.render(
  // BrowserRouter wraps our entire app and enables navigation between different pages.
  <BrowserRouter>
    {/* StrictMode is a tool that helps catch problems in development.
        It doesn’t affect how the app runs, but warns you about potential issues. */}
    <React.StrictMode>
      {/* Here we render the actual App component — this is your entire application. */}
      <App />
    </React.StrictMode>
  </BrowserRouter>
);

// This optional function can help you track how well your app performs (load times, etc.).
// You can choose to log the results to the console or send them to an analytics tool.
reportWebVitals();
