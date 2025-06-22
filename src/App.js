// Importing Route and Routes from the "react-router-dom" package.
// These are used to define different pages (also called "routes") in your application.
import { Route, Routes } from "react-router-dom";

// Importing the component for the Dashboard page.
// This will be shown when the user is on the home page ("/").
import Dashboard from './pages/dashboard';

// Importing the component for an individual project page.
// This will be shown when the user visits a specific project's page, like "/project/123".
import PageTemplate from './pages/pageTemplate';

// This is the main App component — it's the heart of your app.
// It defines which pages (components) to show based on the URL the user is visiting.
function App() {
  return (
    // Routes is a special component from React Router.
    // It holds all the Route elements and decides which one to display based on the current URL.
    <Routes>
      
      {/* This Route defines what to show at the homepage ("/").
          When a user goes to "yourwebsite.com/", the Dashboard component will be displayed. */}
      <Route path="/" element={<Dashboard />} />

      {/* This Route handles dynamic URLs like "/project/123" or "/project/hello-world".
          ":id" is a placeholder for any project ID or name.
          Whatever value comes after "/project/" will be passed to the PageTemplate component. */}
      <Route path="/project/:id" element={<PageTemplate />} />
    </Routes>
  );
}

// This line makes the App component available to be used in other files.
// In this case, index.js imports it and renders it onto the page.
export default App;
