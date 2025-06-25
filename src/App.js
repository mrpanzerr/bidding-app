// Importing Route and Routes from the "react-router-dom" package.
import { Route, Routes } from "react-router-dom";

// Importing the component for the Dashboard page.
// This will be shown when the user is on the home page ("/").
import Dashboard from './pages/dashboard';

// Importing the component for an individual project page.
// This will be shown when the user visits a specific project's page, like "/project/123".
import TitlePage from './pages/titlePage';

// Importing the component for the section form.
// This component will handle the form for adding or editing sections.
import SqftCalculator from './components/sqftCalculator';

// Main App component that sets up the routing for the application.
function App() {
  return (
    <Routes>
      
      {/* This Route defines what to show at the homepage ("/").
          When a user goes to "yourwebsite.com/", the Dashboard component will be displayed. */}
      <Route path="/" element={<Dashboard />} />

      {/* This Route handles dynamic URLs like "/project/123" or "/project/hello-world".
          ":id" is a placeholder for any project ID or name.
          Whatever value comes after "/project/" will be passed to the PageTemplate component. */}
      <Route path="/project/:id" element={<TitlePage />} />
      
      {/* These Routes handle the calculator pages */}
      <Route path="/section/:id/sqftcalculator" element={<SqftCalculator />} />

    </Routes>
  );
}

// This line makes the App component available to be used in other files.
// In this case, index.js imports it and renders it onto the page.
export default App;
